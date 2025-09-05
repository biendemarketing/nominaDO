import React from 'react';
import { AuthView } from '../types';
import { HandCoins } from './icons';

interface PrivacyPolicyProps {
  setAuthView: (view: AuthView) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setAuthView }) => {
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
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Política de Privacidad</h1>
          <p className="text-gray-500 mb-8">Última actualización: 5 de septiembre de 2025</p>

          <div className="prose max-w-none text-gray-700">
            <p>Bienvenido a NominaDO ("nosotros", "nuestro"). Nos comprometemos a proteger la privacidad de nuestros usuarios ("usted", "su"). Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando utiliza nuestra aplicación web (la "Plataforma").</p>
            <p>Esta política se rige por las leyes de la República Dominicana, en especial la Ley No. 172-13 que tiene por objeto la protección integral de los datos personales.</p>
            
            <h2>1. Información que Recopilamos</h2>
            <p>Podemos recopilar información sobre usted de varias maneras:</p>
            <ul>
                <li><strong>Datos Personales y Empresariales:</strong> Información de identificación como su nombre, correo electrónico, número de teléfono, nombre de la empresa, Registro Nacional de Contribuyentes (RNC), y la información de sus empleados que usted introduce en la plataforma, incluyendo nombres, cédulas de identidad, salarios, datos de contacto y detalles bancarios.</li>
                <li><strong>Datos Financieros:</strong> Información relacionada con los pagos y la facturación del servicio, como datos de tarjetas de crédito o cuentas bancarias, procesados a través de pasarelas de pago seguras.</li>
                <li><strong>Datos de Uso:</strong> Información que su navegador envía automáticamente cuando utiliza la Plataforma, como su dirección IP, tipo de navegador, sistema operativo, y las páginas que visita dentro de nuestra aplicación.</li>
            </ul>

            <h2>2. Uso de su Información</h2>
            <p>Usamos la información recopilada para:</p>
            <ul>
                <li>Crear y gestionar su cuenta.</li>
                <li>Proveer el servicio principal de la Plataforma: cálculo y procesamiento de nóminas.</li>
                <li>Generar los reportes de cumplimiento para las entidades gubernamentales (TSS, DGII, MT).</li>
                <li>Procesar los pagos por el uso del servicio.</li>
                <li>Comunicarnos con usted sobre su cuenta o para ofrecerle soporte técnico.</li>
                <li>Mejorar la funcionalidad y seguridad de nuestra Plataforma.</li>
                <li>Cumplir con nuestras obligaciones legales y regulatorias.</li>
            </ul>

            <h2>3. Divulgación de su Información</h2>
            <p>No compartiremos su información personal o la de sus empleados con terceros, excepto en los siguientes casos:</p>
            <ul>
                <li><strong>Con Proveedores de Servicios:</strong> Para procesar pagos, analizar datos o prestar otros servicios en nuestro nombre. Estos proveedores están obligados contractualmente a proteger su información.</li>
                <li><strong>Por Requerimiento Legal:</strong> Si es requerido por una orden judicial o una solicitud de una autoridad gubernamental competente de la República Dominicana.</li>
                <li><strong>Para Proteger Nuestros Derechos:</strong> Para hacer cumplir nuestros Términos y Condiciones y proteger la seguridad de nuestra Plataforma y nuestros usuarios.</li>
            </ul>

            <h2>4. Seguridad de la Información</h2>
            <p>Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger su información. Todos los datos sensibles, como la información de empleados y credenciales, se almacenan de forma encriptada. Sin embargo, ningún sistema de seguridad es impenetrable y no podemos garantizar una seguridad absoluta.</p>

            <h2>5. Sus Derechos</h2>
            <p>De acuerdo con la Ley No. 172-13, usted tiene derecho a:</p>
            <ul>
                <li><strong>Acceder:</strong> Solicitar una copia de los datos personales que tenemos sobre usted.</li>
                <li><strong>Rectificar:</strong> Pedir la corrección de datos inexactos o incompletos.</li>
                <li><strong>Cancelar:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines que fueron recopilados.</li>
                <li><strong>Oponerse:</strong> Oponerse al tratamiento de sus datos por motivos legítimos.</li>
            </ul>
            <p>Para ejercer estos derechos, por favor contáctenos a legal@nominado.do.</p>

            <h2>6. Cambios a esta Política</h2>
            <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Le notificaremos sobre cualquier cambio publicando la nueva política en esta página.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
