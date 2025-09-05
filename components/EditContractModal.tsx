import React, { useState, useEffect } from 'react';
import { Employee, Contract, ContractStatus } from '../types';

interface EditContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Contract, salary: number) => void;
  contract: Contract | null;
  employee: Employee | null;
}

const InputField: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; children?: React.ReactNode; disabled?: boolean; required?: boolean }> =
({ label, id, type = 'text', value, onChange, children, disabled = false, required = true }) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-semibold mb-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>
        {children ? (
            <select id={id} name={id} value={value} onChange={onChange} disabled={disabled} required={required} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition disabled:bg-gray-200">
                {children}
            </select>
        ) : (
            <input type={type} id={id} name={id} value={value} onChange={onChange} disabled={disabled} required={required} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition disabled:bg-gray-200" />
        )}
    </div>
);

const ToggleField: React.FC<{ label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> =
({ label, id, checked, onChange }) => (
    <div className="flex items-center justify-between col-span-full bg-light p-3 rounded-lg border">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-600">{label}</label>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id={id} name={id} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-secondary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
        </label>
    </div>
);


const EditContractModal: React.FC<EditContractModalProps> = ({ isOpen, onClose, onSave, contract, employee }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    status: 'Activo' as ContractStatus,
    salary: 0,
    isIndefinite: false,
  });

  useEffect(() => {
    if (contract && employee) {
      setFormData({
        startDate: contract.startDate,
        endDate: contract.endDate || '',
        status: contract.status,
        salary: employee.salary,
        isIndefinite: contract.isIndefinite,
      });
    }
  }, [contract, employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    
    const updatedContract: Contract = {
        ...contract,
        startDate: formData.startDate,
        endDate: formData.isIndefinite ? undefined : formData.endDate,
        isIndefinite: formData.isIndefinite,
        status: formData.status,
    };
    
    onSave(updatedContract, Number(formData.salary));
  };

  if (!isOpen || !contract || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b">
            <h2 className="font-heading text-2xl font-bold text-primary">Editar Contrato</h2>
            <p className="text-gray-500 mt-1">Modificando contrato de <span className="font-semibold">{employee.name}</span>.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <ToggleField label="Contrato por tiempo indefinido" id="isIndefinite" checked={formData.isIndefinite} onChange={handleChange} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Fecha de Inicio" id="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                    <InputField label="Fecha de Fin" id="endDate" type="date" value={formData.endDate} onChange={handleChange} disabled={formData.isIndefinite} required={!formData.isIndefinite} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Salario Mensual (DOP)" id="salary" type="number" value={formData.salary} onChange={handleChange} />
                    <InputField label="Estatus del Contrato" id="status" value={formData.status} onChange={handleChange}>
                        <option>Activo</option>
                        <option>Finalizado</option>
                        <option>Terminado Anticipadamente</option>
                    </InputField>
                </div>
            </div>
            <div className="p-6 bg-light flex justify-end items-center space-x-3 rounded-b-xl">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                    Cancelar
                </button>
                <button type="submit" className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                    Guardar Cambios
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditContractModal;