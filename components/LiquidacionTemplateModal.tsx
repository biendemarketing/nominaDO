import React, { useState, useEffect } from 'react';
import { LiquidacionRun, Contract } from '../types';
import { LIQUIDACION_TEMPLATE_TEXT, MOCK_COMPANY_PROFILE } from '../constants';
import { Download, FileText } from './icons';

interface LiquidacionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LiquidacionRun | null;
  contract: Contract | undefined;
}

const LiquidacionTemplateModal: React.FC<LiquidacionTemplateModalProps> = ({ isOpen, onClose, data, contract }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  const companyProfile = MOCK_COMPANY_PROFILE;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const numberToWords = (num: number): string => {
      const integerPart = Math.floor(num);
      const decimalPart = Math.round((num - integerPart) * 100);
      return `${integerPart.toLocaleString('es-ES')} CON ${decimalPart.toString().padStart(2, '0')}/100 PESOS DOMINICANOS`;
  };

  const getFormattedText = () => {
    if (!data || !contract) return '';
    let text = LIQUIDACION_TEMPLATE_TEXT;
    text = text.replace(/{currentDate}/g, new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }));
    text = text.replace(/{companyName}/g, companyProfile.name);
    text = text.replace(/{companyRNC}/g, companyProfile.rnc);
    text = text.replace(/{employeeName}/g, data.employee.name);
    text = text.replace(/{identifier}/g, data.employee.identifier);
    text = text.replace(/{startDate}/g, formatDate(contract.startDate));
    text = text.replace(/{position}/g, data.employee.position);
    text = text.replace(/{reason}/g, data.reason);
    text = text.replace(/{preaviso}/g, formatCurrency(data.preaviso));
    text = text.replace(/{cesantia}/g, formatCurrency(data.cesantia));
    text = text.replace(/{vacaciones}/g, formatCurrency(data.vacaciones));
    text = text.replace(/{salario13}/g, formatCurrency(data.salario13));
    text = text.replace(/{total}/g, formatCurrency(data.total));
    text = text.replace(/{totalWords}/g, numberToWords(data.total));
    return text;
  };
  
  useEffect(() => {
    if (isOpen) {
        setIsEditing(false); // Reset editing state on open
        setEditedText(getFormattedText());
    }
  }, [isOpen]);

  const handleDownload = () => {
    alert(`Simulando descarga del documento de liquidación de ${data?.employee.name} en PDF.`);
    console.log("Final text to download:", isEditing ? editedText : getFormattedText());
  };

  if (!isOpen || !data || !contract) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-secondary mr-3" />
            <h2 className="font-heading text-2xl font-bold text-primary">Documento de Liquidación</h2>
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
                    {getFormattedText()}
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

export default LiquidacionTemplateModal;