import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Users, DollarSign, FileText, Settings, LogOut, ClipboardCheck, FileClock, Receipt, FileMinus, HandCoins, PieChart, CalendarDays, Calculator, Send } from './icons';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-secondary/10 text-secondary'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: AppView.EMPLOYEES, label: 'Empleados', icon: <Users className="w-5 h-5" /> },
    { id: AppView.CONTRACTS, label: 'Contratos', icon: <FileClock className="w-5 h-5" /> },
    { id: AppView.PAYROLL, label: 'Nómina', icon: <DollarSign className="w-5 h-5" /> },
    { id: AppView.LIQUIDACIONES, label: 'Liquidaciones', icon: <FileMinus className="w-5 h-5" /> },
    { id: AppView.PAYMENT_DISPERSION, label: 'Dispersión de Pagos', icon: <Send className="w-5 h-5" /> },
    { id: AppView.PAYSLIPS, label: 'Recibos de Pago', icon: <Receipt className="w-5 h-5" /> },
    { id: AppView.TASKS, label: 'Tareas', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: AppView.REPORTS, label: 'Reportes', icon: <FileText className="w-5 h-5" /> },
    { id: AppView.ANALYTICS, label: 'Analítica', icon: <PieChart className="w-5 h-5" /> },
    { id: AppView.CALENDAR, label: 'Calendario', icon: <CalendarDays className="w-5 h-5" /> },
    { id: AppView.CALCULADORA, label: 'Calculadora', icon: <Calculator className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col p-4">
      <div className="flex items-center mb-10 p-3">
        <HandCoins className="w-8 h-8 text-secondary" />
        <h1 className="text-2xl font-heading font-bold ml-2">Nomina<span className="text-secondary">DO</span></h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => setActiveView(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div>
        <ul>
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Configuración"
            isActive={activeView === AppView.SETTINGS}
            onClick={() => setActiveView(AppView.SETTINGS)}
          />
           <NavItem
            icon={<LogOut className="w-5 h-5" />}
            label="Cerrar Sesión"
            isActive={false}
            onClick={onLogout}
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;