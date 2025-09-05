
import React from 'react';
import { PayslipData } from '../types';
import { HandCoins, Printer } from './icons';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PayslipData | null;
}

const DetailRow: React.FC<{ label: string, value: string | number, isTotal?: boolean, isNegative?: boolean }> = 
({ label, value, isTotal = false, isNegative = false }) => {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
    
    return (
        <div className={`flex justify-between items-center py-2 ${isTotal ? 'font-bold border-t pt-2' : 'text-sm'}`}>
            <span className={isTotal ? 'text-primary' : 'text-gray-600'}>{label}</span>
            <span className={`${isTotal ? 'text-primary' : 'text-gray-800'} ${isNegative ? 'text-red-600' : ''}`}>
                {typeof value === 'number' ? formatCurrency(value) : value}
            </span>
        </div>
    );
};

const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  
  const handlePrint = () => {
    const printContents = document.getElementById('payslip-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      // Re-add the modal to the DOM after printing, as it was removed
      window.location.reload(); 
    }
  };

  const basePay = data.employee.salary / 2;
  const overtimePay = data.grossPay - basePay;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
            <h2 className="font-heading text-2xl font-bold text-primary">Volante de Pago</h2>
            <div className="space-x-2">
                 <button onClick={handlePrint} className="flex items-center bg-light text-primary font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-all">
                    <Printer className="w-5 h-5 mr-2" /> Imprimir
                </button>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold py-2 px-2 rounded-lg text-2xl leading-none">&times;</button>
            </div>
        </div>
        <div id="payslip-to-print" className="overflow-y-auto">
             <style>{`
                @media print {
                  body * { visibility: hidden; }
                  #payslip-content, #payslip-content * { visibility: visible; }
                  #payslip-content { position: absolute; left: 0; top: 0; width: 100%; }
                  .no-print { display: none; }
                }
              `}</style>
            <div id="payslip-content" className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b-2 border-primary">
                    <div>
                        <h3 className="font-heading font-bold text-xl text-primary">{data.companyName}</h3>
                        <p className="text-sm text-gray-500">RNC: {data.companyRNC}</p>
                    </div>
                     <div className="flex items-center text-primary">
                        <HandCoins className="w-8 h-8 text-secondary" />
                        <h1 className="text-2xl font-heading font-bold ml-2">Nomina<span className="text-secondary">DO</span></h1>
                    </div>
                </div>
                {/* Employee and Period Info */}
                 <div className="grid grid-cols-2 gap-8 my-6 text-sm">
                    <div>
                        <p className="font-bold text-primary">{data.employee.name}</p>
                        <p className="text-gray-600">{data.employee.position}</p>
                        <p className="text-gray-600">{data.employee.identifier}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600">Período de Pago: <span className="font-semibold text-primary">{data.period}</span></p>
                        <p className="text-gray-600">Fecha de Pago: <span className="font-semibold text-primary">{new Date(data.payDate + 'T00:00:00').toLocaleDateString('es-DO')}</span></p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Earnings */}
                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-heading font-bold text-lg text-green-800 border-b pb-2 mb-2">Ingresos</h4>
                        <DetailRow label="Salario Base" value={basePay} />
                        {data.novelties.overtimeHours > 0 && <DetailRow label={`Horas Extras (${data.novelties.overtimeHours} hrs)`} value={overtimePay} />}
                        <DetailRow label="Total Ingresos Brutos" value={data.grossPay} isTotal />
                    </div>
                     {/* Deductions */}
                     <div className="bg-red-50/50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-heading font-bold text-lg text-red-800 border-b pb-2 mb-2">Deducciones</h4>
                        <DetailRow label="Seguro Familiar de Salud (SFS)" value={-data.sfs} isNegative />
                        <DetailRow label="Fondo de Pensiones (AFP)" value={-data.afp} isNegative />
                        <DetailRow label="Impuesto Sobre la Renta (ISR)" value={-data.isr} isNegative />
                        {data.novelties.absenceDeductions > 0 && <DetailRow label="Descuento por Faltas" value={-data.novelties.absenceDeductions} isNegative />}
                        {data.novelties.damageDeductions > 0 && <DetailRow label="Descuento por Daños" value={-data.novelties.damageDeductions} isNegative />}
                        <DetailRow label="Total Deducciones" value={-data.totalDeductions} isTotal isNegative />
                    </div>
                </div>
                {/* Net Pay */}
                <div className="mt-8 bg-primary text-white p-6 rounded-lg flex justify-between items-center">
                    <h3 className="font-heading text-2xl font-bold">NETO A PAGAR</h3>
                    <p className="text-3xl font-bold text-secondary">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(data.netPay)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;