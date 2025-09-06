import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Payroll from './components/Payroll';
import TaskList from './components/TaskList';
import Reports from './components/Reports';
import EmployeeProfile from './components/EmployeeProfile';
import Settings from './components/Settings';
import Contracts from './components/Contracts';
import Payslips from './components/Payslips';
import Liquidaciones from './components/Liquidaciones';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Calculadora from './components/Calculadora';
import AddEmployeeModal from './components/AddEmployeeModal';
import TaskModal from './components/TaskModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import PaymentDispersion from './components/PaymentDispersion';
import { AppView, AuthView, Employee, Contract, EmployeeDocument, LiquidacionRun, PendingLiquidation, EmployeeStatus, Task } from './types';
import { MOCK_EMPLOYEES, MOCK_CONTRACTS, MOCK_DOCUMENTS, MOCK_LIQUIDACIONES, MOCK_TASKS, MOCK_PAYROLL_HISTORY } from './constants';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<AuthView>(AuthView.LANDING);

  // Navigation State
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  // Global Data State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [documents, setDocuments] = useState<EmployeeDocument[]>(MOCK_DOCUMENTS);
  const [liquidaciones, setLiquidaciones] = useState<LiquidacionRun[]>(MOCK_LIQUIDACIONES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  // Workflow State
  const [pendingLiquidation, setPendingLiquidation] = useState<PendingLiquidation | null>(null);

  // Modal State
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // --- Modal Handlers ---
  const handleOpenAddEmployeeModal = () => setIsAddEmployeeModalOpen(true);
  const handleCloseAddEmployeeModal = () => setIsAddEmployeeModalOpen(false);

  const handleOpenTaskModal = (task: Task | null = null) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };
  const handleCloseTaskModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(false);
  };

  // --- Handlers ---
  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveView(AppView.DASHBOARD);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView(AuthView.LANDING);
  };

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setActiveView(AppView.EMPLOYEE_PROFILE);
  };

  const handleBackToList = () => {
    setSelectedEmployeeId(null);
    setActiveView(AppView.EMPLOYEES);
  };

  const handleViewChange = (view: AppView) => {
    setSelectedEmployeeId(null);
    setActiveView(view);
  };
  
  const handleUpdateContract = (updatedContract: Contract, newSalary?: number) => {
    const previousContract = contracts.find(c => c.id === updatedContract.id);
    const hasBeenTerminated = 
        (updatedContract.status === 'Finalizado' || updatedContract.status === 'Terminado Anticipadamente') &&
        previousContract?.status === 'Activo';

    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
    if (newSalary !== undefined) {
      setEmployees(prev => prev.map(e => e.id === updatedContract.employeeId ? { ...e, salary: newSalary } : e));
    }

    if (hasBeenTerminated) {
        const reason = updatedContract.status === 'Terminado Anticipadamente' ? 'Despido' : 'Mutuo Acuerdo';
        setPendingLiquidation({ employeeId: updatedContract.employeeId, reason });
        setActiveView(AppView.LIQUIDACIONES);
    }
  };

  const handleAddNewEmployee = (employeeData: Omit<Employee, 'id' | 'avatarUrl' | 'status'>, contractData: Omit<Contract, 'id' | 'employeeId' | 'status'>) => {
      const newEmployeeId = `emp-${String(employees.length + 1).padStart(3, '0')}`;
      const newContractId = `con-${String(contracts.length + 1).padStart(3, '0')}`;
      
      const newEmployee: Employee = {
        ...employeeData,
        id: newEmployeeId,
        status: EmployeeStatus.ACTIVE,
        avatarUrl: `https://picsum.photos/id/10${employees.length + 10}/200/200`,
      };
      
      const newContract: Contract = {
          ...contractData,
          id: newContractId,
          employeeId: newEmployeeId,
          status: 'Activo',
      };
      
      if (newContract.isIndefinite) {
        delete newContract.endDate;
      }

      setEmployees(prev => [...prev, newEmployee]);
      setContracts(prev => [...prev, newContract]);
      handleCloseAddEmployeeModal();
  };

  const handleAddLiquidation = (liquidation: LiquidacionRun) => {
    setLiquidaciones(prev => [...prev, liquidation]);
    setEmployees(prev => prev.map(e => 
      e.id === liquidation.employee.id ? { ...e, status: EmployeeStatus.TERMINATED } : e
    ));
    setPendingLiquidation(null); // Clear pending state
  };

  const handleAddNewDocument = (docData: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const newDocument: EmployeeDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (taskToEdit) {
      setTasks(prev => prev.map(t => t.id === taskToEdit.id ? { ...taskToEdit, ...taskData } : t));
    } else {
      const newTask: Task = { ...taskData, id: `task-${Date.now()}` };
      setTasks(prev => [...prev, newTask]);
    }
    handleCloseTaskModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    handleCloseTaskModal();
  };


  // --- View Rendering ---
  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard employees={employees} contracts={contracts} setActiveView={handleViewChange}/>;
      case AppView.EMPLOYEES:
        return <EmployeeList 
          employees={employees} 
          contracts={contracts} 
          onSelectEmployee={handleSelectEmployee} 
          onOpenAddEmployeeModal={handleOpenAddEmployeeModal}
        />;
      case AppView.EMPLOYEE_PROFILE:
        return selectedEmployeeId ? (
          <EmployeeProfile 
            employeeId={selectedEmployeeId} 
            employees={employees}
            contracts={contracts}
            onUpdateContract={handleUpdateContract}
            onBack={handleBackToList} 
            documents={documents}
            onAddNewDocument={handleAddNewDocument}
            setDocuments={setDocuments}
          />
        ) : <EmployeeList employees={employees} contracts={contracts} onSelectEmployee={handleSelectEmployee} onOpenAddEmployeeModal={handleOpenAddEmployeeModal}/>;
      case AppView.PAYROLL:
        return <Payroll employees={employees} />;
      case AppView.TASKS:
        return <TaskList 
          tasks={tasks} 
          employees={employees}
          setTasks={setTasks}
          onOpenTaskModal={handleOpenTaskModal}
        />;
      case AppView.REPORTS:
        return <Reports employees={employees} />;
      case AppView.ANALYTICS:
        return <Analytics employees={employees} contracts={contracts} />;
      case AppView.CALENDAR:
        return <Calendar employees={employees} />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.CONTRACTS:
        return <Contracts 
          employees={employees}
          contracts={contracts}
          onSelectEmployee={handleSelectEmployee} 
          documents={documents} 
          setDocuments={setDocuments} 
          onUpdateContract={handleUpdateContract}
        />;
      case AppView.PAYSLIPS:
        return <Payslips employees={employees} />;
      case AppView.LIQUIDACIONES:
        return <Liquidaciones 
          employees={employees} 
          contracts={contracts} 
          liquidaciones={liquidaciones} 
          pendingLiquidation={pendingLiquidation}
          onAddLiquidation={handleAddLiquidation}
        />;
      case AppView.CALCULADORA:
        return <Calculadora employees={employees} contracts={contracts} />;
      case AppView.PAYMENT_DISPERSION:
        return <PaymentDispersion employees={employees} payrollHistory={MOCK_PAYROLL_HISTORY} />;
      default:
        return <Dashboard employees={employees} contracts={contracts} setActiveView={handleViewChange}/>;
    }
  };

  if (!isAuthenticated) {
    switch (authView) {
        case AuthView.LOGIN:
            return <LoginPage onLogin={handleLogin} switchToRegister={() => setAuthView(AuthView.REGISTER)} />;
        case AuthView.REGISTER:
            return <RegisterPage onRegister={handleLogin} switchToLogin={() => setAuthView(AuthView.LOGIN)} />;
        case AuthView.PRIVACY:
            return <PrivacyPolicy setAuthView={setAuthView} />;
        case AuthView.TERMS:
            return <TermsOfService setAuthView={setAuthView} />;
        case AuthView.FAQ:
            return <FAQ setAuthView={setAuthView} />;
        default:
            return <LandingPage setAuthView={setAuthView} />;
    }
  }

  return (
    <div className="flex h-screen bg-light font-sans text-gray-800">
      <Sidebar activeView={activeView} setActiveView={handleViewChange} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          employees={employees}
          onSelectEmployee={handleSelectEmployee}
          setActiveView={handleViewChange}
          onOpenAddEmployeeModal={handleOpenAddEmployeeModal}
          onOpenTaskModal={() => handleOpenTaskModal(null)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light">
          {renderView()}
        </main>
      </div>
      
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal 
          isOpen={isAddEmployeeModalOpen}
          onClose={handleCloseAddEmployeeModal}
          onSave={handleAddNewEmployee}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          taskToEdit={taskToEdit}
          employees={employees}
        />
      )}
    </div>
  );
};

export default App;
};

export default App;
