
import React from 'react';

interface AnalyticsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columns: { header: string; accessor: string }[];
  data: any[];
}

const AnalyticsDetailModal: React.FC<AnalyticsDetailModalProps> = ({ isOpen, onClose, title, columns, data }) => {
  if (!isOpen) return null;
  
  const formatValue = (value: any, accessor: string) => {
    if (accessor.toLowerCase().includes('salary')) {
      return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);
    }
    if (accessor.toLowerCase().includes('date')) {
      return new Date(value + 'T00:00:00').toLocaleDateString('es-DO');
    }
    return value;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="font-heading text-2xl font-bold text-primary">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold py-2 px-2 rounded-lg text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto bg-light">
          <div className="bg-white p-4 rounded-lg border">
            {data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-light">
                                {columns.map(col => (
                                    <th key={col.accessor} className="py-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">{col.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b last:border-0 hover:bg-light">
                                    {columns.map(col => (
                                        <td key={col.accessor} className="py-3 px-4 text-sm text-gray-700">{formatValue(row[col.accessor], col.accessor)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">No hay datos para mostrar en esta vista.</p>
            )}
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end items-center rounded-b-xl border-t">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetailModal;
