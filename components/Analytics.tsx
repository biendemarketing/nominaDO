
import React, { useMemo, useState } from 'react';
import Card from './Card';
import { Employee, Contract, EmployeeStatus } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Users, DollarSign, Clock, Download, FileText, Sheet, FileDown, LineChart as LineChartIcon, BarChartBig } from './icons';
import AnalyticsDetailModal from './AnalyticsDetailModal';


interface AnalyticsProps {
    employees: Employee[];
    contracts: Contract[];
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    footer?: string;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, footer, onClick }) => {
  const cardContent = (
    <Card className={`transition-all duration-300 ${onClick ? 'hover:shadow-lg hover:border-secondary/50' : ''}`}>
      <div className="flex items-center">
        <div className="p-3 bg-secondary/10 rounded-lg">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
        </div>
      </div>
      {footer && <p className="text-xs text-gray-400 mt-4">{footer}</p>}
    </Card>
  );

  return onClick ? <button onClick={onClick} className="text-left w-full">{cardContent}</button> : cardContent;
};


const Analytics: React.FC<AnalyticsProps> = ({ employees, contracts }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; columns: any[]; data: any[] }>({ title: '', columns: [], data: [] });

  const availableYears = useMemo(() => {
    const years = new Set(contracts.map(c => new Date(c.startDate).getFullYear()));
    return ['all', ...Array.from(years).sort((a, b) => b - a)];
  }, [contracts]);
  
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const filteredData = useMemo(() => {
    let filteredEmployees = employees;
    let filteredContracts = contracts;

    if (selectedYear !== 'all') {
        const year = parseInt(selectedYear);
        const startDate = new Date(year, selectedMonth !== 'all' ? parseInt(selectedMonth) : 0, 1);
        const endDate = new Date(year, selectedMonth !== 'all' ? parseInt(selectedMonth) + 1 : 12, 0);

        // Employees active during the period
        const activeEmployeeIds = new Set(
            contracts
                .filter(c => {
                    const contractStart = new Date(c.startDate);
                    const contractEnd = c.endDate ? new Date(c.endDate) : new Date('2999-12-31'); // Far future for indefinite
                    return contractStart <= endDate && contractEnd >= startDate;
                })
                .map(c => c.employeeId)
        );
         filteredEmployees = employees.filter(e => activeEmployeeIds.has(e.id));
    }
    return { filteredEmployees, filteredContracts: contracts }; // Return all contracts for historical analysis
  }, [employees, contracts, selectedYear, selectedMonth]);

  const { filteredEmployees } = filteredData;
  
  const handleDownload = (format: 'pdf' | 'csv' | 'xlsx') => {
    alert(`Simulando descarga de reporte analítico en formato ${format.toUpperCase()}...`);
    console.log({
        period: `${selectedMonth === 'all' ? 'Todo el año' : months[parseInt(selectedMonth)]} ${selectedYear}`,
        kpis: {
            headcount: filteredEmployees.length,
        },
    });
  };

  const handleKpiClick = (kpi: 'headcount' | 'hires' | 'terminations') => {
    let title = '';
    let columns: { header: string; accessor: keyof Employee | 'startDate' | 'endDate' }[] = [];
    let data: any[] = [];
    
    const yearToAnalyze = selectedYear === 'all' ? new Date().getFullYear() : parseInt(selectedYear);
    
    switch(kpi) {
        case 'headcount':
            title = 'Detalle de Empleados Activos';
            columns = [{header: 'Nombre', accessor: 'name'}, {header: 'Posición', accessor: 'position'}, {header: 'Departamento', accessor: 'department'}, {header: 'Salario', accessor: 'salary'}];
            data = filteredEmployees;
            break;
        case 'hires':
            title = `Contrataciones en ${yearToAnalyze}`;
            columns = [{header: 'Nombre', accessor: 'name'}, {header: 'Departamento', accessor: 'department'}, {header: 'Fecha de Inicio', accessor: 'startDate'}];
            const hiredEmployeeIds = new Set(contracts.filter(c => new Date(c.startDate).getFullYear() === yearToAnalyze).map(c => c.employeeId));
            data = employees.filter(e => hiredEmployeeIds.has(e.id)).map(e => ({...e, startDate: contracts.find(c => c.employeeId === e.id)?.startDate }));
            break;
        case 'terminations':
            title = `Terminaciones en ${yearToAnalyze}`;
            columns = [{header: 'Nombre', accessor: 'name'}, {header: 'Departamento', accessor: 'department'}, {header: 'Fecha de Salida', accessor: 'endDate'}];
            const terminatedEmployeeIds = new Set(contracts.filter(c => c.endDate && new Date(c.endDate).getFullYear() === yearToAnalyze).map(c => c.employeeId));
            data = employees.filter(e => terminatedEmployeeIds.has(e.id)).map(e => ({...e, endDate: contracts.find(c => c.employeeId === e.id)?.endDate }));
            break;
    }

    setModalContent({ title, columns, data });
    setIsDetailModalOpen(true);
  };
  
  const hiresTerminationsData = useMemo(() => {
    const yearToAnalyze = selectedYear === 'all' ? new Date().getFullYear() : parseInt(selectedYear);
    return months.map((month, index) => {
        const hires = contracts.filter(c => {
            const d = new Date(c.startDate);
            return d.getFullYear() === yearToAnalyze && d.getMonth() === index;
        }).length;
        const terminations = contracts.filter(c => {
             if (c.status === 'Activo' || !c.endDate) return false;
             const d = new Date(c.endDate);
             return d.getFullYear() === yearToAnalyze && d.getMonth() === index;
        }).length;
        return { name: month.substring(0,3), Contrataciones: hires, Terminaciones: terminations };
    });
  }, [contracts, selectedYear]);

  const departmentCostData = useMemo(() => {
      const costs = filteredEmployees.reduce((acc, e) => {
        acc[e.department] = (acc[e.department] || 0) + e.salary;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(costs).map(([name, value]) => ({ name, Costo: value })).sort((a,b) => a.Costo - b.Costo);
  }, [filteredEmployees]);

  const COLORS = ['#0A2540', '#2ECC71', '#F39C12', '#3B82F6', '#8B5CF6', '#EF4444'];
  const formatCompact = (amount: number) => `DOP ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(amount)}`;

  return (
    <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="font-heading text-3xl font-bold text-primary">Analítica Avanzada</h1>
                <p className="text-gray-500 mt-1">Obtén una visión inteligente de tu fuerza laboral.</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-white p-2 rounded-lg border">
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="font-semibold bg-light p-2 rounded-md border-none focus:ring-2 focus:ring-secondary/50">
                    {availableYears.map(y => <option key={y} value={y}>{y === 'all' ? 'Todo el Tiempo' : y}</option>)}
                </select>
                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} disabled={selectedYear === 'all'} className="font-semibold bg-light p-2 rounded-md border-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50">
                    <option value="all">Todo el Año</option>
                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                 <div className="relative group">
                    <button className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all">
                        <Download className="w-5 h-5 mr-2" /> Descargar Reporte
                    </button>
                    <div className="absolute top-full right-0 mt-1 w-full bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <a onClick={() => handleDownload('pdf')} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-light cursor-pointer"><FileText className="w-4 h-4 mr-2 text-red-500" /> PDF</a>
                        <a onClick={() => handleDownload('xlsx')} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-light cursor-pointer"><Sheet className="w-4 h-4 mr-2 text-green-600" /> Excel</a>
                        <a onClick={() => handleDownload('csv')} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-light cursor-pointer"><FileDown className="w-4 h-4 mr-2 text-gray-500" /> CSV</a>
                    </div>
                </div>
            </div>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <StatCard icon={<Users className="w-6 h-6 text-secondary" />} title="Total Empleados" value={filteredEmployees.length.toString()} footer="Activos en el período" onClick={() => handleKpiClick('headcount')} />
            <StatCard icon={<DollarSign className="w-6 h-6 text-secondary" />} title="Costo Mensual Total" value={formatCompact(filteredEmployees.reduce((acc, e) => acc + e.salary, 0))} footer="Salarios en el período" />
            <StatCard icon={<LineChartIcon className="w-6 h-6 text-secondary" />} title="Contrataciones (Año)" value={hiresTerminationsData.reduce((acc, d) => acc + d.Contrataciones, 0).toString()} footer={`En ${selectedYear === 'all' ? new Date().getFullYear() : selectedYear}`} onClick={() => handleKpiClick('hires')} />
            <StatCard icon={<BarChartBig className="w-6 h-6 text-secondary" />} title="Terminaciones (Año)" value={hiresTerminationsData.reduce((acc, d) => acc + d.Terminaciones, 0).toString()} footer={`En ${selectedYear === 'all' ? new Date().getFullYear() : selectedYear}`} onClick={() => handleKpiClick('terminations')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <Card>
                <h2 className="text-lg font-bold font-heading text-primary mb-1">Contrataciones vs. Terminaciones</h2>
                <p className="text-sm text-gray-500 mb-4">Tendencia mensual para {selectedYear === 'all' ? new Date().getFullYear() : selectedYear}</p>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={hiresTerminationsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Contrataciones" stroke="#2ECC71" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Terminaciones" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h2 className="text-lg font-bold font-heading text-primary mb-1">Costo Salarial por Departamento</h2>
                <p className="text-sm text-gray-500 mb-4">Costo mensual total para el período seleccionado</p>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={departmentCostData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickFormatter={formatCompact} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => formatCompact(value)} cursor={{fill: 'rgba(46, 204, 113, 0.1)'}} />
                            <Bar dataKey="Costo" fill="#0A2540" radius={[0, 4, 4, 0]}>
                                {departmentCostData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
      </div>
      <AnalyticsDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={modalContent.title}
        columns={modalContent.columns}
        data={modalContent.data}
      />
    </div>
  );
};

export default Analytics;
