import { Employee, EmployeeStatus, Nationality, PayrollHistoryData, Task, TaskStatus, TaskPriority, Contract, PaymentHistory, EmployeeHistoryEvent, EmployeeDocument, PayrollRun, CompanyProfile, BankAccount, UserRole, LiquidacionRun, DocumentType, Holiday } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    name: 'Juan Pérez',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    position: 'Desarrollador Senior',
    department: 'Tecnología',
    salary: 125000,
    status: EmployeeStatus.ACTIVE,
    nationality: Nationality.DOMINICAN,
    identifier: '001-1234567-8',
    nss: '123456789',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Male',
    birthDate: '1985-07-19',
    bankName: 'Banco Popular',
    accountNumber: '7...1234',
  },
  {
    id: 'emp-002',
    name: 'Maria Rodriguez',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    position: 'Diseñadora UX/UI',
    department: 'Diseño',
    salary: 95000,
    status: EmployeeStatus.ACTIVE,
    nationality: Nationality.DOMINICAN,
    identifier: '001-8765432-1',
    nss: '987654321',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Female',
    birthDate: '1992-03-12',
    bankName: 'Banreservas',
    accountNumber: '9...5678',
  },
  {
    id: 'emp-003',
    name: 'John Doe',
    avatarUrl: 'https://picsum.photos/id/1012/200/200',
    position: 'Project Manager',
    department: 'Administración',
    salary: 150000,
    status: EmployeeStatus.ACTIVE,
    nationality: Nationality.FOREIGN,
    identifier: 'A1B2C3D4E5',
    migratoryStatus: 'Residencia Temporal',
    visaExpiry: '2025-08-15',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Male',
    birthDate: '1988-11-25',
    bankName: 'BHD',
    accountNumber: '2...9012',
  },
  {
    id: 'emp-004',
    name: 'Ana García',
    avatarUrl: 'https://picsum.photos/id/1013/200/200',
    position: 'Analista de QA',
    department: 'Tecnología',
    salary: 80000,
    status: EmployeeStatus.ON_LEAVE,
    nationality: Nationality.DOMINICAN,
    identifier: '001-2345678-9',
    nss: '234567890',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Female',
    birthDate: '1995-09-02',
    bankName: 'Scotiabank',
    accountNumber: '5...3456',
  },
  {
    id: 'emp-005',
    name: 'Carlos Martínez',
    avatarUrl: 'https://picsum.photos/id/1014/200/200',
    position: 'Contador',
    department: 'Finanzas',
    salary: 110000,
    status: EmployeeStatus.ACTIVE,
    nationality: Nationality.DOMINICAN,
    identifier: '001-3456789-0',
    nss: '345678901',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Male',
    birthDate: '1983-07-30',
    bankName: 'Banco Popular',
    accountNumber: '7...7890',
  },
  {
    id: 'emp-006',
    name: 'Emily Smith',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    position: 'Marketing Specialist',
    department: 'Marketing',
    salary: 85000,
    status: EmployeeStatus.ACTIVE,
    nationality: Nationality.FOREIGN,
    identifier: 'F6G7H8I9J0',
    migratoryStatus: 'Permiso de Trabajo',
    visaExpiry: '2024-11-20',
    paysTSS: false,
    isFiscalResident: false,
    gender: 'Female',
    birthDate: '1994-01-15',
    bankName: 'BHD',
    accountNumber: '2...1122',
  },
   {
    id: 'emp-007',
    name: 'Pedro Gonzalez',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    position: 'Soporte Técnico',
    department: 'Tecnología',
    salary: 65000,
    status: EmployeeStatus.TERMINATED,
    nationality: Nationality.DOMINICAN,
    identifier: '001-9876543-2',
    nss: '456789012',
    paysTSS: true,
    isFiscalResident: true,
    gender: 'Male',
    birthDate: '1990-12-08',
    bankName: 'Banreservas',
    accountNumber: '9...3344',
  },
];

export const MOCK_CONTRACTS: Contract[] = [
    { id: 'con-001', employeeId: 'emp-001', startDate: '2021-02-15', isIndefinite: true, status: 'Activo' },
    { id: 'con-002', employeeId: 'emp-002', startDate: '2022-08-01', endDate: '2024-07-31', isIndefinite: false, status: 'Activo' },
    { id: 'con-003', employeeId: 'emp-003', startDate: '2020-05-20', endDate: '2025-05-19', isIndefinite: false, status: 'Activo' },
    { id: 'con-004', employeeId: 'emp-004', startDate: '2022-11-10', endDate: '2024-11-09', isIndefinite: false, status: 'Activo' },
    { id: 'con-005', employeeId: 'emp-005', startDate: '2019-07-01', endDate: '2026-06-30', isIndefinite: false, status: 'Activo' },
    { id: 'con-006', employeeId: 'emp-006', startDate: '2023-01-30', endDate: '2025-01-29', isIndefinite: false, status: 'Activo' },
    { id: 'con-007', employeeId: 'emp-007', startDate: '2021-09-01', endDate: '2023-08-31', isIndefinite: false, status: 'Finalizado' },
];

export const MOCK_PAYMENT_HISTORY: PaymentHistory[] = [
    { id: 'ph-001', employeeId: 'emp-001', payDate: '2024-06-15', period: '1ra Quincena Junio', grossPay: 62500, netPay: 51845.83 },
    { id: 'ph-002', employeeId: 'emp-001', payDate: '2024-05-30', period: '2da Quincena Mayo', grossPay: 62500, netPay: 51845.83 },
    { id: 'ph-003', employeeId: 'emp-001', payDate: '2024-05-15', period: '1ra Quincena Mayo', grossPay: 62500, netPay: 51845.83 },
    { id: 'ph-004', employeeId: 'emp-002', payDate: '2024-06-15', period: '1ra Quincena Junio', grossPay: 47500, netPay: 41227.50 },
    { id: 'ph-005', employeeId: 'emp-002', payDate: '2024-05-30', period: '2da Quincena Mayo', grossPay: 47500, netPay: 41227.50 },
    { id: 'ph-006', employeeId: 'emp-003', payDate: '2024-06-15', period: '1ra Quincena Junio', grossPay: 75000, netPay: 61858.33 },
    { id: 'ph-007', employeeId: 'emp-005', payDate: '2024-06-15', period: '1ra Quincena Junio', grossPay: 55000, netPay: 46840.83 },
    { id: 'ph-008', employeeId: 'emp-006', payDate: '2024-06-15', period: '1ra Quincena Junio', grossPay: 42500, netPay: 37471.25 },
];

export const MOCK_EMPLOYEE_HISTORY: EmployeeHistoryEvent[] = [
    { id: 'eh-001', employeeId: 'emp-001', date: '2023-01-01', eventType: 'Salary Change', description: 'Aumento de salario a DOP 125,000 por evaluación de desempeño.' },
    { id: 'eh-002', employeeId: 'emp-001', date: '2021-02-15', eventType: 'Promotion', description: 'Promovido de Desarrollador Junior a Desarrollador Senior.' },
    { id: 'eh-003', employeeId: 'emp-003', date: '2022-06-01', eventType: 'Department Change', description: 'Transferido del departamento de Operaciones a Administración.' },
    { id: 'eh-004', employeeId: 'emp-002', date: '2024-03-15', eventType: 'Salary Change', description: 'Ajuste salarial a DOP 95,000 por mérito.' },
];

export const DOCUMENT_TYPES: DocumentType[] = [
    'Cédula/ID',
    'Contrato',
    'Certificación',
    'CV',
    'Título Universitario',
    'Carta de Referencia',
    'Amonestación'
];


export const MOCK_DOCUMENTS: EmployeeDocument[] = [
    { id: 'doc-001', employeeId: 'emp-001', name: 'Copia de Cédula', type: 'Cédula/ID', uploadDate: '2021-02-15', fileContent: '', fileType: 'application/pdf', status: 'Otro' },
    { id: 'doc-002', employeeId: 'emp-001', name: 'Certificación de Grado', type: 'Certificación', uploadDate: '2021-02-16', fileContent: '', fileType: 'application/pdf', status: 'Otro' },
    { id: 'doc-003', employeeId: 'emp-002', name: 'Copia de Cédula', type: 'Cédula/ID', uploadDate: '2022-08-01', fileContent: '', fileType: 'application/pdf', status: 'Otro' },
];

export const MOCK_PAYROLL_HISTORY: PayrollRun[] = [
    { id: 'pr-001', period: '1ra Quincena Junio 2024', processedDate: '2024-06-15', employeeCount: 5, totalNetPay: 239183.24, status: 'Pagado' },
    { id: 'pr-002', period: '2da Quincena Mayo 2024', processedDate: '2024-05-30', employeeCount: 5, totalNetPay: 239183.24, status: 'Pagado' },
    { id: 'pr-003', period: '1ra Quincena Mayo 2024', processedDate: '2024-05-15', employeeCount: 5, totalNetPay: 239183.24, status: 'Pagado' },
    { id: 'pr-004', period: '2da Quincena Abril 2024', processedDate: '2024-04-30', employeeCount: 4, totalNetPay: 205455.99, status: 'Pagado' },
];

const pedroGonzalez = MOCK_EMPLOYEES.find(e => e.id === 'emp-007')!;
export const MOCK_LIQUIDACIONES: LiquidacionRun[] = [
    {
        id: 'liq-001',
        employee: pedroGonzalez,
        processedDate: '2023-09-01',
        reason: 'Renuncia',
        preaviso: 0, 
        cesantia: 130000,
        vacaciones: 28000,
        salario13: 45000,
        total: 203000,
    }
];


export const MOCK_COMPANY_PROFILE: CompanyProfile = {
    name: 'Quisqueya Soluciones SRL',
    rnc: '1-30-12345-6',
    address: 'Av. Winston Churchill 1099, Santo Domingo, DN',
    phone: '(809) 555-1234',
    email: 'contacto@quisqueyasoluciones.do',
    website: 'www.quisqueyasoluciones.do',
};

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
    { id: 'ba-001', bankName: 'Banco Popular Dominicano', accountNumber: '**** **** **** 1234', accountType: 'Corriente', isPrimary: true },
    { id: 'ba-002', bankName: 'Banreservas', accountNumber: '**** **** **** 5678', accountType: 'Ahorros', isPrimary: false },
];

export const MOCK_USER_ROLES: UserRole[] = [
    { id: 'role-001', name: 'Administrador', permissions: ['Todo el acceso'], userCount: 1 },
    { id: 'role-002', name: 'Contador', permissions: ['Gestión de Nómina', 'Reportes', 'Ver Empleados'], userCount: 2 },
    { id: 'role-003', name: 'RRHH', permissions: ['Gestión de Empleados', 'Ver Nómina', 'Tareas'], userCount: 1 },
];


export const PAYROLL_HISTORY_DATA: PayrollHistoryData[] = [
    { month: 'Ene', totalCost: 580000, baseSalary: 450000, taxes: 130000 },
    { month: 'Feb', totalCost: 595000, baseSalary: 460000, taxes: 135000 },
    { month: 'Mar', totalCost: 610000, baseSalary: 470000, taxes: 140000 },
    { month: 'Abr', totalCost: 605000, baseSalary: 465000, taxes: 140000 },
    { month: 'May', totalCost: 630000, baseSalary: 485000, taxes: 145000 },
    { month: 'Jun', totalCost: 650000, baseSalary: 500000, taxes: 150000 },
];

const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export const MOCK_TASKS: Task[] = [
    {
        id: 'task-001',
        title: 'Generar y enviar archivo SUIR+ para la TSS',
        category: 'Reportes',
        assigneeId: 'emp-005',
        dueDate: getFutureDate(2),
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
    },
    {
        id: 'task-002',
        title: 'Procesar nómina quincenal (1ra quincena de Julio)',
        category: 'Nómina',
        assigneeId: 'emp-005',
        dueDate: getFutureDate(10),
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
    },
    {
        id: 'task-003',
        title: 'Completar onboarding de John Doe',
        category: 'Onboarding',
        assigneeId: 'emp-001',
        dueDate: getFutureDate(-1), // Overdue
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
    },
    {
        id: 'task-004',
        title: 'Revisar solicitud de vacaciones de Ana García',
        category: 'Gestión',
        assigneeId: 'emp-003',
        dueDate: getFutureDate(1),
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
    },
    {
        id: 'task-005',
        title: 'Preparar reporte IR-3 para la DGII',
        category: 'Reportes',
        assigneeId: 'emp-005',
        dueDate: getFutureDate(25),
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
    },
    {
        id: 'task-006',
        title: 'Actualizar política de comisiones en el sistema',
        category: 'Configuración',
        assigneeId: 'emp-001',
        dueDate: getFutureDate(40),
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
    },
     {
        id: 'task-007',
        title: 'Auditoría interna de salarios Q2',
        category: 'Finanzas',
        assigneeId: 'emp-003',
        dueDate: getFutureDate(18),
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
    },
    {
        id: 'task-008',
        title: 'Planificar pago de Regalía Pascual',
        category: 'Nómina',
        assigneeId: 'emp-005',
        dueDate: getFutureDate(150),
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
    }
];

export const CONTRACT_TEMPLATE_TEXT = `
CONTRATO DE TRABAJO

ENTRE:
De una parte, {companyName}, sociedad comercial constituida y organizada de conformidad con las leyes de la República Dominicana, con Registro Nacional de Contribuyente (RNC) No. {companyRNC}, con su domicilio social principal en {companyAddress}, debidamente representada por su Gerente; en lo que sigue del presente contrato se denominará EL EMPLEADOR.

Y de la otra parte, {employeeName}, de nacionalidad {nationality}, portador(a) del documento de identidad No. {identifier}, domiciliado(a) y residente en la ciudad de Santo Domingo, Distrito Nacional; en lo que sigue del presente contrato se denominará EL EMPLEADO.

HAN CONVENIDO Y PACTADO LO SIGUIENTE:

PRIMERO: EL EMPLEADOR contrata los servicios de EL EMPLEADO para desempeñar el puesto de {position}, bajo la supervisión y dirección del departamento de {department}.

SEGUNDO: EL EMPLEADO se compromete a realizar las funciones inherentes a su puesto con la mayor diligencia y eficiencia, cumpliendo con las políticas y procedimientos establecidos por EL EMPLEADOR.

TERCERO: La jornada de trabajo será de cuarenta y cuatro (44) horas semanales, distribuidas según el horario que EL EMPLEADOR establezca.

CUARTO: Por la prestación de sus servicios, EL EMPLEADO recibirá un salario mensual de {salary} (DOP), pagadero en dos cuotas quincenales. A este salario se le aplicarán las deducciones de ley correspondientes (TSS, ISR).

QUINTO: El presente contrato de trabajo iniciará en fecha {startDate} y tendrá una duración {duration}, sujeto a un período de prueba de tres (3) meses.

SEXTO: Para todo lo no previsto en el presente contrato, las partes se remiten a las disposiciones del Código de Trabajo de la República Dominicana y demás leyes aplicables.

Hecho y firmado en dos (2) originales de un mismo tenor y efecto, en la ciudad de Santo Domingo, Distrito Nacional, República Dominicana, a los {currentDate}.


_________________________
{employeeName}
EL EMPLEADO

_________________________
Por: {companyName}
EL EMPLEADOR
`;

export const LIQUIDACION_TEMPLATE_TEXT = `
ACTO DE LIQUIDACIÓN DE PRESTACIONES LABORALES

En la ciudad de Santo Domingo, Distrito Nacional, República Dominicana, a los {currentDate}.

DE UNA PARTE: La empresa {companyName}, con RNC No. {companyRNC}, debidamente representada, en lo adelante EL EMPLEADOR.

DE OTRA PARTE: El(la) Sr(a). {employeeName}, portador(a) del documento de identidad No. {identifier}, en lo adelante EL TRABAJADOR.

ANTECEDENTES:
1. Que EL TRABAJADOR ha prestado servicios para EL EMPLEADOR desde el {startDate} hasta la fecha actual, desempeñando la posición de {position}.
2. Que las partes han decidido poner fin al contrato de trabajo por la causa de: {reason}.
3. Que EL EMPLEADOR ha procedido a calcular los derechos y prestaciones laborales que corresponden a EL TRABAJADOR de conformidad con el Código de Trabajo de la República Dominicana.

DESGLOSE DE VALORES A PAGAR:
--------------------------------------------------
- Preaviso:                     {preaviso}
- Auxilio de Cesantía:          {cesantia}
- Vacaciones (proporcional):    {vacaciones}
- Salario de Navidad (proporcional): {salario13}
--------------------------------------------------
- TOTAL A RECIBIR:              {total}
--------------------------------------------------

DECLARACIÓN:
EL TRABAJADOR declara recibir en este acto la suma de {totalWords} ({total}) por concepto de la liquidación total de sus prestaciones laborales, no teniendo nada más que reclamar por ningún concepto, ya sea por salarios caídos, horas extras, comisiones, ni por cualquier otro derecho derivado de la relación laboral que unió a las partes.

Hecho y firmado en dos (2) originales de un mismo tenor y efecto.


_________________________
{employeeName}
EL TRABAJADOR

_________________________
Por: {companyName}
EL EMPLEADOR
`;

export const MOCK_HOLIDAYS: Holiday[] = [
    { date: '2024-01-01', name: 'Año Nuevo' },
    { date: '2024-01-06', name: 'Día de los Santos Reyes' },
    { date: '2024-01-21', name: 'Día de la Altagracia' },
    { date: '2024-01-29', name: 'Día de Duarte (Movido)' },
    { date: '2024-02-27', name: 'Día de la Independencia' },
    { date: '2024-03-29', name: 'Viernes Santo' },
    { date: '2024-04-29', name: 'Día del Trabajo (Movido)' },
    { date: '2024-05-30', name: 'Corpus Christi' },
    { date: '2024-08-16', name: 'Día de la Restauración' },
    { date: '2024-09-24', name: 'Día de las Mercedes' },
    { date: '2024-11-04', name: 'Día de la Constitución (Movido)' },
    { date: '2024-12-25', name: 'Día de Navidad' },
];