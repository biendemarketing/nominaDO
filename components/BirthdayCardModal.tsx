import React from 'react';
import { Employee } from '../types';
import { Cake } from './icons';

interface BirthdayCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const BirthdayCardModal: React.FC<BirthdayCardModalProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center p-8 relative overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/debut-light.png)' }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full"></div>
        <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-accent/20 rounded-full"></div>
        
        <div className="relative z-10">
            <Cake className="w-20 h-20 text-secondary mx-auto mb-4 animate-bounce" />

            <h2 className="font-heading text-4xl font-bold text-primary">
                ¡Feliz Cumpleaños!
            </h2>
            <h3 className="font-heading text-3xl font-semibold text-secondary mt-2">
                {employee.name}
            </h3>

            <p className="text-gray-600 mt-6 max-w-sm mx-auto">
                De parte de todo el equipo de <span className="font-bold text-primary">NominaDO</span>, 
                te deseamos un día lleno de alegría y éxito. ¡Gracias por tu increíble trabajo!
            </p>

            <button 
                onClick={onClose} 
                className="mt-8 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-all shadow-lg"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCardModal;