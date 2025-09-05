import React from 'react';
import { LiquidacionRun } from '../types';
import { UserX } from './icons';

interface LiquidacionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LiquidacionRun | null;
}

const DetailRow: React.FC<{ label: string, value: string | number, isTotal?: boolean }> = 
({ label, value, isTotal = false }) => {
    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
    
    return (
        <div className={`flex justify-between items-center py-3 ${isTotal ? 'font-bold text-lg border-t-2 mt-2 pt-3' : 'text-md border-b'}`}>
            <span className={isTotal ? 'text-primary' : 'text-gray-600'}>{label}</span>
            <span className={`font-semibold ${isTotal ? 'text-primary' : 'text-gray-800'}`}>
                {typeof value === 'number' ? formatCurrency(value) : value}
            </span>
        </div>
    );
};


const LiquidacionDetailModal: React.FC<LiquidacionDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center">
             <UserX className="w-6 h-6 text-secondary mr-3" />
             <h2 className="font-heading text-2xl font-bold text-primary">Detalle de Liquidación</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold py-2 px-2 rounded-lg text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
            <div className="flex items-center mb-6 p-4 bg-light rounded-lg">
                <img src={data.employee.avatarUrl} alt={data.employee.name} className="w-16 h-16 rounded-full mr-4 border-2 border-secondary/50" />
                <div>
                    <p className="font-bold text-xl text-primary">{data.employee.name}</p>
                    <p className="text-sm text-gray-500">Procesada: {new Date(data.processedDate).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-500">Motivo: <span className="font-semibold">{data.reason}</span></p>
                </div>
            </div>
            
            <h3 className="font-semibold text-primary mb-2">Desglose del Cálculo</h3>
            <div className="space-y-2">
                <DetailRow label="Preaviso" value={data.preaviso} />
                <DetailRow label="Auxilio de Cesantía" value={data.cesantia} />
                <DetailRow label="Vacaciones (proporcional)" value={data.vacaciones} />
                <DetailRow label="Salario de Navidad (proporcional)" value={data.salario13} />
                <DetailRow label="Total a Pagar" value={data.total} isTotal />
            </div>
        </div>
        <div className="p-6 bg-light flex justify-end items-center rounded-b-xl">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionDetailModal;