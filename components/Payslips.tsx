
import React, { useState, useMemo } from 'react';
import { MOCK_PAYMENT_HISTORY } from '../constants';
import { PaymentHistory, Employee, RegularPayrollResult, PayslipData } from '../types';
import Card from './Card';
import { Search } from './icons';
import PayslipModal from './PayslipModal';

// Fix: Add props interface to accept employees data
interface PayslipsProps {
  employees: Employee[];
}

// Fix: Use PayslipsProps and destructure employees from props
const Payslips: React.FC<PayslipsProps> = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null);

  // Fix: Use employees prop instead of MOCK_EMPLOYEES and add to dependency array
  const employeeMap = useMemo(() => 
    new Map(employees.map(e => [e.id, e])), 
  [employees]);

  const filteredHistory = useMemo(() => MOCK_PAYMENT_HISTORY.filter(p => {
    const employee = employeeMap.get(p.employeeId);
    if (!employee) return false;
    return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.period.toLowerCase().includes(searchTerm.toLowerCase());
  }), [searchTerm, employeeMap]);
  
  const formatDate = (dateString: string) => 
    new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  const handleViewPayslip = (payment: PaymentHistory) => {
    const employee = employeeMap.get(payment.employeeId);
    if (!employee) return;

    // Simulate the full payslip data for the modal
    const totalDeductions = payment.grossPay - payment.netPay;
    const payslipData: PayslipData = {
        employee,
        period: payment.period,
        payDate: payment.payDate,
        grossPay: payment.grossPay,
        netPay: payment.netPay,
        totalDeductions,
        // Mocking detailed deductions for display
        sfs: totalDeductions * 0.25, 
        afp: totalDeductions * 0.23,
        isr: totalDeductions * 0.52,
        novelties: { overtimeHours: 0, absenceDeductions: 0, damageDeductions: 0},
        companyName: "Quisqueya Soluciones SRL",
        companyRNC: "1-30-12345-6",
    };
    setSelectedPayslip(payslipData);
  }

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Historial de Recibos de Pago</h1>
      <p className="text-gray-500 mt-1">Busca y visualiza cualquier volante de pago procesado.</p>

      <Card className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por empleado o período..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light">
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Empleado</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Neto</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((p) => {
                const employee = employeeMap.get(p.employeeId)!;
                return (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-light transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                        <div>
                          <p className="font-semibold text-primary">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{p.period}</td>
                    <td className="py-4 px-6 text-gray-700">{formatDate(p.payDate)}</td>
                    <td className="py-4 px-6 font-bold text-primary text-right">{formatCurrency(p.netPay)}</td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleViewPayslip(p)} className="text-secondary hover:underline font-semibold">Ver Volante</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
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

export default Payslips;