
import React from 'react';
import { Download } from './icons';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    title: string;
    data: any;
  } | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const handleDownload = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report.data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${report.title.replace(/ /g, '_')}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="font-heading text-2xl font-bold text-primary">{report.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold py-2 px-2 rounded-lg text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto bg-light">
            <h3 className="font-semibold text-primary mb-2">Previsualización de Datos</h3>
            <pre className="bg-white p-4 rounded-lg border text-xs overflow-x-auto">
                {JSON.stringify(report.data, null, 2)}
            </pre>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end items-center space-x-3 rounded-b-xl border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                Cerrar
            </button>
            <button onClick={handleDownload} type="button" className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                <Download className="w-5 h-5 mr-2" />
                Descargar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;