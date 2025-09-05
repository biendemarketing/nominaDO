
import React, { useState } from 'react';
import { Employee, EmployeeStatus, Contract } from '../types';
import Card from './Card';
import { Search, UserPlus, Filter } from './icons';

interface EmployeeRowProps {
  employee: Employee;
  contract?: Contract;
  onSelectEmployee: (employeeId: string) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, contract, onSelectEmployee }) => {
  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case EmployeeStatus.ON_LEAVE:
        return 'bg-yellow-100 text-yellow-800';
      case EmployeeStatus.TERMINATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    // Add timezone to prevent off-by-one day errors
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const isContractExpiringSoon = (contract: Contract) => {
    if (contract.isIndefinite || !contract.endDate) return false;
    const end = new Date(contract.endDate);
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return (end.getTime() - now.getTime()) < thirtyDays && end > now;
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-light transition-colors cursor-pointer" onClick={() => onSelectEmployee(employee.id)}>
      <td className="py-4 px-6">
        <div className="flex items-center">
          <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
          <div>
            <p className="font-semibold text-primary">{employee.name}</p>
            <p className="text-sm text-gray-500">{employee.id}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-700">{employee.position}</td>
      <td className="py-4 px-6 text-gray-700">{employee.identifier}</td>
       <td className="py-4 px-6 text-gray-700">
        {contract ? (
          <div className="flex items-center">
            <span>{formatDate(contract.startDate)} - {contract.isIndefinite ? 'Indefinido' : formatDate(contract.endDate)}</span>
             {isContractExpiringSoon(contract) && (
              <span title="Contrato vence pronto" className="ml-2 w-3 h-3 bg-accent rounded-full animate-pulse"></span>
             )}
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>
      <td className="py-4 px-6 text-gray-700 font-medium">
        {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(employee.salary)}
      </td>
      <td className="py-4 px-6">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
          {employee.status}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <button onClick={(e) => { e.stopPropagation(); onSelectEmployee(employee.id); }} className="text-secondary hover:text-secondary/80 font-medium">Ver Perfil</button>
      </td>
    </tr>
  );
};

interface EmployeeListProps {
  employees: Employee[];
  contracts: Contract[];
  onSelectEmployee: (employeeId: string) => void;
  onOpenAddEmployeeModal: () => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, contracts, onSelectEmployee, onOpenAddEmployeeModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const contractMap = new Map(contracts.map(c => [c.employeeId, c]));

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Gestión de Empleados</h1>
          <p className="text-gray-500 mt-1">Administra los perfiles de tu equipo.</p>
        </div>
        <button 
            onClick={onOpenAddEmployeeModal}
            className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Añadir Empleado
        </button>
      </div>

      <Card className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, posición, cédula..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center text-gray-600 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-light">
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Posición</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Cédula/Pasaporte</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha de Contrato</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Salario</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Estatus</th>
                <th className="py-3 px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} contract={contractMap.get(employee.id)} onSelectEmployee={onSelectEmployee} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeList;