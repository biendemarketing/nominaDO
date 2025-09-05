import React, { useState, useEffect } from 'react';
import { Employee, Contract, CompanyProfile } from '../types';
import { CONTRACT_TEMPLATE_TEXT } from '../constants';
import { Download, FileText } from './icons';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  contract: Contract | null;
  companyProfile: CompanyProfile | null;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, employee, contract, companyProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  const getFormattedContractText = () => {
    if (!employee || !contract || !companyProfile) return '';
    let text = CONTRACT_TEMPLATE_TEXT;
    text = text.replace(/{companyName}/g, companyProfile.name);
    text = text.replace(/{companyRNC}/g, companyProfile.rnc);
    text = text.replace(/{companyAddress}/g, companyProfile.address);
    text = text.replace(/{employeeName}/g, employee.name);
    text = text.replace(/{nationality}/g, employee.nationality.toLowerCase());
    text = text.replace(/{identifier}/g, employee.identifier);
    text = text.replace(/{position}/g, employee.position);
    text = text.replace(/{department}/g, employee.department);
    text = text.replace(/{salary}/g, formatCurrency(employee.salary));
    text = text.replace(/{startDate}/g, formatDate(contract.startDate));
    const durationText = contract.isIndefinite ? 'indefinida' : `definida hasta el ${formatDate(contract.endDate)}`;
    text = text.replace(/{duration}/g, durationText);
    text = text.replace(/{currentDate}/g, new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }));
    return text;
  };
  
  useEffect(() => {
    if (isOpen) {
        setIsEditing(false); // Reset editing state on open
        setEditedText(getFormattedContractText());
    }
  }, [isOpen]);


  const handleDownload = () => {
    alert(`Simulando descarga del contrato de ${employee?.name} en PDF.`);
    console.log("Final text to download:", isEditing ? editedText : getFormattedContractText());
  };

  if (!isOpen || !employee || !contract || !companyProfile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-secondary mr-3" />
            <h2 className="font-heading text-2xl font-bold text-primary">Contrato de Trabajo</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold py-2 px-2 rounded-lg text-2xl leading-none">&times;</button>
        </div>
        <div className="p-8 overflow-y-auto bg-light">
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            {isEditing ? (
                <textarea 
                    className="w-full h-96 font-sans text-sm border rounded-md p-4"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
            ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {getFormattedContractText()}
                </pre>
            )}
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-between items-center rounded-b-xl border-t">
          <button type="button" onClick={() => setIsEditing(!isEditing)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
            {isEditing ? 'Guardar Cambios' : 'Editar Plantilla'}
          </button>
          <div className="flex items-center space-x-3">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                Cerrar
              </button>
              <button onClick={handleDownload} type="button" className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                <Download className="w-5 h-5 mr-2" />
                Descargar PDF (Simulado)
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;