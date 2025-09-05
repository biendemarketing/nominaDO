import React from 'react';
import { AuthView } from '../types';
import { HandCoins } from './icons';

interface TermsOfServiceProps {
  setAuthView: (view: AuthView) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ setAuthView }) => {
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
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Términos y Condiciones de Uso</h1>
          <p className="text-gray-500 mb-8">Última actualización: 5 de septiembre de 2025</p>

          <div className="prose max-w-none text-gray-700">
            <p>Lea estos Términos y Condiciones ("Términos") cuidadosamente antes de utilizar la aplicación web NominaDO (la "Plataforma"), operada por Quisqueya Soluciones SRL.</p>
            <p>Su acceso y uso de la Plataforma están condicionados a su aceptación y cumplimiento de estos Términos. Estos Términos se aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen la Plataforma.</p>

            <h2>1. Cuentas y Responsabilidad del Usuario</h2>
            <ul>
              <li>Al crear una cuenta, usted garantiza que es mayor de 18 años y que la información proporcionada es precisa, completa y actual.</li>
              <li>Usted es responsable de salvaguardar la contraseña que utiliza para acceder a la Plataforma y de cualquier actividad o acción bajo su contraseña.</li>
              <li>Usted es el único responsable de la veracidad y exactitud de los datos de sus empleados y de la empresa que introduce en la Plataforma. NominaDO no se hace responsable de errores en los cálculos de nómina derivados de datos incorrectos introducidos por el usuario.</li>
            </ul>

            <h2>2. Servicios Prestados</h2>
            <p>NominaDO es una herramienta de software como servicio (SaaS) que facilita el cálculo de la nómina y la generación de reportes de cumplimiento basados en la legislación vigente de la República Dominicana. El servicio se basa en la información proporcionada por usted.</p>

            <h2>3. Pagos y Suscripciones</h2>
            <ul>
              <li>El uso de la Plataforma está sujeto al pago de una tarifa de suscripción, la cual se facturará de forma mensual o anual, según el plan elegido.</li>
              <li>Los pagos se realizarán a través de los métodos de pago disponibles en la Plataforma.</li>
              <li>Las suscripciones se renuevan automáticamente al final de cada período de facturación, a menos que usted las cancele.</li>
            </ul>

            <h2>4. Propiedad Intelectual</h2>
            <p>La Plataforma y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Quisqueya Soluciones SRL y sus licenciantes.</p>

            <h2>5. Limitación de Responsabilidad</h2>
            <ul>
              <li>NominaDO actúa como una plataforma de cálculo y automatización. La responsabilidad final de revisar, aprobar y presentar los reportes ante las autoridades correspondientes recae en el usuario.</li>
              <li>En ningún caso Quisqueya Soluciones SRL será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, entre otros, la pérdida de beneficios, datos o buena voluntad, que resulten de su acceso o uso de la Plataforma.</li>
              <li>Nuestra responsabilidad total por cualquier reclamo relacionado con los servicios no excederá el monto pagado por usted durante los tres (3) meses anteriores al acto que dio lugar a la reclamación.</li>
            </ul>

            <h2>6. Terminación</h2>
            <p>Podemos terminar o suspender su cuenta de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, el incumplimiento de los Términos.</p>

            <h2>7. Ley Aplicable</h2>
            <p>Estos Términos se regirán e interpretarán de conformidad con las leyes de la República Dominicana. Cualquier disputa será sometida a la jurisdicción exclusiva de los tribunales de Santo Domingo, Distrito Nacional.</p>

            <h2>8. Contacto</h2>
            <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a info@nominado.do.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
