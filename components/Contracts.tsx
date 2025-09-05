
import React, { useState, useMemo } from 'react';
import { MOCK_COMPANY_PROFILE } from '../constants';
import { Contract, Employee, EmployeeDocument } from '../types';
import Card from './Card';
import { Search } from './icons';
import ContractModal from './ContractModal';
import EditContractModal from './EditContractModal';

interface ContractsProps {
  employees: Employee[];
  contracts: Contract[];
  onSelectEmployee: (employeeId: string) => void;
  documents: EmployeeDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<EmployeeDocument[]>>;
  onUpdateContract: (contract: Contract, salary?: number) => void;
}

interface SelectedContractData {
  employee: Employee;
  contract: Contract;
}

const Contracts: React.FC<ContractsProps> = ({ employees, contracts, onSelectEmployee, documents, setDocuments, onUpdateContract }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContractData, setSelectedContractData] = useState<SelectedContractData | null>(null);

  const employeeMap = useMemo(() => 
    new Map(employees.map(e => [e.id, e])), 
  [employees]);

  const getContractStatus = (contract: Contract): { text: string; badgeClass: string } => {
    if (contract.status !== 'Activo') {
        return { text: contract.status, badgeClass: 'bg-gray-200 text-gray-800' };
    }
    if (contract.isIndefinite || !contract.endDate) {
        return { text: 'Activo', badgeClass: 'bg-green-100 text-green-800' };
    }
    const end = new Date(contract.endDate + 'T00:00:00');
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (end < now) {
      return { text: 'Finalizado', badgeClass: 'bg-red-100 text-red-800' };
    }
    if (end.getTime() - now.getTime() < thirtyDays) {
      return { text: 'Vence Pronto', badgeClass: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'Activo', badgeClass: 'bg-green-100 text-green-800' };
  };

  const handleViewContract = (contract: Contract) => {
    const employee = employeeMap.get(contract.employeeId);
    if (!employee) return;

    const contractDocExists = documents.some(doc => doc.employeeId === employee.id && doc.type === 'Contrato');
    if (!contractDocExists) {
        const newContractDoc: EmployeeDocument = {
            id: `doc-con-${employee.id}`,
            employeeId: employee.id,
            name: `Contrato Generado - ${employee.name}`,
            type: 'Contrato',
            uploadDate: new Date().toISOString().split('T')[0],
            fileContent: '', // Placeholder for generated PDF
            fileType: 'application/pdf', // Assume PDF
            status: 'Generado',
        };
        setDocuments(prevDocs => [...prevDocs, newContractDoc]);
    }
    
    setSelectedContractData({ employee, contract });
    setIsViewModalOpen(true);
  };
  
  const handleEditContract = (contract: Contract) => {
    const employee = employeeMap.get(contract.employeeId);
    if (!employee) return;
    setSelectedContractData({ employee, contract });
    setIsEditModalOpen(true);
  }

  const handleSaveContract = (updatedContract: Contract, newSalary: number) => {
    onUpdateContract(updatedContract, newSalary);
    setIsEditModalOpen(false);
  };

  const filteredContracts = useMemo(() => contracts.filter(contract => {
    const employee = employeeMap.get(contract.employeeId);
    if (!employee) return false;
    return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contract.id.toLowerCase().includes(searchTerm.toLowerCase());
  }), [searchTerm, employeeMap, contracts]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Gestión de Contratos</h1>
      <p className="text-gray-500 mt-1">Visualiza y administra todos los contratos de tus empleados.</p>

      <Card className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por empleado o ID de contrato..."
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
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Estatus</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => {
                const employee = employeeMap.get(contract.employeeId)!;
                const status = getContractStatus(contract);
                return (
                  <tr key={contract.id} className="border-b border-gray-200 hover:bg-light transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                        <div>
                          <p className="font-semibold text-primary">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{formatDate(contract.startDate)} - {contract.isIndefinite ? <span className="font-semibold">Indefinido</span> : formatDate(contract.endDate)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.badgeClass}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <button onClick={() => handleViewContract(contract)} className="text-secondary hover:text-secondary/80 font-medium">Ver</button>
                            <button onClick={() => handleEditContract(contract)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                            <button onClick={() => handleEditContract(contract)} className="text-green-600 hover:text-green-800 font-medium">Renovar</button>
                            <button onClick={() => onSelectEmployee(employee.id)} className="text-primary/70 hover:text-primary font-medium">Perfil</button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      
      {selectedContractData && (
        <>
            <ContractModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                employee={selectedContractData.employee}
                contract={selectedContractData.contract}
                companyProfile={MOCK_COMPANY_PROFILE}
            />
            <EditContractModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                contract={selectedContractData.contract}
                employee={selectedContractData.employee}
                onSave={handleSaveContract}
            />
        </>
      )}
    </div>
  );
};

export default Contracts;