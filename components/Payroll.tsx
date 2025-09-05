
import React, { useState } from 'react';
import Card from './Card';
import { Calculator, Award, HandCoins, History, Eye, CheckCircle, ArrowLeft, FileText, Sheet, FileDown } from './icons';
import { MOCK_PAYROLL_HISTORY } from '../constants';
import { Employee, EmployeeStatus, RegaliaResult, BonificacionResult, RegularPayrollResult, PayrollNovelty, PayslipData, PayrollRun } from '../types';
import PayslipModal from './PayslipModal';

// Fix: Add props interface to accept employees data
interface PayrollProps {
  employees: Employee[];
}

type SpecialPayrollType = 'regalia' | 'bonificacion';
type PayrollView = 'main' | 'run_wizard' | 'history' | 'history_detail';

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm rounded-t-lg border-b-2 transition-all duration-200 ${
            isActive
                ? 'border-secondary text-primary bg-white'
                : 'border-transparent text-gray-500 hover:text-primary hover:bg-gray-50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const WizardStep: React.FC<{ number: number; label: string; isActive: boolean; isCompleted: boolean }> = ({ number, label, isActive, isCompleted }) => (
    <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? 'bg-secondary text-white' : isCompleted ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : number}
        </div>
        <span className={`ml-3 font-semibold ${isActive ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
    </div>
);


// Fix: Use PayrollProps and destructure employees from props
const Payroll: React.FC<PayrollProps> = ({ employees }) => {
  // View State
  const [currentView, setCurrentView] = useState<PayrollView>('main');
  const [selectedHistoryRun, setSelectedHistoryRun] = useState<PayrollRun | null>(null);

  // Common State
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  // Nómina Regular Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [payrollPeriod, setPayrollPeriod] = useState('1ra Quincena Julio 2024');
  const [payrollResults, setPayrollResults] = useState<RegularPayrollResult[]>([]);
  const [novelties, setNovelties] = useState<Record<string, PayrollNovelty>>({});
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);
  
  // Nóminas Especiales State
  const [activeSpecialTab, setActiveSpecialTab] = useState<SpecialPayrollType>('regalia');
  
  // Regalía State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [regaliaResults, setRegaliaResults] = useState<RegaliaResult[]>([]);
  const [showRegaliaResults, setShowRegaliaResults] = useState(false);

  // Bonificación State
  const [totalBeneficios, setTotalBeneficios] = useState<number>(500000);
  const [bonificacionResults, setBonificacionResults] = useState<BonificacionResult[]>([]);
  const [showBonificacionResults, setShowBonificacionResults] = useState(false);

  const handleNoveltyChange = (employeeId: string, field: keyof PayrollNovelty, value: number) => {
    setNovelties(prev => ({
        ...prev,
        [employeeId]: {
            ...prev[employeeId] || { overtimeHours: 0, absenceDeductions: 0, damageDeductions: 0 },
            [field]: value >= 0 ? value : 0,
        }
    }));
  };

  const calculateISR = (annualSalary: number): number => {
    let annualISR = 0;
    if (annualSalary > 867123.01) {
        annualISR = 79776 + (annualSalary - 867123.00) * 0.25;
    } else if (annualSalary > 624329.01) {
        annualISR = 31216 + (annualSalary - 624329.00) * 0.20;
    } else if (annualSalary > 416220.01) {
        annualISR = (annualSalary - 416220.00) * 0.15;
    }
    return annualISR / 24; // Return bi-weekly ISR
  };

  // Fix: Use employees prop instead of MOCK_EMPLOYEES
  const generatePayrollResults = () => {
    const SFS_CAP = 177650;
    const AFP_CAP = 355300;
    
    return employees
      .filter(e => e.status === EmployeeStatus.ACTIVE)
      .map(employee => {
        const novelty = novelties[employee.id] || { overtimeHours: 0, absenceDeductions: 0, damageDeductions: 0 };
        const basePay = employee.salary / 2;
        const overtimePay = (employee.salary / 23.83 / 8) * novelty.overtimeHours * 1.35;
        const grossPay = basePay + overtimePay;
        
        let sfs = 0;
        let afp = 0;
        // Only calculate TSS if employee is marked to pay it (defaults to true)
        if (employee.paysTSS !== false) {
            const sfsBasis = Math.min(employee.salary, SFS_CAP);
            sfs = (sfsBasis / 2) * 0.0304;

            const afpBasis = Math.min(employee.salary, AFP_CAP);
            afp = (afpBasis / 2) * 0.0287;
        }
        
        let isr = 0;
        // Apply different ISR logic for non-residents
        if (employee.isFiscalResident === false) {
            // Non-resident flat tax (simulated 27% on gross income)
            isr = grossPay * 0.27;
        } else {
            // Standard ISR calculation for residents
            const monthlyTSS = sfs * 2 + afp * 2;
            const taxableSalary = employee.salary - monthlyTSS;
            const annualTaxableSalary = taxableSalary * 12;
            isr = calculateISR(annualTaxableSalary);
        }

        const totalDeductions = sfs + afp + isr + novelty.absenceDeductions + novelty.damageDeductions;
        const netPay = grossPay - totalDeductions;
        
        return { employee, grossPay, sfs, afp, isr, novelties: novelty, totalDeductions, netPay };
      });
  }

  const handlePreviewPayroll = () => {
      const results = generatePayrollResults();
      setPayrollResults(results);
      setWizardStep(3);
  };

  const handleProcessPayroll = () => {
      // Here you would typically send data to a backend
      console.log("Processing payroll...", payrollResults);
      setWizardStep(4);
  }
  
  const handleDownload = (format: 'pdf' | 'csv' | 'xlsx', data: RegularPayrollResult[] | PayrollRun) => {
    console.log(`Downloading ${format} with data:`, data);
    alert(`Simulando descarga de archivo ${format.toUpperCase()}.\nRevisa la consola para ver los datos.`);
  };

  const finishWizard = () => {
    setWizardStep(1);
    setNovelties({});
    setPayrollResults([]);
    setCurrentView('main');
  }
  
  // Fix: Use employees prop instead of MOCK_EMPLOYEES
  const handleCalculateRegalia = () => {
    const results = employees
      .filter(e => e.status === EmployeeStatus.ACTIVE)
      .map(employee => ({ employee, amount: employee.salary }));
    setRegaliaResults(results);
    setShowRegaliaResults(true);
  };
  
  // Fix: Use employees prop instead of MOCK_EMPLOYEES
  const handleCalculateBonificacion = () => {
    const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);
    const totalSalaries = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
    const results = activeEmployees.map(employee => ({
        employee,
        amount: (employee.salary / totalSalaries) * totalBeneficios,
    }));
    setBonificacionResults(results);
    setShowBonificacionResults(true);
  };
  
  const handleViewPayslip = (result: RegularPayrollResult, period?: string, payDate?: string) => {
    setSelectedPayslip({
        ...result,
        period: period || payrollPeriod,
        companyName: "Quisqueya Soluciones SRL",
        companyRNC: "1-30-12345-6",
        payDate: payDate || new Date().toISOString().split('T')[0],
    });
  };
  
  const handleViewHistoryDetail = (run: PayrollRun) => {
    // For this simulation, we'll re-use the last calculated results or generate new ones
    // In a real app, you would fetch this data from an API
    if (payrollResults.length === 0) {
        setPayrollResults(generatePayrollResults());
    }
    setSelectedHistoryRun(run);
    setCurrentView('history_detail');
  };

  const totalRegalia = regaliaResults.reduce((acc, result) => acc + result.amount, 0);
  const totalBonificacion = bonificacionResults.reduce((acc, result) => acc + result.amount, 0);
  const totalPayrollNet = payrollResults.reduce((acc, result) => acc + result.netPay, 0);

  const renderRunWizard = () => {
    const steps = [
        { number: 1, label: "Seleccionar Período" },
        { number: 2, label: "Revisar Novedades" },
        { number: 3, label: "Previsualizar Resultados" },
        { number: 4, label: "Confirmar y Procesar" },
    ];
    return (
        <Card>
            <button onClick={() => setCurrentView('main')} className="flex items-center text-secondary hover:text-secondary/80 font-semibold mb-4 p-1 rounded-md transition-colors hover:bg-secondary/10">
                <ArrowLeft className="w-5 h-5 mr-2" /> Volver
            </button>
            <h2 className="font-heading text-xl font-bold text-primary">Correr Nómina Regular</h2>
            <div className="flex justify-between items-center my-6 p-4 bg-light rounded-lg">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <WizardStep number={step.number} label={step.label} isActive={wizardStep === step.number} isCompleted={wizardStep > step.number} />
                        {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>}
                    </React.Fragment>
                ))}
            </div>

            {wizardStep === 1 && (
                <div>
                     <h3 className="font-heading text-lg font-bold text-primary">Paso 1: Seleccionar Período y Tipo de Nómina</h3>
                     <p className="text-gray-500 mt-1 mb-6 text-sm">Elige el período que deseas procesar.</p>
                     <div className="flex items-end space-x-4 p-4 bg-light rounded-lg border border-gray-200/80">
                         <div>
                             <label htmlFor="payrollPeriod" className="block text-sm font-semibold text-gray-600 mb-2">Período de Nómina</label>
                             <select id="payrollPeriod" value={payrollPeriod} onChange={(e) => setPayrollPeriod(e.target.value)} className="w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                                 <option>1ra Quincena Julio 2024</option>
                                 <option>2da Quincena Julio 2024</option>
                                 <option>1ra Quincena Agosto 2024</option>
                                 <option>2da Quincena Agosto 2024</option>
                             </select>
                         </div>
                     </div>
                     <div className="mt-6 text-right">
                        <button onClick={() => setWizardStep(2)} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary/90 transition-all">Siguiente</button>
                     </div>
                </div>
            )}
            
            {wizardStep === 2 && (
                 <div>
                    <h3 className="font-heading text-lg font-bold text-primary">Paso 2: Revisar Novedades de la Quincena</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-sm">Añade horas extras, comisiones, o deducciones por ausencias y daños.</p>
                    <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg">
                        <table className="w-full text-left">
                            <thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Empleado</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Horas Extras</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Desc. Faltas (DOP)</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Desc. Daños (DOP)</th></tr></thead>
                            {/* Fix: Use employees prop instead of MOCK_EMPLOYEES */}
                            <tbody>{employees.filter(e => e.status === EmployeeStatus.ACTIVE).map(e => (<tr key={e.id} className="border-b border-gray-200 last:border-0"><td className="py-2 px-6 font-semibold text-primary">{e.name}</td><td className="py-2 px-6"><input type="number" min="0" className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary/50" value={novelties[e.id]?.overtimeHours || ''} onChange={evt => handleNoveltyChange(e.id, 'overtimeHours', Number(evt.target.value))} /></td><td className="py-2 px-6"><input type="number" min="0" className="w-32 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary/50" value={novelties[e.id]?.absenceDeductions || ''} onChange={evt => handleNoveltyChange(e.id, 'absenceDeductions', Number(evt.target.value))} /></td><td className="py-2 px-6"><input type="number" min="0" className="w-32 px-2 py-1 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary/50" value={novelties[e.id]?.damageDeductions || ''} onChange={evt => handleNoveltyChange(e.id, 'damageDeductions', Number(evt.target.value))} /></td></tr>))}</tbody>
                        </table>
                    </div>
                     <div className="mt-6 flex justify-between">
                        <button onClick={() => setWizardStep(1)} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all">Anterior</button>
                        <button onClick={handlePreviewPayroll} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary/90 transition-all">Previsualizar Nómina</button>
                     </div>
                </div>
            )}

            {wizardStep === 3 && (
                <div>
                    <h3 className="font-heading text-lg font-bold text-primary">Paso 3: Previsualizar Resultados de la Nómina</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-sm">Verifica los cálculos antes de confirmar el procesamiento.</p>
                     <Card className="bg-primary text-white mt-4"><p className="text-gray-300">Total Neto a Pagar ({payrollPeriod})</p><p className="text-3xl font-bold text-secondary mt-1">{formatCurrency(totalPayrollNet)}</p></Card>
                     <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg">
                         <table className="w-full text-left">
                             <thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Empleado</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Salario Bruto</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Total Deducido</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Salario Neto</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th></tr></thead>
                             <tbody>{payrollResults.map(r => (<tr key={r.employee.id} className="border-b border-gray-200 last:border-0 hover:bg-light transition-colors"><td className="py-3 px-6 font-semibold text-primary">{r.employee.name}</td><td className="py-3 px-6 text-gray-700 text-right">{formatCurrency(r.grossPay)}</td><td className="py-3 px-6 text-red-700 font-semibold text-right">({formatCurrency(r.totalDeductions)})</td><td className="py-3 px-6 text-primary font-bold text-right">{formatCurrency(r.netPay)}</td><td className="py-3 px-6 text-center"><button onClick={() => handleViewPayslip(r)} className="text-secondary hover:underline font-semibold">Ver Volante</button></td></tr>))}</tbody>
                         </table>
                     </div>
                     <div className="mt-6 flex justify-between">
                        <button onClick={() => setWizardStep(2)} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all">Anterior</button>
                        <button onClick={handleProcessPayroll} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary/90 transition-all">Confirmar y Procesar</button>
                     </div>
                </div>
            )}
            
            {wizardStep === 4 && (
                 <div className="text-center py-12">
                    <CheckCircle className="w-24 h-24 text-secondary mx-auto mb-4"/>
                    <h3 className="font-heading text-2xl font-bold text-primary">¡Nómina Procesada Exitosamente!</h3>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">La nómina para el período <span className="font-semibold">{payrollPeriod}</span> ha sido confirmada. Se ha pagado un total de <span className="font-semibold">{formatCurrency(totalPayrollNet)}</span> a {payrollResults.length} empleados.</p>
                     <div className="mt-8 border-t pt-6">
                         <h4 className="font-semibold text-gray-700 mb-3">Descargar Reporte</h4>
                         <div className="flex justify-center items-center space-x-3">
                             <button onClick={() => handleDownload('pdf', payrollResults)} className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all"><FileText className="w-5 h-5 mr-2"/> PDF</button>
                             <button onClick={() => handleDownload('xlsx', payrollResults)} className="flex items-center bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-all"><Sheet className="w-5 h-5 mr-2"/> Excel</button>
                             <button onClick={() => handleDownload('csv', payrollResults)} className="flex items-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"><FileDown className="w-5 h-5 mr-2"/> CSV</button>
                         </div>
                    </div>
                    <div className="mt-8">
                        <button onClick={finishWizard} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all">Finalizar</button>
                    </div>
                </div>
            )}
        </Card>
    );
  }
  
  const renderHistory = () => (
    <Card>
        <button onClick={() => setCurrentView('main')} className="flex items-center text-secondary hover:text-secondary/80 font-semibold mb-4 p-1 rounded-md transition-colors hover:bg-secondary/10">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver
        </button>
        <h2 className="font-heading text-xl font-bold text-primary">Historial de Nóminas</h2>
        <p className="text-gray-500 mt-1 mb-6 text-sm">Consulta todas las nóminas procesadas anteriormente.</p>
        <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg">
             <table className="w-full text-left">
                <thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Período</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Neto</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th></tr></thead>
                <tbody>{MOCK_PAYROLL_HISTORY.map(run => (<tr key={run.id} className="border-b border-gray-200 last:border-0 hover:bg-light transition-colors"><td className="py-4 px-6 font-semibold text-primary">{run.period}</td><td className="py-4 px-6 text-gray-700">{new Date(run.processedDate).toLocaleDateString('es-DO')}</td><td className="py-4 px-6 font-bold text-primary text-right">{formatCurrency(run.totalNetPay)}</td><td className="py-4 px-6 text-center"><div className="flex items-center justify-center space-x-2"><button onClick={() => handleViewHistoryDetail(run)} className="flex items-center text-secondary hover:underline font-semibold text-sm"><Eye className="w-4 h-4 mr-1"/> Ver Detalles</button><button onClick={() => handleDownload('pdf', run)} title="Descargar PDF" className="p-1 text-gray-500 hover:text-red-600"><FileText className="w-4 h-4"/></button><button onClick={() => handleDownload('xlsx', run)} title="Descargar Excel" className="p-1 text-gray-500 hover:text-green-700"><Sheet className="w-4 h-4"/></button></div></td></tr>))}</tbody>
            </table>
        </div>
    </Card>
  );
  
  const renderHistoryDetail = () => {
    if (!selectedHistoryRun) return null;
    const detailData = generatePayrollResults();

    return (
        <Card>
            <button onClick={() => setCurrentView('history')} className="flex items-center text-secondary hover:text-secondary/80 font-semibold mb-4 p-1 rounded-md transition-colors hover:bg-secondary/10">
                <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Historial
            </button>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-heading text-xl font-bold text-primary">Detalle de Nómina Histórica</h2>
                    <p className="text-gray-500 mt-1 text-sm">Período: <span className="font-semibold">{selectedHistoryRun.period}</span> | Procesada: <span className="font-semibold">{new Date(selectedHistoryRun.processedDate).toLocaleDateString('es-DO')}</span></p>
                </div>
                 <div className="flex items-center space-x-2">
                     <button onClick={() => handleDownload('pdf', detailData)} className="flex items-center bg-red-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-700 transition-all text-sm"><FileText className="w-4 h-4 mr-1"/> PDF</button>
                     <button onClick={() => handleDownload('xlsx', detailData)} className="flex items-center bg-green-700 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-800 transition-all text-sm"><Sheet className="w-4 h-4 mr-1"/> Excel</button>
                 </div>
            </div>

             <Card className="bg-primary text-white mt-4"><p className="text-gray-300">Total Neto Pagado</p><p className="text-3xl font-bold text-secondary mt-1">{formatCurrency(selectedHistoryRun.totalNetPay)}</p></Card>
             <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg">
                 <table className="w-full text-left">
                     <thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Empleado</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Salario Bruto</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Salario Neto</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th></tr></thead>
                     <tbody>{detailData.map(r => (<tr key={r.employee.id} className="border-b border-gray-200 last:border-0"><td className="py-3 px-6 font-semibold text-primary">{r.employee.name}</td><td className="py-3 px-6 text-gray-700 text-right">{formatCurrency(r.grossPay)}</td><td className="py-3 px-6 text-primary font-bold text-right">{formatCurrency(r.netPay)}</td><td className="py-3 px-6 text-center"><button onClick={() => handleViewPayslip(r, selectedHistoryRun.period, selectedHistoryRun.processedDate)} className="text-secondary hover:underline font-semibold">Ver Volante</button></td></tr>))}</tbody>
                 </table>
             </div>
        </Card>
    );
  }

  const renderMain = () => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col justify-center items-center text-center">
                 <h2 className="font-heading text-xl font-bold text-primary mb-2">Nómina Regular</h2>
                 <p className="text-gray-500 mt-1 mb-6 text-sm max-w-xs">Procesa tus pagos quincenales o mensuales a través de nuestro asistente guiado.</p>
                 <button onClick={() => setCurrentView('run_wizard')} className="flex items-center bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
                    <Calculator className="w-5 h-5 mr-2" /> Correr Nueva Nómina
                </button>
            </Card>
             <Card className="flex flex-col justify-center items-center text-center">
                 <h2 className="font-heading text-xl font-bold text-primary mb-2">Historial de Nóminas</h2>
                 <p className="text-gray-500 mt-1 mb-6 text-sm max-w-xs">Consulta, descarga y gestiona todas las nóminas que has procesado en el pasado.</p>
                 <button onClick={() => setCurrentView('history')} className="flex items-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm">
                    <History className="w-5 h-5 mr-2" /> Ver Historial
                </button>
            </Card>
        </div>
        
        <Card className="mt-6">
            <h2 className="font-heading text-xl font-bold text-primary mb-4">Nóminas Especiales</h2>
            <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-2" aria-label="Tabs"><TabButton icon={<HandCoins className="w-5 h-5"/>} label="Regalía Pascual" isActive={activeSpecialTab === 'regalia'} onClick={() => setActiveSpecialTab('regalia')} /><TabButton icon={<Award className="w-5 h-5"/>} label="Bonificación Anual" isActive={activeSpecialTab === 'bonificacion'} onClick={() => setActiveSpecialTab('bonificacion')} /></nav></div>
            {renderEspecialesContent()}
        </Card>
    </>
  );

  const renderEspecialesContent = () => {
    switch (activeSpecialTab) {
      case 'regalia':
        return (
          <div className="p-6">
            <h3 className="font-heading text-lg font-bold text-primary">Cálculo de Regalía Pascual (Salario 13)</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">Calcula el salario de navidad para tus empleados activos.</p>
            <div className="flex items-end space-x-4 p-4 bg-light rounded-lg border border-gray-200/80">
              <div>
                <label htmlFor="year" className="block text-sm font-semibold text-gray-600 mb-2">Año de Cálculo</label>
                <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                  {[0, 1, 2].map(i => <option key={i}>{new Date().getFullYear() - i}</option>)}
                </select>
              </div>
              <button onClick={handleCalculateRegalia} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm h-11">
                <Calculator className="w-5 h-5 mr-2" /> Calcular Regalía
              </button>
            </div>
            {showRegaliaResults && (
                <div className="mt-6">
                    <Card className="bg-primary text-white"><p className="text-gray-300">Total a Pagar</p><p className="text-3xl font-bold text-secondary mt-1">{formatCurrency(totalRegalia)}</p></Card>
                    <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg"><table className="w-full text-left"><thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Nombre</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Salario Mensual</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Regalía</th></tr></thead><tbody>{regaliaResults.map(({ employee, amount }) => (<tr key={employee.id} className="border-b border-gray-200 last:border-0 hover:bg-light transition-colors"><td className="py-4 px-6"><div className="flex items-center"><img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full mr-4" /><div><p className="font-semibold text-primary">{employee.name}</p><p className="text-sm text-gray-500">{employee.position}</p></div></div></td><td className="py-4 px-6 text-gray-700">{formatCurrency(employee.salary)}</td><td className="py-4 px-6 text-primary font-bold text-right">{formatCurrency(amount)}</td></tr>))}</tbody></table></div>
                </div>
            )}
          </div>
        );
      case 'bonificacion':
        return (
             <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-primary">Cálculo de Bonificación Anual</h3>
                <p className="text-gray-500 mt-1 mb-6 text-sm">Distribuye el 10% de los beneficios netos de la empresa entre tus empleados.</p>
                <div className="flex items-end space-x-4 p-4 bg-light rounded-lg border border-gray-200/80">
                    <div>
                        <label htmlFor="beneficios" className="block text-sm font-semibold text-gray-600 mb-2">Total de Beneficios a Distribuir (DOP)</label>
                        <input type="number" id="beneficios" value={totalBeneficios} onChange={(e) => setTotalBeneficios(Number(e.target.value))} className="w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition" />
                    </div>
                    <button onClick={handleCalculateBonificacion} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm h-11">
                        <Calculator className="w-5 h-5 mr-2" /> Calcular Bonificación
                    </button>
                </div>
                 {showBonificacionResults && (
                    <div className="mt-6">
                         <Card className="bg-primary text-white"><p className="text-gray-300">Total Distribuido</p><p className="text-3xl font-bold text-secondary mt-1">{formatCurrency(totalBonificacion)}</p></Card>
                         <div className="overflow-x-auto mt-4 border border-gray-200/80 rounded-lg"><table className="w-full text-left"><thead><tr className="bg-light"><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Nombre</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Salario Mensual</th><th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Bonificación</th></tr></thead><tbody>{bonificacionResults.map(({ employee, amount }) => (<tr key={employee.id} className="border-b border-gray-200 last:border-0 hover:bg-light transition-colors"><td className="py-4 px-6"><div className="flex items-center"><img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full mr-4" /><div><p className="font-semibold text-primary">{employee.name}</p><p className="text-sm text-gray-500">{employee.position}</p></div></div></td><td className="py-4 px-6 text-gray-700">{formatCurrency(employee.salary)}</td><td className="py-4 px-6 text-primary font-bold text-right">{formatCurrency(amount)}</td></tr>))}</tbody></table></div>
                    </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Procesamiento de Nómina</h1>
      <p className="text-gray-500 mt-1">Calcula nóminas regulares y especiales.</p>

      <div className="mt-8">
          {currentView === 'main' && renderMain()}
          {currentView === 'run_wizard' && renderRunWizard()}
          {currentView === 'history' && renderHistory()}
          {currentView === 'history_detail' && renderHistoryDetail()}
      </div>

      {selectedPayslip && (
        <PayslipModal 
            isOpen={!!selectedPayslip}
            onClose={() => setSelectedPayslip(null)}
            data={selectedPayslip}
        />
      )}
    </div>
  );
};

export default Payroll;