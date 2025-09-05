import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Calculator, UserX, ArrowLeft, Eye } from './icons';
import { Employee, Contract, LiquidacionResult, LiquidacionRun, PendingLiquidation, EmployeeStatus } from '../types';
import LiquidacionDetailModal from './LiquidacionDetailModal';
import LiquidacionTemplateModal from './LiquidacionTemplateModal';

interface LiquidacionesProps {
    employees: Employee[];
    contracts: Contract[];
    liquidaciones: LiquidacionRun[];
    pendingLiquidation: PendingLiquidation | null;
    onAddLiquidation: (liquidation: LiquidacionRun) => void;
}

const Liquidaciones: React.FC<LiquidacionesProps> = ({ employees, contracts, liquidaciones, pendingLiquidation, onAddLiquidation }) => {
    const [view, setView] = useState<'list' | 'calculator'>('list');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [terminationReason, setTerminationReason] = useState<'Despido' | 'Renuncia' | 'Mutuo Acuerdo'>('Despido');
    const [liquidacionResult, setLiquidacionResult] = useState<LiquidacionResult | null>(null);
    const [detailModalData, setDetailModalData] = useState<LiquidacionRun | null>(null);
    const [templateModalData, setTemplateModalData] = useState<LiquidacionRun | null>(null);

    const activeEmployees = employees.filter(e => e.status !== EmployeeStatus.TERMINATED);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });

    const calculateLiquidacionLogic = (employee: Employee, contract: Contract, reason: 'Despido' | 'Renuncia' | 'Mutuo Acuerdo'): LiquidacionResult => {
        const daysWorked = (new Date().getTime() - new Date(contract.startDate).getTime()) / (1000 * 3600 * 24);
        const yearsWorked = daysWorked / 365;

        let preaviso = 0;
        if (reason === 'Despido') {
            if (daysWorked > 3 * 30 && daysWorked <= 6 * 30) preaviso = (employee.salary / 30) * 7;
            else if (daysWorked > 6 * 30 && daysWorked <= 12 * 30) preaviso = (employee.salary / 30) * 14;
            else if (daysWorked > 12 * 30) preaviso = (employee.salary / 30) * 28;
        }

        let cesantia = 0;
        if (reason !== 'Renuncia') {
             if (yearsWorked >= 5) cesantia = (employee.salary / 30) * (23 * 5 + (21 * (Math.floor(yearsWorked) - 5)));
             else if (yearsWorked >= 1) cesantia = (employee.salary / 30) * 21 * Math.floor(yearsWorked);
             else if (daysWorked >= (3 * 30)) cesantia = (employee.salary / 30) * 6 * Math.floor(daysWorked / 30);
        }
        
        const vacaciones = (employee.salary / 23.83) * 14 * yearsWorked; 
        const salario13 = employee.salary * ((new Date().getMonth() + 1) / 12); 
        const total = preaviso + cesantia + vacaciones + salario13;

        return { employee, preaviso, cesantia, vacaciones, salario13, total };
    };

    useEffect(() => {
        if (pendingLiquidation) {
            setView('calculator');
            setSelectedEmployeeId(pendingLiquidation.employeeId);
            setTerminationReason(pendingLiquidation.reason);
            const employee = employees.find(e => e.id === pendingLiquidation.employeeId);
            const contract = contracts.find(c => c.employeeId === pendingLiquidation.employeeId);
            if (employee && contract) {
                const result = calculateLiquidacionLogic(employee, contract, pendingLiquidation.reason);
                setLiquidacionResult(result);
            }
        }
    }, [pendingLiquidation, employees, contracts]);

    const handleCalculateClick = () => {
        const employee = employees.find(e => e.id === selectedEmployeeId);
        const contract = contracts.find(c => c.employeeId === selectedEmployeeId);
        if (!employee || !contract) return;
        const result = calculateLiquidacionLogic(employee, contract, terminationReason);
        setLiquidacionResult(result);
    };

    const handleConfirmAndGenerate = () => {
        if (!liquidacionResult) return;
        const newLiquidationRun: LiquidacionRun = {
            id: `liq-${String(liquidaciones.length + 1).padStart(3, '0')}`,
            processedDate: new Date().toISOString().split('T')[0],
            reason: terminationReason,
            ...liquidacionResult,
        };
        onAddLiquidation(newLiquidationRun);
        setTemplateModalData(newLiquidationRun);
        
        // Reset view
        setView('list');
        setLiquidacionResult(null);
        setSelectedEmployeeId('');
    };

    const renderListView = () => (
        <Card>
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-xl font-bold text-primary">Historial de Liquidaciones</h3>
                <button onClick={() => setView('calculator')} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
                    <UserX className="w-5 h-5 mr-2" /> Añadir Nueva Liquidación
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-light">
                            <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Empleado</th>
                            <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Total</th>
                            <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liquidaciones.map(l => (
                            <tr key={l.id} className="border-b last:border-0 hover:bg-light">
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <img src={l.employee.avatarUrl} alt={l.employee.name} className="w-10 h-10 rounded-full mr-4" />
                                        <div>
                                            <p className="font-semibold text-primary">{l.employee.name}</p>
                                            <p className="text-sm text-gray-500">{l.employee.position}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-700">{formatDate(l.processedDate)}</td>
                                <td className="py-4 px-6 font-bold text-primary text-right">{formatCurrency(l.total)}</td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => setDetailModalData(l)} className="flex items-center text-secondary hover:underline font-semibold text-sm">
                                            <Eye className="w-4 h-4 mr-1"/> Ver Detalles
                                        </button>
                                        <button onClick={() => setTemplateModalData(l)} className="flex items-center text-blue-600 hover:underline font-semibold text-sm">
                                            Ver Documento
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const renderCalculatorView = () => (
        <Card>
            <button onClick={() => setView('list')} className="flex items-center text-secondary hover:text-secondary/80 font-semibold mb-6 p-1 rounded-md transition-colors hover:bg-secondary/10">
                <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Historial
            </button>
            <h3 className="font-heading text-xl font-bold text-primary">Calculadora de Liquidación</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">Selecciona un empleado y el motivo para calcular sus prestaciones.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end p-4 bg-light rounded-lg border">
                <div>
                    <label htmlFor="employee" className="block text-sm font-semibold text-gray-600 mb-2">Empleado</label>
                    <select id="employee" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                        <option value="">-- Seleccionar --</option>
                        {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-semibold text-gray-600 mb-2">Motivo de Salida</label>
                    <select id="reason" value={terminationReason} onChange={(e) => setTerminationReason(e.target.value as any)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                        <option>Despido</option>
                        <option>Renuncia</option>
                        <option>Mutuo Acuerdo</option>
                    </select>
                </div>
                <div className="col-span-full text-right">
                    <button onClick={handleCalculateClick} disabled={!selectedEmployeeId} className="flex items-center ml-auto bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <Calculator className="w-5 h-5 mr-2" /> Calcular
                    </button>
                </div>
            </div>

            {liquidacionResult && (
                <div className="mt-8">
                    <h4 className="font-heading text-lg font-bold text-primary mb-4">Resultado del Cálculo</h4>
                    <Card>
                        <div className="flex items-center mb-4 pb-4 border-b">
                            <img src={liquidacionResult.employee.avatarUrl} alt={liquidacionResult.employee.name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-bold text-primary">{liquidacionResult.employee.name}</p>
                                <p className="text-sm text-gray-500">{liquidacionResult.employee.position}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Preaviso:</span><span className="font-semibold">{formatCurrency(liquidacionResult.preaviso)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Auxilio de Cesantía:</span><span className="font-semibold">{formatCurrency(liquidacionResult.cesantia)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Vacaciones (proporcional):</span><span className="font-semibold">{formatCurrency(liquidacionResult.vacaciones)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Salario de Navidad (proporcional):</span><span className="font-semibold">{formatCurrency(liquidacionResult.salario13)}</span></div>
                        </div>
                        <div className="flex justify-between mt-4 pt-4 border-t-2 font-bold text-lg">
                            <span>TOTAL A PAGAR:</span>
                            <span className="text-secondary">{formatCurrency(liquidacionResult.total)}</span>
                        </div>
                         <div className="mt-6 text-right">
                            <button onClick={handleConfirmAndGenerate} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-all">
                                Confirmar y Generar Documento
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    );

    return (
        <div className="p-8">
            <h1 className="font-heading text-3xl font-bold text-primary">Liquidaciones</h1>
            <p className="text-gray-500 mt-1">Calcula y gestiona las prestaciones laborales de tus empleados.</p>

            <div className="mt-8">
                {view === 'list' ? renderListView() : renderCalculatorView()}
            </div>

            {detailModalData && (
                <LiquidacionDetailModal
                    isOpen={!!detailModalData}
                    onClose={() => setDetailModalData(null)}
                    data={detailModalData}
                />
            )}
            
            {templateModalData && (
                <LiquidacionTemplateModal
                    isOpen={!!templateModalData}
                    onClose={() => setTemplateModalData(null)}
                    data={templateModalData}
                    contract={contracts.find(c => c.employeeId === templateModalData.employee.id)}
                />
            )}
        </div>
    );
};

export default Liquidaciones;
