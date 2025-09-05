import React, { useState } from 'react';
import { AuthView } from '../types';
import { HandCoins, ChevronDown } from './icons';

interface FAQProps {
  setAuthView: (view: AuthView) => void;
}

const faqs = [
    {
        question: '¿Qué es NominaDO?',
        answer: 'NominaDO es una aplicación web diseñada para simplificar y automatizar el proceso de cálculo de nómina para empresas en la República Dominicana. Genera cálculos precisos de salarios, deducciones de ley (TSS) e impuestos (ISR), y prepara los reportes para las entidades gubernamentales.'
    },
    {
        question: '¿NominaDO funciona para empresas de cualquier tamaño?',
        answer: '¡Sí! Nuestra plataforma es escalable y está diseñada para adaptarse tanto a pequeñas y medianas empresas (pymes) como a corporaciones más grandes que buscan optimizar su proceso de nómina.'
    },
    {
        question: '¿Cómo maneja la plataforma a los empleados extranjeros?',
        answer: 'Dentro del perfil de cada empleado, puedes especificar su estatus migratorio y fiscal. Esto permite a NominaDO aplicar o eximir de manera automática las deducciones de la Seguridad Social (TSS) y aplicar la retención de Impuesto Sobre la Renta (ISR) que corresponda según su condición.'
    },
    {
        question: '¿Está segura mi información y la de mis empleados?',
        answer: 'Absolutamente. La seguridad es nuestra máxima prioridad. Utilizamos encriptación de extremo a extremo para todos los datos sensibles y seguimos las mejores prácticas de la industria para proteger su información, de acuerdo con la Ley 172-13 de Protección de Datos Personales.'
    },
    {
        question: '¿Quién tiene acceso a los datos de mi empresa?',
        answer: 'Solo los usuarios que tú autorices dentro de tu cuenta pueden acceder a la información. Nuestro personal técnico solo accederá a tus datos con tu permiso explícito para fines de soporte técnico.'
    },
    {
        question: '¿Qué reportes puedo generar con NominaDO?',
        answer: 'Puedes generar con un solo clic los archivos de cumplimiento en el formato exacto que requieren las instituciones: Archivo de Autodeterminación (.txt) para la TSS, Reporte IR-3 para la DGII, y Formularios DGT-3 y DGT-4 (PDF) para el Ministerio de Trabajo, además de reportes de gestión interna.'
    },
    {
        question: '¿La plataforma realiza los pagos a los empleados directamente?',
        answer: 'NominaDO no realiza transferencias bancarias directas. Sin embargo, genera el archivo de dispersión de pagos en el formato específico de los principales bancos del país (Banreservas, Popular, BHD, etc.) para que puedas subirlo a tu portal bancario y ejecutar los pagos masivos de forma rápida y sin errores.'
    },
    {
        question: '¿Qué tipo de soporte ofrecen?',
        answer: 'Ofrecemos soporte técnico a través de chat en vivo, correo electrónico (soporte@nominado.do) y una base de conocimientos completa con tutoriales y guías paso a paso.'
    }
];

const FaqItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none"
            >
                <h3 className="text-lg font-semibold text-primary">{faq.question}</h3>
                <ChevronDown className={`w-6 h-6 text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <p className="p-6 pt-0 text-gray-600">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};


const FAQ: React.FC<FAQProps> = ({ setAuthView }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-light min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setAuthView(AuthView.LANDING)}>
            <HandCoins className="w-8 h-8 text-secondary" />
            <h1 className="text-2xl font-heading font-bold ml-2 text-primary">Nomina<span className="text-secondary">DO</span></h1>
          </div>
          <button onClick={() => setAuthView(AuthView.LANDING)} className="font-semibold text-primary hover:text-secondary transition">
            Volver al Inicio
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 md:p-12">
        <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold text-primary">Preguntas Frecuentes</h1>
            <p className="text-gray-500 mt-2">Encuentra respuestas a las dudas más comunes sobre NominaDO.</p>
        </div>
        
        <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden">
            {faqs.map((faq, index) => (
                <FaqItem 
                    key={index}
                    faq={faq}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                />
            ))}
        </div>
      </main>
    </div>
  );
};

export default FAQ;
