import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Employee, Contract, EmployeeStatus } from '../types';
import { Calculator, UserX, HandCoins, DollarSign } from './icons';

interface CalculadoraProps {
  employees: Employee[];
  contracts: Contract[];
}

type CalculationType = 'liquidacion' | 'regalia' | 'salarioNeto';
type CalculationMode = 'employee' | 'manual';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold text-sm rounded-md transition-all duration-200 ${
            isActive ? 'bg-secondary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);

const DetailRow: React.FC<{ label: string, value: string | number, isTotal?: boolean }> = ({ label, value, isTotal = false }) => {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
    return (
        <div className={`flex justify-between items-center py-2 ${isTotal ? 'font-bold text-lg border-t-2 mt-2 pt-2' : 'text-sm'}`}>
            <span className={isTotal ? 'text-primary' : 'text-gray-600'}>{label}</span>
            <span className={`font-semibold ${isTotal ? 'text-secondary' : 'text-primary'}`}>
                {typeof value === 'number' ? formatCurrency(value) : value}
            </span>
        </div>
    );
};

const Calculadora: React.FC<CalculadoraProps> = ({ employees, contracts }) => {
    const [calcType, setCalcType] = useState<CalculationType>('liquidacion');
    const [mode, setMode] = useState<CalculationMode>('employee');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [manualInputs, setManualInputs] = useState({
        salary: '100000',
        startDate: '2022-01-01',
        terminationDate: new Date().toISOString().split('T')[0],
        reason: 'Despido',
        paysTSS: true,
        isFiscalResident: true,
    });
    const [result, setResult] = useState<any>(null);

    const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);

    useEffect(() => {
        setResult(null); // Clear results when changing mode or type
    }, [calcType, mode]);

    useEffect(() => {
        if (mode === 'employee' && selectedEmployeeId) {
            const employee = employees.find(e => e.id === selectedEmployeeId);
            const contract = contracts.find(c => c.employeeId === selectedEmployeeId);
            if (employee && contract) {
                setManualInputs(prev => ({
                    ...prev,
                    salary: String(employee.salary),
                    startDate: contract.startDate,
                    paysTSS: employee.paysTSS,
                    isFiscalResident: employee.isFiscalResident,
                }));
            }
        }
    }, [selectedEmployeeId, mode, employees, contracts]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setManualInputs(prev => ({...prev, [name]: checked }));
        } else {
            setManualInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const calculateLiquidacion = () => {
        const salary = parseFloat(manualInputs.salary);
        const daysWorked = (new Date(manualInputs.terminationDate).getTime() - new Date(manualInputs.startDate).getTime()) / (1000 * 3600 * 24);
        const yearsWorked = daysWorked / 365;

        let preaviso = 0;
        if (manualInputs.reason === 'Despido') {
            if (daysWorked > 3 * 30 && daysWorked <= 6 * 30) preaviso = (salary / 30) * 7;
            else if (daysWorked > 6 * 30 && daysWorked <= 12 * 30) preaviso = (salary / 30) * 14;
            else if (daysWorked > 12 * 30) preaviso = (salary / 30) * 28;
        }

        let cesantia = 0;
        if (manualInputs.reason !== 'Renuncia') {
            if (yearsWorked >= 5) cesantia = (salary / 23.83) * (15 + (21 * (yearsWorked - 1))) + (salary / 23.83) * 23 * (yearsWorked - 5);
             else if (yearsWorked >= 1) cesantia = (salary / 23.83) * 21 * yearsWorked;
             else if (daysWorked >= (6 * 30)) cesantia = (salary / 23.83) * 13;
             else if (daysWorked >= (3 * 30)) cesantia = (salary / 23.83) * 6;
        }
        
        const vacaciones = (salary / 23.83) * 14 * (daysWorked / 365.25);
        const mesesTrabajadosEnAno = new Date(manualInputs.terminationDate).getMonth() + 1;
        const salario13 = salary * (mesesTrabajadosEnAno / 12); 
        const total = preaviso + cesantia + vacaciones + salario13;
        
        setResult({ preaviso, cesantia, vacaciones, salario13, total });
    };

    const calculateRegalia = () => {
        const salary = parseFloat(manualInputs.salary);
        const mesesTrabajadosEnAno = new Date(manualInputs.terminationDate).getMonth() + 1;
        const amount = salary * (mesesTrabajadosEnAno / 12);
        setResult({ amount });
    };
    
    const calculateSalarioNeto = () => {
        const SFS_CAP = 177650;
        const AFP_CAP = 355300;
        const salary = parseFloat(manualInputs.salary);

        let sfs = 0, afp = 0;
        if (manualInputs.paysTSS) {
            sfs = Math.min(salary, SFS_CAP) * 0.0304;
            afp = Math.min(salary, AFP_CAP) * 0.0287;
        }

        let isr = 0;
        if (manualInputs.isFiscalResident) {
            const annualTaxableSalary = (salary - sfs - afp) * 12;
            let annualISR = 0;
            if (annualTaxableSalary > 867123.01) annualISR = 79776 + (annualTaxableSalary - 867123.00) * 0.25;
            else if (annualTaxableSalary > 624329.01) annualISR = 31216 + (annualTaxableSalary - 624329.00) * 0.20;
            else if (annualTaxableSalary > 416220.01) annualISR = (annualTaxableSalary - 416220.00) * 0.15;
            isr = annualISR / 12;
        } else {
            isr = salary * 0.27; // Flat tax for non-residents
        }
        
        const totalDeductions = sfs + afp + isr;
        const netPay = salary - totalDeductions;
        setResult({ grossPay: salary, sfs, afp, isr, totalDeductions, netPay });
    };

    const handleCalculate = () => {
        switch(calcType) {
            case 'liquidacion': calculateLiquidacion(); break;
            case 'regalia': calculateRegalia(); break;
            case 'salarioNeto': calculateSalarioNeto(); break;
        }
    };
    
    const renderInputs = () => {
        return (
            <>
                {mode === 'employee' ? (
                    <div>
                        <label htmlFor="employee" className="block text-sm font-semibold text-gray-600 mb-2">Empleado</label>
                        <select id="employee" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                            <option value="">-- Seleccionar Empleado Existente --</option>
                            {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="salary" className="block text-sm font-semibold text-gray-600 mb-2">Salario Mensual Bruto (DOP)</label>
                                <input type="number" name="salary" id="salary" value={manualInputs.salary} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-600 mb-2">Fecha de Inicio Laboral</label>
                                <input type="date" name="startDate" id="startDate" value={manualInputs.startDate} onChange={handleInputChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                            </div>
                        </div>
                         <div className="flex items-center space-x-8 mt-2">
                             <label className="flex items-center space-x-2"><input type="checkbox" name="paysTSS" checked={manualInputs.paysTSS} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary/50" /> <span className="text-sm">Cotiza en TSS</span></label>
                             <label className="flex items-center space-x-2"><input type="checkbox" name="isFiscalResident" checked={manualInputs.isFiscalResident} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary/50" /> <span className="text-sm">Es Residente Fiscal</span></label>
                         </div>
                    </>
                )}
                 
                {calcType !== 'salarioNeto' && (
                    <div>
                        <label htmlFor="terminationDate" className="block text-sm font-semibold text-gray-600 mb-2">Fecha de Salida (o fin de año)</label>
                        <input type="date" name="terminationDate" id="terminationDate" value={manualInputs.terminationDate} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                    </div>
                )}
                
                {calcType === 'liquidacion' && (
                    <div>
                        <label htmlFor="reason" className="block text-sm font-semibold text-gray-600 mb-2">Motivo de Salida</label>
                        <select id="reason" name="reason" value={manualInputs.reason} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition">
                            <option>Despido</option>
                            <option>Renuncia</option>
                            <option>Mutuo Acuerdo</option>
                        </select>
                    </div>
                )}
            </>
        )
    };

    const renderResult = () => {
        if (!result) return null;
        switch(calcType) {
            case 'liquidacion':
                return (
                    <Card>
                        <h3 className="font-heading text-lg font-bold text-primary mb-2">Resultado: Liquidación</h3>
                        <DetailRow label="Preaviso" value={result.preaviso} />
                        <DetailRow label="Auxilio de Cesantía" value={result.cesantia} />
                        <DetailRow label="Vacaciones (proporcional)" value={result.vacaciones} />
                        <DetailRow label="Salario de Navidad (proporcional)" value={result.salario13} />
                        <DetailRow label="TOTAL A RECIBIR" value={result.total} isTotal />
                    </Card>
                );
            case 'regalia':
                return (
                    <Card>
                        <h3 className="font-heading text-lg font-bold text-primary mb-2">Resultado: Regalía Pascual</h3>
                        <DetailRow label="Monto a Pagar" value={result.amount} isTotal />
                    </Card>
                );
            case 'salarioNeto':
                return (
                    <Card>
                        <h3 className="font-heading text-lg font-bold text-primary mb-2">Resultado: Salario Neto Mensual</h3>
                        <DetailRow label="Ingreso Bruto Mensual" value={result.grossPay} />
                        <DetailRow label="(-) SFS (3.04%)" value={-result.sfs} />
                        <DetailRow label="(-) AFP (2.87%)" value={-result.afp} />
                        <DetailRow label="(-) ISR" value={-result.isr} />
                        <DetailRow label="SALARIO NETO A RECIBIR" value={result.netPay} isTotal />
                    </Card>
                );
            default: return null;
        }
    };

  return (
    <div className="p-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Calculadora Laboral</h1>
        <p className="text-gray-500 mt-1">Realiza cálculos individuales para planificación y consultas.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-bold text-primary">Parámetros</h2>
                    <div className="flex items-center p-1 bg-light rounded-lg">
                        <button onClick={() => setMode('employee')} className={`px-3 py-1 text-sm font-semibold rounded-md ${mode==='employee' ? 'bg-white shadow-sm' : ''}`}>Empleado</button>
                        <button onClick={() => setMode('manual')} className={`px-3 py-1 text-sm font-semibold rounded-md ${mode==='manual' ? 'bg-white shadow-sm' : ''}`}>Manual</button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-2 bg-light rounded-lg">
                        <TabButton label="Liquidación" isActive={calcType === 'liquidacion'} onClick={() => setCalcType('liquidacion')} />
                        <TabButton label="Regalía Pascual" isActive={calcType === 'regalia'} onClick={() => setCalcType('regalia')} />
                        <TabButton label="Salario Neto" isActive={calcType === 'salarioNeto'} onClick={() => setCalcType('salarioNeto')} />
                    </div>

                    <div className="p-4 border rounded-lg space-y-4">
                        {renderInputs()}
                    </div>
                </div>
                 <div className="mt-6">
                    <button onClick={handleCalculate} className="w-full flex items-center justify-center bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
                        <Calculator className="w-5 h-5 mr-2" /> Calcular Ahora
                    </button>
                </div>
            </Card>

            <div className="sticky top-8">
                {result ? renderResult() : (
                    <Card className="flex flex-col items-center justify-center text-center h-full min-h-[300px] border-2 border-dashed">
                        <div className="p-4 bg-secondary/10 rounded-full mb-4">
                            <Calculator className="w-10 h-10 text-secondary" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-primary">Resultados del Cálculo</h3>
                        <p className="text-gray-500 mt-1">Los resultados de tu cálculo aparecerán aquí.</p>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
};

export default Calculadora;