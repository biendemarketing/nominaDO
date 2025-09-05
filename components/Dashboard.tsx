import React, { useMemo } from 'react';
import Card from './Card';
import { Calendar, Users, DollarSign, TrendingUp, Megaphone, FileClock, CalendarDays as HolidayIcon, History } from './icons';
// FIX: Import PAYROLL_HISTORY_DATA from constants to be used in the PayrollChart.
import { MOCK_HOLIDAYS, MOCK_PAYROLL_HISTORY, PAYROLL_HISTORY_DATA } from '../constants';
import PayrollChart from './PayrollChart';
import { Employee, EmployeeStatus, Contract, AppView } from '../types';

interface DashboardProps {
    employees: Employee[];
    contracts: Contract[];
    setActiveView: (view: AppView) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; footer: string }> = ({ icon, title, value, footer }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-secondary/10 rounded-lg">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-4">{footer}</p>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ employees, contracts, setActiveView }) => {
  const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);
  const totalMonthlyCost = activeEmployees.reduce((acc, e) => acc + e.salary, 0);
  const recentPayrolls = MOCK_PAYROLL_HISTORY.slice(0, 3);
  const formatCompact = (amount: number) => `DOP ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(amount)}`;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  const alerts = useMemo(() => {
    const notifications = [];
    const now = new Date();
    
    // Contracts expiring soon (within 30 days)
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const expiringContracts = contracts.filter(c => {
      if (c.isIndefinite || !c.endDate || c.status !== 'Activo') return false;
      const endDate = new Date(c.endDate + 'T00:00:00');
      const diff = endDate.getTime() - now.getTime();
      return diff > 0 && diff <= thirtyDays;
    });

    expiringContracts.forEach(c => {
        const employee = employees.find(e => e.id === c.employeeId);
        if (employee) {
            notifications.push({
                id: `contract-${c.id}`,
                icon: <FileClock className="w-5 h-5 text-yellow-600" />,
                text: `Contrato de ${employee.name} vence el ${new Date(c.endDate!).toLocaleDateString('es-DO', {day: 'numeric', month: 'long'})}.`
            });
        }
    });

    // Upcoming holidays (within 14 days)
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    const upcomingHolidaysAlerts = MOCK_HOLIDAYS.filter(h => {
        const holidayDate = new Date(h.date + 'T00:00:00');
        const diff = holidayDate.getTime() - now.getTime();
        return diff > 0 && diff <= fourteenDays;
    });

    upcomingHolidaysAlerts.forEach(h => {
        notifications.push({
            id: `holiday-${h.date}`,
            icon: <HolidayIcon className="w-5 h-5 text-blue-600" />,
            text: `Feriado: ${h.name} el próximo ${new Date(h.date + 'T00:00:00').toLocaleDateString('es-DO', {weekday: 'long', day: 'numeric'})}.`
        });
    });

    return notifications.sort((a,b) => (a.id > b.id ? 1 : -1)); // stable sort
  }, [employees, contracts]);


  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Dashboard</h1>
      <p className="text-gray-500 mt-1">Bienvenido, aquí tienes un resumen de tu nómina.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard 
            icon={<Calendar className="w-6 h-6 text-secondary" />} 
            title="Próxima Nómina"
            value="15 Jul, 2024"
            footer={`Estimado ${formatCompact(totalMonthlyCost / 2)}`}
        />
        <StatCard 
            icon={<Users className="w-6 h-6 text-secondary" />} 
            title="Empleados Activos"
            value={activeEmployees.length.toString()}
            footer={`${employees.length} empleados en total`}
        />
         <StatCard 
            icon={<DollarSign className="w-6 h-6 text-secondary" />} 
            title="Costo Laboral Mensual"
            value={formatCompact(totalMonthlyCost)}
            footer="Suma de salarios activos"
        />
        <StatCard 
            icon={<TrendingUp className="w-6 h-6 text-secondary" />} 
            title="Tasa de Rotación"
            value={`${((employees.filter(e => e.status === 'Terminated').length / employees.length) * 100).toFixed(1)}%`}
            footer="Anualizada (simulada)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
            <Card>
                <h2 className="text-lg font-bold font-heading text-primary mb-1">Histórico de Costo de Nómina</h2>
                <p className="text-sm text-gray-500 mb-4">Últimos 6 meses</p>
                <PayrollChart data={PAYROLL_HISTORY_DATA} />
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <div className="flex items-center mb-4">
                    <Megaphone className="w-6 h-6 text-accent" />
                    <h2 className="text-lg font-bold font-heading text-primary ml-3">Alertas y Notificaciones</h2>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {alerts.length > 0 ? alerts.map(alert => (
                         <div key={alert.id} className="flex items-start p-3 bg-light rounded-lg">
                            <div className="flex-shrink-0 mt-1">{alert.icon}</div>
                            <p className="text-sm text-gray-700 ml-3">{alert.text}</p>
                        </div>
                    )) : <p className="text-sm text-gray-400 text-center py-8">No hay alertas importantes.</p>}
                </div>
            </Card>
             <Card>
                <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center">
                        <History className="w-6 h-6 text-accent" />
                        <h2 className="text-lg font-bold font-heading text-primary ml-3">Nóminas Recientes</h2>
                     </div>
                     <button onClick={() => setActiveView(AppView.PAYROLL)} className="text-sm font-semibold text-secondary hover:underline">Ver todo</button>
                </div>
                <div className="space-y-3">
                    {recentPayrolls.map(run => (
                         <div key={run.id} className="flex items-center justify-between p-3 bg-light rounded-lg">
                            <div>
                                <p className="font-semibold text-sm text-primary">{run.period}</p>
                                <p className="text-xs text-gray-500">{run.employeeCount} empleados &middot; {new Date(run.processedDate).toLocaleDateString('es-DO')}</p>
                            </div>
                            <p className="font-bold text-sm text-primary">{formatCurrency(run.totalNetPay)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
