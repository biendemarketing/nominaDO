import React, { useState } from 'react';
import { EmployeeDocument, DocumentType } from '../types';
import { DOCUMENT_TYPES } from '../constants';
import { FileUp } from './icons';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Omit<EmployeeDocument, 'id' | 'uploadDate' | 'status' | 'employeeId'>) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('Cédula/ID');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
       if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            setError('El archivo es muy grande. El límite es 5MB.');
            return;
        }
      setFile(selectedFile);
      if (!name) {
          setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
      setError('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const fileContent = reader.result as string;
        const fileType = file.type;
        onSave({ name, type, fileContent, fileType });
        handleClose();
    };
    reader.onerror = () => {
        setError('Error al leer el archivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setName('');
    setType('Cédula/ID');
    setFile(null);
    setError('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
                <h2 className="font-heading text-2xl font-bold text-primary">Subir Nuevo Documento</h2>
                <p className="text-gray-500 mt-1">Selecciona un archivo y asígnale un nombre y tipo.</p>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="docName" className="block text-sm font-semibold mb-2 text-gray-600">Nombre del Documento</label>
                    <input 
                        type="text" 
                        id="docName" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition" 
                    />
                </div>
                 <div>
                    <label htmlFor="docType" className="block text-sm font-semibold mb-2 text-gray-600">Tipo de Documento</label>
                    <select 
                        id="docType" 
                        value={type} 
                        onChange={(e) => setType(e.target.value as any)} 
                        required 
                        className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                    >
                        {DOCUMENT_TYPES.map(docType => (
                            <option key={docType} value={docType}>{docType}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-600">Archivo</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-light">
                        <div className="text-center">
                            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary/50 focus-within:ring-offset-2 hover:text-secondary/80">
                                    <span>Selecciona un archivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">o arrástralo aquí</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF, DOCX hasta 5MB</p>
                        </div>
                    </div>
                    {file && <p className="text-sm text-gray-500 mt-2">Archivo seleccionado: <span className="font-semibold">{file.name}</span></p>}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end items-center space-x-3 rounded-b-xl border-t">
                <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                    Cancelar
                </button>
                <button type="submit" className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                    Subir Documento
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;