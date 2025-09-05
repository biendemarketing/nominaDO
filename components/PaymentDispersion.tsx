import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Employee, PayrollRun, EmployeeStatus } from '../types';
import { Send, Download, FileText, CheckCircle } from './icons';
import { MOCK_BANK_ACCOUNTS } from '../constants';

interface PaymentDispersionProps {
  employees: Employee[];
  payrollHistory: PayrollRun[];
}

const bankLayouts = [
    'Banco Popular Dominicano',
    'Banreservas',
    'BHD',
    'Scotiabank',
    'Banco Santa Cruz',
    'Asociación Popular de Ahorros y Préstamos (APAP)'
];

const StepIndicator: React.FC<{ number: number, title: string, isDone: boolean }> = ({ number, title, isDone }) => (
    <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${isDone ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {isDone ? <CheckCircle className="w-6 h-6" /> : number}
        </div>
        <div className="ml-4">
            <p className={`text-sm ${isDone ? 'text-gray-500' : 'text-gray-400'}`}>Paso {number}</p>
            <h3 className={`font-semibold ${isDone ? 'text-primary' : 'text-gray-500'}`}>{title}</h3>
        </div>
    </div>
);

const PaymentDispersion: React.FC<PaymentDispersionProps> = ({ employees, payrollHistory }) => {
    const [selectedPayrollId, setSelectedPayrollId] = useState<string>(payrollHistory[0]?.id || '');
    const [selectedBank, setSelectedBank] = useState<string>(bankLayouts[0]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

    const companyBank = MOCK_BANK_ACCOUNTS.find(b => b.isPrimary);

    const handleGenerateFile = () => {
        const payroll = payrollHistory.find(p => p.id === selectedPayrollId);
        if (!payroll) return;

        // In a real app, you would fetch the detailed payroll run
        // For simulation, we'll assign the total net pay proportionally to active employees with bank info
        const employeesToPay = employees.filter(e => e.status === EmployeeStatus.ACTIVE && e.bankName && e.accountNumber);
        const totalSalaryOfPayable = employeesToPay.reduce((sum, e) => sum + e.salary, 0);
        
        if (totalSalaryOfPayable === 0) {
            setFileContent("Error: No employees with salary information found for this payroll.");
            setFileName('error.txt');
            return;
        }

        let content = '';
        switch (selectedBank) {
            case 'Banco Popular Dominicano': // Example: RNC,CuentaOrigen,Secuencia,CuentaDestino,Monto,Concepto
                content = employeesToPay
                    .map((e, i) => `130123456,${companyBank?.accountNumber.replace(/\D/g, '')},${i+1},${e.accountNumber?.replace(/\D/g, '')},${(payroll.totalNetPay * (e.salary / totalSalaryOfPayable)).toFixed(2)},Pago Nomina ${payroll.period}`)
                    .join('\n');
                break;
            case 'Banreservas': // Example: CuentaDebito;CuentaCredito;Monto;NombreBeneficiario
                 content = employeesToPay
                    .map(e => `${companyBank?.accountNumber.replace(/\D/g, '')};${e.accountNumber?.replace(/\D/g, '')};${(payroll.totalNetPay * (e.salary / totalSalaryOfPayable)).toFixed(2)};${e.name}`)
                    .join('\n');
                break;
            default: // Generic CSV
                 content = "Cuenta Destino,Monto,Beneficiario\n" + employeesToPay
                    .map(e => `${e.accountNumber},${(payroll.totalNetPay * (e.salary / totalSalaryOfPayable)).toFixed(2)},"${e.name}"`)
                    .join('\n');
        }
        
        setFileContent(content);
        const fileSafePeriod = payroll.period.replace(/ /g, '_');
        setFileName(`pago_nomina_${fileSafePeriod}.txt`);
    };

    const handleDownload = () => {
        if (!fileContent) return;
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-8">
            <h1 className="font-heading text-3xl font-bold text-primary">Dispersión de Pagos</h1>
            <p className="text-gray-500 mt-1">Genera el archivo para cargar en tu portal bancario y pagar la nómina.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepIndicator number={1} title="Configuración de Cuentas" isDone={true} />
                <StepIndicator number={2} title="Generar Archivo" isDone={!!fileContent} />
                <StepIndicator number={3} title="Descargar y Cargar" isDone={false} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <Card>
                    <h2 className="font-heading text-xl font-bold text-primary mb-4">Paso 2: Generar Archivo de Pago</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="payrollRun" className="block text-sm font-semibold text-gray-600 mb-2">Selecciona la Nómina Procesada</label>
                            <select 
                                id="payrollRun" 
                                value={selectedPayrollId} 
                                onChange={(e) => setSelectedPayrollId(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                            >
                                {payrollHistory.map(p => <option key={p.id} value={p.id}>{p.period} - {formatCurrency(p.totalNetPay)}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="bank" className="block text-sm font-semibold text-gray-600 mb-2">Selecciona tu Banco (desde donde pagas)</label>
                            <select 
                                id="bank"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                            >
                                {bankLayouts.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button 
                            onClick={handleGenerateFile} 
                            disabled={!selectedPayrollId}
                            className="w-full flex items-center justify-center bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm disabled:bg-gray-400"
                        >
                            <Send className="w-5 h-5 mr-2" /> Generar Archivo de Pago
                        </button>
                    </div>

                </Card>

                <Card>
                    <h2 className="font-heading text-xl font-bold text-primary mb-4">Paso 3: Previsualizar y Descargar</h2>
                    {fileContent ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Contenido del archivo para <span className="font-semibold">{selectedBank}</span>:</p>
                            <pre className="bg-light p-4 rounded-lg border text-xs overflow-x-auto h-48">
                                {fileContent}
                            </pre>
                             <div className="mt-6">
                                <button 
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
                                >
                                    <Download className="w-5 h-5 mr-2" /> Descargar Archivo ({fileName})
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] border-2 border-dashed rounded-lg">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-primary">Archivo de Pago</h3>
                            <p className="text-gray-500 mt-1 max-w-xs">El contenido de tu archivo de dispersión aparecerá aquí una vez generado.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PaymentDispersion;