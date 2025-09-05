import React, { useState } from 'react';
import { Employee, Contract, Nationality } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Fix: Update the onSave prop to expect contractData without a status, as it's set in App.tsx
  onSave: (employeeData: Omit<Employee, 'id' | 'avatarUrl' | 'status'>, contractData: Omit<Contract, 'id' | 'employeeId' | 'status'>) => void;
}

const InputField: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; required?: boolean; disabled?: boolean; children?: React.ReactNode }> =
({ label, id, type = 'text', value, onChange, required = true, disabled = false, children }) => (
    <div>
        <label htmlFor={id} className={`block text-sm font-semibold mb-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>
        {children ? (
            <select id={id} name={id} value={value} onChange={onChange} required={required} disabled={disabled} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition disabled:bg-gray-200">
                {children}
            </select>
        ) : (
            <input type={type} id={id} name={id} value={value} onChange={onChange} required={required} disabled={disabled} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition disabled:bg-gray-200" />
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


const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave }) => {
  const initialState = {
    name: '',
    position: '',
    department: '',
    salary: '',
    nationality: Nationality.DOMINICAN,
    identifier: '',
    gender: 'Female' as 'Male' | 'Female',
    birthDate: '',
    startDate: '',
    endDate: '',
    paysTSS: true,
    isFiscalResident: true,
    isIndefinite: false,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData: Omit<Employee, 'id' | 'avatarUrl' | 'status'> = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        salary: Number(formData.salary),
        nationality: formData.nationality,
        identifier: formData.identifier,
        gender: formData.gender,
        birthDate: formData.birthDate,
        paysTSS: formData.nationality === Nationality.FOREIGN ? formData.paysTSS : true,
        isFiscalResident: formData.nationality === Nationality.FOREIGN ? formData.isFiscalResident : true,
    };

    const contractData: Omit<Contract, 'id' | 'employeeId' | 'status'> = {
        startDate: formData.startDate,
        endDate: formData.isIndefinite ? undefined : formData.endDate,
        isIndefinite: formData.isIndefinite,
    };
    
    onSave(employeeData, contractData);
    setFormData(initialState); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
            <h2 className="font-heading text-2xl font-bold text-primary">Añadir Nuevo Empleado</h2>
            <p className="text-gray-500 mt-1">Completa la información del empleado y su contrato.</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nombre Completo" id="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Cédula o Pasaporte" id="identifier" value={formData.identifier} onChange={handleChange} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Posición" id="position" value={formData.position} onChange={handleChange} />
                    <InputField label="Departamento" id="department" value={formData.department} onChange={handleChange} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Salario Mensual (DOP)" id="salary" type="number" value={formData.salary} onChange={handleChange} />
                    <InputField label="Nacionalidad" id="nationality" value={formData.nationality} onChange={handleChange}>
                        <option value={Nationality.DOMINICAN}>Dominicano(a)</option>
                        <option value={Nationality.FOREIGN}>Extranjero(a)</option>
                    </InputField>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Género" id="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Female">Femenino</option>
                        <option value="Male">Masculino</option>
                    </InputField>
                    <InputField label="Fecha de Nacimiento" id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>

                {formData.nationality === Nationality.FOREIGN && (
                    <div className="p-4 bg-primary/5 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                        <h3 className="font-heading text-md font-semibold text-primary col-span-full">Estatus Fiscal y Migratorio</h3>
                        <ToggleField label="¿Cotiza en la TSS?" id="paysTSS" checked={formData.paysTSS} onChange={handleCheckboxChange} />
                        <ToggleField label="¿Es Residente Fiscal?" id="isFiscalResident" checked={formData.isFiscalResident} onChange={handleCheckboxChange} />
                    </div>
                )}


                <hr className="my-4"/>
                <h3 className="font-heading text-lg font-semibold text-primary">Datos del Contrato</h3>
                <ToggleField label="Contrato por tiempo indefinido" id="isIndefinite" checked={formData.isIndefinite} onChange={handleCheckboxChange} />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Fecha de Inicio" id="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                    <InputField label="Fecha de Fin" id="endDate" type="date" value={formData.endDate} onChange={handleChange} disabled={formData.isIndefinite} required={!formData.isIndefinite}/>
                </div>
            </div>
            <div className="p-6 bg-light flex justify-end items-center space-x-3 rounded-b-xl">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                    Cancelar
                </button>
                <button type="submit" className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                    Guardar Empleado
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;