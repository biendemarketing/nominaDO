
import React, { useState } from 'react';
import { MOCK_PAYMENT_HISTORY, MOCK_EMPLOYEE_HISTORY, MOCK_COMPANY_PROFILE } from '../constants';
import { Employee, Contract, PaymentHistory, EmployeeHistoryEvent, Nationality, EmployeeDocument } from '../types';
import Card from './Card';
import { ArrowLeft, Info, FileSignature, History, FileText as FileIcon, Clock, UploadCloud, Trash2, Download, CheckCircle, FileImage } from './icons';
import ContractModal from './ContractModal';
import EditContractModal from './EditContractModal';
import UploadDocumentModal from './UploadDocumentModal';


interface EmployeeProfileProps {
  employeeId: string;
  employees: Employee[];
  contracts: Contract[];
  onUpdateContract: (contract: Contract, salary?: number) => void;
  onBack: () => void;
  documents: EmployeeDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<EmployeeDocument[]>>;
  onAddNewDocument: (docData: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
}

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = 
({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 font-semibold text-sm rounded-md transition-all duration-200 w-full text-left ${
            isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const InfoItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-primary text-md">{value}</p>
    </div>
);

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeId, employees, contracts, onUpdateContract, onBack, documents, setDocuments, onAddNewDocument }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isViewContractModalOpen, setIsViewContractModalOpen] = useState(false);
  const [isEditContractModalOpen, setIsEditContractModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const employee = employees.find(e => e.id === employeeId);
  const contract = contracts.find(c => c.employeeId === employeeId);
  const paymentHistory = MOCK_PAYMENT_HISTORY.filter(p => p.employeeId === employeeId);
  const historyEvents = MOCK_EMPLOYEE_HISTORY.filter(h => h.employeeId === employeeId);

  if (!employee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Empleado no encontrado</h2>
        <button onClick={onBack} className="mt-4 text-secondary hover:underline">Volver a la lista</button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  const handleDeleteDocument = (docId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
  };
  
  const handleSaveDocument = (docData: Omit<EmployeeDocument, 'id' | 'uploadDate' | 'status' | 'employeeId'>) => {
    onAddNewDocument({
        ...docData,
        employeeId: employee.id,
        status: 'Otro', // default status
    });
    setIsUploadModalOpen(false);
  };
  
  const handleDownloadHistory = () => {
      alert(`Simulando descarga del historial de pagos para ${employee.name}...`);
      console.log("Payment History to download:", paymentHistory);
  }

  const handleViewContract = () => {
    if (!employee || !contract) return;
    const contractDocExists = documents.some(doc => doc.employeeId === employee.id && doc.type === 'Contrato');
    if (!contractDocExists) {
        const newContractDoc: EmployeeDocument = {
            id: `doc-con-${employee.id}`,
            employeeId: employee.id,
            name: `Contrato Generado - ${employee.name}`,
            type: 'Contrato',
            uploadDate: new Date().toISOString().split('T')[0],
            fileContent: '',
            fileType: 'application/pdf',
            status: 'Generado',
        };
        setDocuments(prevDocs => [...prevDocs, newContractDoc]);
    }
    setIsViewContractModalOpen(true);
  };
  
  const handleSaveContract = (updatedContract: Contract, newSalary: number) => {
    onUpdateContract(updatedContract, newSalary);
    setIsEditContractModalOpen(false);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'general':
            return (
                <Card>
                    <h3 className="font-heading text-lg font-bold text-primary mb-6">Información General</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                        <InfoItem label="Nombre Completo" value={employee.name} />
                        <InfoItem label="Posición" value={employee.position} />
                        <InfoItem label="Departamento" value={employee.department} />
                        <InfoItem label="Salario Mensual" value={formatCurrency(employee.salary)} />
                        <InfoItem label="Estatus" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : employee.status === 'Terminated' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{employee.status}</span>} />
                        
                        <hr className="col-span-full my-2"/>

                        <InfoItem label="Nacionalidad" value={employee.nationality} />
                        {employee.nationality === Nationality.DOMINICAN ? (
                            <>
                                <InfoItem label="Cédula" value={employee.identifier} />
                                <InfoItem label="NSS" value={employee.nss || 'N/A'} />
                            </>
                        ) : (
                            <>
                                <InfoItem label="Pasaporte" value={employee.identifier} />
                                <InfoItem label="Estatus Migratorio" value={employee.migratoryStatus || 'N/A'} />
                                <InfoItem label="Vencimiento de Visa" value={employee.visaExpiry ? formatDate(employee.visaExpiry) : 'N/A'} />
                                <InfoItem label="Cotiza en TSS" value={employee.paysTSS ? 'Sí' : 'No'} />
                                <InfoItem label="Es Residente Fiscal" value={employee.isFiscalResident ? 'Sí' : 'No'} />
                            </>
                        )}
                    </div>
                </Card>
            );
        case 'contract':
             return (
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-heading text-lg font-bold text-primary">Información del Contrato</h3>
                        {contract && (
                            <div className="flex items-center space-x-2">
                                 <button onClick={handleViewContract} className="text-secondary hover:text-secondary/80 font-medium text-sm py-2 px-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all">Ver Contrato</button>
                                 <button onClick={() => setIsEditContractModalOpen(true)} className="text-blue-600 hover:text-blue-800 font-medium text-sm py-2 px-4 rounded-lg bg-blue-100/60 hover:bg-blue-200/60 transition-all">Editar Contrato</button>
                            </div>
                        )}
                    </div>
                    {contract ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <InfoItem label="ID de Contrato" value={contract.id} />
                            <InfoItem label="Fecha de Inicio" value={formatDate(contract.startDate)} />
                            <InfoItem label="Fecha de Fin" value={contract.isIndefinite ? 'Indefinido' : formatDate(contract.endDate)} />
                            <InfoItem label="Estatus" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${contract.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{contract.status}</span>} />
                        </div>
                    ) : <p className="text-gray-500">No se encontró información del contrato.</p>}
                </Card>
            );
        case 'history':
            return (
                <Card>
                    <h3 className="font-heading text-lg font-bold text-primary mb-4">Historial del Empleado</h3>
                    <div className="relative">
                        <div className="absolute left-4 h-full border-l-2 border-gray-200"></div>
                        {historyEvents.map((event, index) => (
                            <div key={event.id} className="mb-8 pl-12 relative">
                                <div className="absolute left-0 top-1 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center -translate-x-1/2">
                                    <div className="w-4 h-4 bg-secondary rounded-full"></div>
                                </div>
                                <p className="font-semibold text-primary">{event.eventType}</p>
                                <p className="text-sm text-gray-500 mb-1">{formatDate(event.date)}</p>
                                <p className="text-gray-700">{event.description}</p>
                            </div>
                        ))}
                         {historyEvents.length === 0 && <p className="text-gray-500 pl-12">No hay eventos históricos para este empleado.</p>}
                    </div>
                </Card>
            );
        case 'payments':
            return (
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-heading text-lg font-bold text-primary">Historial de Pagos</h3>
                        <button onClick={handleDownloadHistory} className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm text-sm">
                            <Download className="w-4 h-4 mr-2" /> Descargar Historial
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-200 bg-gray-50">
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Bruto</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Monto Neto</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {paymentHistory.map(p => (
                                    <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm">{formatDate(p.payDate)}</td>
                                        <td className="py-4 px-4 text-sm">{p.period}</td>
                                        <td className="py-4 px-4 text-sm text-right">{formatCurrency(p.grossPay)}</td>
                                        <td className="py-4 px-4 text-sm text-right font-bold text-primary">{formatCurrency(p.netPay)}</td>
                                    </tr>
                                ))}
                                {paymentHistory.length === 0 && (
                                     <tr><td colSpan={4} className="text-center py-8 text-gray-400">No hay pagos registrados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            );
         case 'documents':
            return (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-heading text-lg font-bold text-primary">Documentos</h3>
                        <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm text-sm">
                            <UploadCloud className="w-4 h-4 mr-2"/> Subir Nuevo Documento
                        </button>
                    </div>
                    <div className="space-y-3 mt-6">
                        {documents.map(doc => {
                           const isSignedContract = doc.type === 'Contrato' && doc.status === 'Firmado';
                           const isImage = doc.fileType.startsWith('image/');
                           
                           return (
                             <div key={doc.id} className="flex items-center justify-between p-3 bg-light rounded-lg border border-gray-200/80">
                                <div className="flex items-center flex-1 min-w-0">
                                    {isImage ? (
                                        <img src={doc.fileContent} alt={doc.name} className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0" />
                                    ) : isSignedContract ? (
                                        <CheckCircle className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                                    ) : (
                                        <FileIcon className="w-8 h-8 text-secondary mr-4 flex-shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <a href={doc.fileContent} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline truncate block">{doc.name}</a>
                                        <p className="text-xs text-gray-500">{doc.type} - Subido el {formatDate(doc.uploadDate)} - <span className={`font-semibold ${isSignedContract ? 'text-green-600' : 'text-gray-500'}`}>Estatus: {doc.status}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-md">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                           )
                        })}
                        {documents.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                <FileIcon className="w-12 h-12 mx-auto text-gray-300" />
                                <p className="mt-4 text-gray-500">No hay documentos para este empleado.</p>
                                 <button onClick={() => setIsUploadModalOpen(true)} className="mt-4 text-sm text-secondary font-semibold hover:underline">Subir el primero</button>
                            </div>
                        )}
                    </div>
                </Card>
            );
        default: return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-secondary hover:text-secondary/80 font-semibold p-2 rounded-md mr-4 transition-colors hover:bg-secondary/10">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la lista
        </button>
      </div>
      
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex items-center">
            <img src={employee.avatarUrl} alt={employee.name} className="w-24 h-24 rounded-full mr-6 border-4 border-secondary/50" />
            <div>
                <h1 className="font-heading text-3xl font-bold text-primary">{employee.name}</h1>
                <p className="text-gray-600 text-lg">{employee.position} &middot; <span className="text-gray-500">{employee.department}</span></p>
            </div>
        </div>
      </Card>

      {/* Tabs and Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
            <Card>
                <nav className="flex flex-col space-y-2">
                    <TabButton label="General" icon={<Info className="w-5 h-5"/>} isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                    <TabButton label="Contrato" icon={<FileSignature className="w-5 h-5"/>} isActive={activeTab === 'contract'} onClick={() => setActiveTab('contract')} />
                    <TabButton label="Historial" icon={<Clock className="w-5 h-5" />} isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                    <TabButton label="Pagos" icon={<History className="w-5 h-5"/>} isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    <TabButton label="Documentos" icon={<FileIcon className="w-5 h-5"/>} isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                </nav>
            </Card>
        </div>
        <div className="lg:w-3/4">
            {renderContent()}
        </div>
      </div>
       {contract && employee && (
        <>
            <ContractModal 
                isOpen={isViewContractModalOpen}
                onClose={() => setIsViewContractModalOpen(false)}
                employee={employee}
                contract={contract}
                companyProfile={MOCK_COMPANY_PROFILE}
            />
            <EditContractModal 
                isOpen={isEditContractModalOpen}
                onClose={() => setIsEditContractModalOpen(false)}
                contract={contract}
                employee={employee}
                onSave={handleSaveContract}
            />
        </>
      )}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleSaveDocument}
      />
    </div>
  );
};

export default EmployeeProfile;