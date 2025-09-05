
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Plus, Users, FileText, UserPlus, ClipboardCheck } from './icons';
import { Employee, SearchResult, AppView } from '../types';

const reportTypes = [
  { id: 'TSS', title: 'Autodeterminación (SUIR+)', description: 'Reporte para la TSS' },
  { id: 'DGII', title: 'Retenciones Asalariados (IR-3)', description: 'Reporte para la DGII' },
  { id: 'DGT3', title: 'Planilla Personal Fijo (DGT-3)', description: 'Reporte para Min. de Trabajo' },
  { id: 'DGT4', title: 'Cambios en Personal (DGT-4)', description: 'Reporte para Min. de Trabajo' },
];

interface HeaderProps {
    employees: Employee[];
    onSelectEmployee: (employeeId: string) => void;
    setActiveView: (view: AppView) => void;
    onOpenAddEmployeeModal: () => void;
    onOpenTaskModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ employees, onSelectEmployee, setActiveView, onOpenAddEmployeeModal, onOpenTaskModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (searchTerm.length < 2) return [];
    
    const lowercasedTerm = searchTerm.toLowerCase();

    const employeeResults = employees
      .filter(e => e.name.toLowerCase().includes(lowercasedTerm) || e.identifier.includes(lowercasedTerm))
      .map(e => ({
        id: e.id,
        type: 'employee' as 'employee',
        title: e.name,
        description: e.position,
      }));

    const reportResults = reportTypes
      .filter(r => r.title.toLowerCase().includes(lowercasedTerm) || r.id.toLowerCase().includes(lowercasedTerm))
      .map(r => ({
        id: r.id,
        type: 'report' as 'report',
        title: r.title,
        description: r.description,
      }));

    return [...employeeResults, ...reportResults];
  }, [searchTerm, employees]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'employee') {
      onSelectEmployee(result.id);
    } else {
      setActiveView(AppView.REPORTS);
    }
    setSearchTerm('');
  };

  return (
    <header className="bg-white h-20 flex items-center justify-between px-8 border-b border-gray-200 z-30 relative">
      <div className="flex items-center">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar empleado, reporte..."
            className="pl-10 pr-4 py-2 w-80 bg-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-xl overflow-hidden">
              <ul>
                {searchResults.map(result => (
                  <li key={`${result.type}-${result.id}`} onClick={() => handleSelectResult(result)} className="flex items-center px-4 py-3 hover:bg-light cursor-pointer">
                    <div className="p-2 bg-secondary/10 rounded-md mr-3">
                      {result.type === 'employee' ? <Users className="w-5 h-5 text-secondary" /> : <FileText className="w-5 h-5 text-secondary" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-primary">{result.title}</p>
                      <p className="text-xs text-gray-500">{result.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative" ref={addMenuRef}>
            <button 
                onClick={() => setIsAddMenuOpen(prev => !prev)}
                className="p-2 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
            {isAddMenuOpen && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl overflow-hidden py-1">
                     <button onClick={() => { onOpenAddEmployeeModal(); setIsAddMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-light">
                        <UserPlus className="w-4 h-4 mr-3 text-gray-500"/> Añadir Empleado
                     </button>
                     <button onClick={() => { onOpenTaskModal(); setIsAddMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-light">
                        <ClipboardCheck className="w-4 h-4 mr-3 text-gray-500"/> Crear Tarea
                     </button>
                 </div>
            )}
        </div>
        <button className="relative text-gray-500 hover:text-primary transition">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src="https://picsum.photos/id/1005/40/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm text-primary">Juan Pérez</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;