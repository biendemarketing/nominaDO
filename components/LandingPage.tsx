import React, { useState, useEffect } from 'react';
import { AuthView } from '../types';
import { HandCoins, CheckCircle2, DollarSign, BarChartBig, ShieldCheck, ArrowRight, Users, FileText, ChevronDown } from './icons';

declare var Chart: any;

interface LandingPageProps {
  setAuthView: (view: AuthView) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="font-heading text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

const profesionalPlanData = [
    { level: 1, price: 200, companies: 'Hasta 5', features: [
        'Panel de control multi-cliente',
        'Integración con QuickBooks',
        'Automatización de reportes fiscales',
        'Soporte prioritario 24/7',
    ]},
    { level: 2, price: 500, companies: 'Hasta 20', features: [
        'Todo lo del Nivel 1',
        'Personalización de informes',
        'Acceso API para integraciones',
        'Gestor de cuentas dedicado',
    ]},
    { level: 3, price: 1200, companies: 'Ilimitadas', features: [
        'Todo lo del Nivel 2',
        'Marca blanca para personalización',
        'Capacitación y onboarding',
        'Seguridad y cumplimiento avanzado',
    ]},
]

const topFaqs = [
    {
        question: '¿Qué es NominaDO?',
        answer: 'NominaDO es una aplicación web diseñada para simplificar y automatizar el proceso de cálculo de nómina para empresas en la República Dominicana. Genera cálculos precisos de salarios, deducciones de ley (TSS) e impuestos (ISR), y prepara los reportes para las entidades gubernamentales.'
    },
    {
        question: '¿Está segura mi información y la de mis empleados?',
        answer: 'Absolutamente. La seguridad es nuestra máxima prioridad. Utilizamos encriptación de extremo a extremo para todos los datos sensibles y seguimos las mejores prácticas de la industria para proteger su información, de acuerdo con la Ley 172-13 de Protección de Datos Personales.'
    },
    {
        question: '¿Qué reportes puedo generar con NominaDO?',
        answer: 'Puedes generar con un solo clic los archivos de cumplimiento en el formato exacto que requieren las instituciones: Archivo de Autodeterminación (.txt) para la TSS, Reporte IR-3 para la DGII, y Formularios DGT-3 y DGT-4 (PDF) para el Ministerio de Trabajo, además de reportes de gestión interna.'
    },
    {
        question: '¿La plataforma realiza los pagos a los empleados directamente?',
        answer: 'NominaDO no realiza transferencias bancarias directas. Sin embargo, genera el archivo de dispersión de pagos en el formato específico de los principales bancos del país (Banreservas, Popular, BHD, etc.) para que puedas subirlo a tu portal bancario y ejecutar los pagos masivos de forma rápida y sin errores.'
    }
];

const FaqItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-5 focus:outline-none"
            >
                <h3 className="text-lg font-semibold text-primary">{faq.question}</h3>
                <ChevronDown className={`w-6 h-6 text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <p className="pb-5 text-gray-600">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ setAuthView }) => {
  const [profesionalLevel, setProfesionalLevel] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const selectedProfesionalPlan = profesionalPlanData.find(p => p.level === profesionalLevel)!;

  useEffect(() => {
    if (typeof Chart === 'undefined') return;

    const chartInstances: any[] = [];
    
    const tooltipTitleCallback = (tooltipItems: any) => {
        const item = tooltipItems[0];
        let label = item.chart.data.labels[item.dataIndex];
        if (Array.isArray(label)) {
            return label.join(' ');
        }
        return label;
    };

    const sharedChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#0A2540',
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    title: tooltipTitleCallback
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#0A2540' },
                grid: { color: '#E0E0E0' }
            },
            x: {
                ticks: { color: '#0A2540' },
                grid: { display: false }
            }
        }
    };
    
    const employeeTypeCtx = document.getElementById('employeeTypeChart');
    if (employeeTypeCtx) {
        chartInstances.push(new Chart((employeeTypeCtx as HTMLCanvasElement).getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Empleados Dominicanos', 'Empleados Extranjeros'],
                datasets: [{
                    label: 'Tipo de Empleado',
                    data: [85, 15],
                    backgroundColor: ['#0A2540', '#2ECC71'],
                    borderColor: '#FFFFFF',
                    borderWidth: 4
                }]
            },
            options: {
                ...sharedChartOptions,
                scales: { y: { display: false }, x: { display: false } }
            }
        }));
    }

    const payrollCostCtx = document.getElementById('payrollCostChart');
    if (payrollCostCtx) {
        chartInstances.push(new Chart((payrollCostCtx as HTMLCanvasElement).getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'],
                datasets: [{
                    label: 'Costo Total de Nómina (DOP)',
                    data: [1200000, 1250000, 1300000, 1280000, 1350000, 1400000],
                    borderColor: '#2ECC71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: sharedChartOptions
        }));
    }

    const paymentCycleCtx = document.getElementById('paymentCycleChart');
    if (paymentCycleCtx) {
        chartInstances.push(new Chart((paymentCycleCtx as HTMLCanvasElement).getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Pago Quincenal', 'Pago Mensual', 'Pago Semanal'],
                datasets: [{
                    label: '% de Empresas por Ciclo de Pago',
                    data: [78, 20, 2],
                    backgroundColor: ['#0A2540', '#2ECC71', '#F39C12'],
                    borderRadius: 5
                }]
            },
            options: {
                 ...sharedChartOptions,
                 plugins: {
                     ...sharedChartOptions.plugins,
                     legend: { display: false }
                 }
            }
        }));
    }
    
    const kpiRadarCtx = document.getElementById('kpiRadarChart');
    if (kpiRadarCtx) {
        chartInstances.push(new Chart((kpiRadarCtx as HTMLCanvasElement).getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Precisión de Cálculos', 'Eficiencia (Tiempo)', 'Cumplimiento Legal', 'Satisfacción del Empleado', 'Acceso a Datos'],
                datasets: [
                    {
                        label: 'Gestión Manual',
                        data: [6, 4, 5, 5, 3],
                        borderColor: '#F39C12',
                        backgroundColor: 'rgba(243, 156, 18, 0.2)',
                    },
                    {
                        label: 'Con NominaDO',
                        data: [10, 9, 10, 8, 9],
                        borderColor: '#2ECC71',
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    }
                ]
            },
            options: {
                ...sharedChartOptions,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.3)' },
                        grid: { color: 'rgba(255, 255, 255, 0.3)' },
                        pointLabels: { 
                            color: '#FFFFFF',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#FFFFFF',
                            backdropColor: 'transparent',
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                     ...sharedChartOptions.plugins,
                     legend: {
                         labels: { color: '#FFFFFF' }
                     }
                }
            }
        }));
    }

    return () => {
        chartInstances.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <div className="bg-light font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HandCoins className="w-8 h-8 text-secondary" />
            <h1 className="text-2xl font-heading font-bold ml-2 text-primary">Nomina<span className="text-secondary">DO</span></h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition">Características</a>
            <a href="#precios" className="text-gray-600 hover:text-primary transition">Precios</a>
            <a href="#faq" className="text-gray-600 hover:text-primary transition">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={() => setAuthView(AuthView.LOGIN)} className="text-primary font-semibold hover:text-secondary transition">
              Iniciar Sesión
            </button>
            <button onClick={() => setAuthView(AuthView.REGISTER)} className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
              Registrarse
            </button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="text-center pt-32 pb-16">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-primary">Nomina<span className="text-secondary">DO</span></h1>
            <p className="mt-4 text-xl max-w-2xl mx-auto text-gray-700">Tu nómina, sin complicaciones. La plataforma fintech que automatiza y simplifica la gestión de pagos en la República Dominicana.</p>
             <button onClick={() => setAuthView(AuthView.REGISTER)} className="group mt-10 bg-primary text-white font-bold text-lg py-4 px-8 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg inline-flex items-center">
              Comenzar Ahora <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </section>

        {/* Existing Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary">Todo lo que necesitas, en un solo lugar</h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Desde el onboarding hasta los reportes de la DGII, te tenemos cubierto.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<DollarSign className="w-6 h-6 text-secondary"/>}
                title="Cálculo Automatizado"
                description="Calcula salarios, TSS (SFS, AFP) e ISR sin errores y aplicando los topes vigentes automáticamente."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6 text-secondary"/>}
                title="Gestión de Empleados"
                description="Centraliza la información de tus empleados, incluyendo un módulo especial para extranjeros."
              />
              <FeatureCard 
                icon={<FileText className="w-6 h-6 text-secondary"/>}
                title="Reportes y Cumplimiento"
                description="Genera con un clic los archivos para SUIR+, IR-3, DGT-3 y DGT-4. Siempre al día con la ley."
              />
              <FeatureCard 
                icon={<BarChartBig className="w-6 h-6 text-secondary"/>}
                title="Dashboard Inteligente"
                description="Visualiza KPIs importantes, costos históricos y recibe alertas para nunca olvidar un pago."
              />
               <FeatureCard 
                icon={<HandCoins className="w-6 h-6 text-secondary"/>}
                title="Portal del Empleado"
                description="Permite que tus empleados accedan a sus volantes de pago y soliciten vacaciones en línea."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6 text-secondary"/>}
                title="Seguridad y Confianza"
                description="Tus datos están protegidos con encriptación de nivel bancario. Tu tranquilidad es nuestra prioridad."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary">Planes diseñados para tu empresa</h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Elige el plan que se adapte a tu tamaño y necesidades, sin contratos a largo plazo.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Plan Estándar */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200/80 shadow-sm flex flex-col h-full">
                  <h3 className="font-heading text-2xl font-bold text-primary">Estándar</h3>
                  <p className="text-gray-500 mt-2">Para negocios en crecimiento.</p>
                  <p className="font-heading text-5xl font-bold text-primary my-6">$50<span className="text-xl font-semibold text-gray-500">/mes</span></p>
                  <ul className="space-y-3 text-gray-600 mb-8">
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> 1 Empresa gestionada</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Hasta 20 empleados</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Recibos de nómina digitales</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Soporte por correo electrónico</li>
                  </ul>
                  <button className="mt-auto w-full bg-primary/5 text-primary border-2 border-primary/10 font-bold py-3 px-5 rounded-lg hover:bg-primary/10 transition-all">
                      Elegir Plan
                  </button>
              </div>
              {/* Plan Avanzado */}
              <div className="bg-white p-8 rounded-xl border-2 border-secondary shadow-lg flex flex-col h-full relative">
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</div>
                  <h3 className="font-heading text-2xl font-bold text-primary">Avanzado</h3>
                  <p className="text-gray-500 mt-2">Para empresas con más volumen.</p>
                  <p className="font-heading text-5xl font-bold text-primary my-6">$150<span className="text-xl font-semibold text-gray-500">/mes</span></p>
                  <ul className="space-y-3 text-gray-600 mb-8">
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> 1 Empresa gestionada</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Hasta 50 empleados</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Reportes avanzados</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Roles y permisos de usuario</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Soporte por chat y correo</li>
                  </ul>
                  <button className="mt-auto w-full bg-secondary text-white font-bold py-3 px-5 rounded-lg hover:bg-secondary/90 transition-all">
                      Elegir Plan
                  </button>
              </div>
              {/* Plan Profesional */}
              <div className="bg-primary text-white p-8 rounded-xl shadow-sm flex flex-col h-full lg:col-span-1">
                   <h3 className="font-heading text-2xl font-bold">Profesional</h3>
                   <p className="text-gray-300 mt-2">Para firmas y contadores.</p>
                   <p className="font-heading text-5xl font-bold my-6">${selectedProfesionalPlan.price}<span className="text-xl font-semibold text-gray-400">/mes</span></p>
                   <div className="flex items-center justify-center p-1 bg-white/10 rounded-lg mb-6">
                      <button onClick={() => setProfesionalLevel(1)} className={`px-4 py-1 text-sm font-semibold rounded-md transition-all ${profesionalLevel === 1 ? 'bg-white text-primary shadow' : ''}`}>Nivel 1</button>
                      <button onClick={() => setProfesionalLevel(2)} className={`px-4 py-1 text-sm font-semibold rounded-md transition-all ${profesionalLevel === 2 ? 'bg-white text-primary shadow' : ''}`}>Nivel 2</button>
                      <button onClick={() => setProfesionalLevel(3)} className={`px-4 py-1 text-sm font-semibold rounded-md transition-all ${profesionalLevel === 3 ? 'bg-white text-primary shadow' : ''}`}>Nivel 3</button>
                   </div>
                   <ul className="space-y-3 text-gray-300 mb-8">
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> {selectedProfesionalPlan.companies} empresas</li>
                      <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> Empleados ilimitados</li>
                      {selectedProfesionalPlan.features.map(feature => (
                           <li key={feature} className="flex items-center"><CheckCircle2 className="w-5 h-5 text-secondary mr-2" /> {feature}</li>
                      ))}
                   </ul>
                   <button className="mt-auto w-full bg-white/10 text-white border-2 border-white/20 font-bold py-3 px-5 rounded-lg hover:bg-white/20 transition-all">
                      Elegir Plan
                  </button>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section id="challenge" className="text-center my-16">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-primary">El Desafío de la Nómina Dominicana</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">Calcular la nómina es más que pagar salarios. Implica una compleja red de regulaciones, cálculos precisos y plazos estrictos que consumen tiempo y elevan el riesgo.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="text-accent text-5xl font-bold">40+</div>
                        <h3 className="text-xl font-bold mt-4 text-primary">Horas Mensuales</h3>
                        <p className="mt-2 text-gray-600">Es el tiempo promedio que las pymes invierten en cálculos manuales, revisiones y correcciones de nómina.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="text-accent text-5xl font-bold">75%</div>
                        <h3 className="text-xl font-bold mt-4 text-primary">Riesgo de Errores</h3>
                        <p className="mt-2 text-gray-600">De los cálculos manuales resultan en errores que pueden llevar a pagos incorrectos y sanciones de la TSS y DGII.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="text-accent text-5xl font-bold">2 Leyes</div>
                        <h3 className="text-xl font-bold mt-4 text-primary">Regulaciones Clave</h3>
                        <p className="mt-2 text-gray-600">El Código de Trabajo y la Ley 87-01 de Seguridad Social, con sus constantes actualizaciones, deben ser aplicadas sin fallos.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* New Features with Charts Section */}
        <section id="features-charts" className="my-16">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-primary text-center">Una Solución Integral y Automatizada</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-center text-gray-700">NominaDO centraliza cada aspecto de la nómina en una plataforma inteligente, diseñada para la realidad del mercado dominicano.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 lg:col-span-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-primary mb-4 text-center">Composición de la Plantilla</h3>
                        <p className="text-center mb-4 text-gray-600">Gestiona con la misma facilidad a tu personal local y extranjero.</p>
                        <div className="chart-container h-64 md:h-80"><canvas id="employeeTypeChart"></canvas></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-center">
                         <h3 className="text-2xl font-bold text-primary mb-4 text-center">Evolución del Costo de Nómina</h3>
                         <p className="text-center mb-4 text-gray-600">Visualiza el comportamiento de tu costo laboral total.</p>
                        <div className="chart-container h-64 md:h-80"><canvas id="payrollCostChart"></canvas></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-3 flex flex-col justify-center">
                         <h3 className="text-2xl font-bold text-primary mb-4 text-center">Ciclos de Pago Más Comunes</h3>
                         <p className="text-center mb-4 text-gray-600">Adapta la plataforma a la frecuencia de pago de tu empresa.</p>
                        <div className="chart-container h-64 md:h-80"><canvas id="paymentCycleChart"></canvas></div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Process Section */}
        <section id="process" className="my-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-primary text-center">Procesa tu Nómina en 4 Simples Pasos</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-center text-gray-700">Hemos transformado un proceso largo y tedioso en un flujo de trabajo rápido, intuitivo y a prueba de errores.</p>
                <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
                    <div className="w-full md:w-1/5 bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-2xl font-bold">1</div>
                        <h3 className="text-primary font-bold mt-4">Seleccionar Periodo</h3>
                        <p className="text-sm mt-2 text-gray-600">Elige el ciclo de pago y el rango de fechas.</p>
                    </div>
                    <div className="text-2xl text-secondary font-bold hidden md:block mx-4">→</div>
                     <div className="text-2xl text-secondary font-bold md:hidden my-2">↓</div>
                    <div className="w-full md:w-1/5 bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="bg-secondary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-2xl font-bold">2</div>
                        <h3 className="text-primary font-bold mt-4">Revisar Novedades</h3>
                        <p className="text-sm mt-2 text-gray-600">Añade horas extra, comisiones o ausencias.</p>
                    </div>
                    <div className="text-2xl text-secondary font-bold hidden md:block mx-4">→</div>
                     <div className="text-2xl text-secondary font-bold md:hidden my-2">↓</div>
                    <div className="w-full md:w-1/5 bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-2xl font-bold">3</div>
                        <h3 className="text-primary font-bold mt-4">Previsualizar</h3>
                        <p className="text-sm mt-2 text-gray-600">Revisa el cálculo detallado antes de confirmar.</p>
                    </div>
                    <div className="text-2xl text-secondary font-bold hidden md:block mx-4">→</div>
                     <div className="text-2xl text-secondary font-bold md:hidden my-2">↓</div>
                    <div className="w-full md:w-1/5 bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-2xl font-bold">4</div>
                        <h3 className="text-primary font-bold mt-4">Confirmar y Pagar</h3>
                        <p className="text-sm mt-2 text-gray-600">Aprueba la nómina y genera los archivos de pago.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Advantage Section */}
         <section id="advantage" className="my-16">
            <div className="container mx-auto px-6">
                <div className="bg-primary text-white py-16 px-4 rounded-lg">
                    <h2 className="text-4xl font-bold text-center">El Impacto de NominaDO en tu Gestión</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-center text-gray-300">Mide el antes y el después. NominaDO no solo ahorra tiempo, sino que eleva la precisión a nuevos niveles.</p>
                    <div className="mt-8">
                         <div className="chart-container bg-white/10 rounded-lg p-4">
                            <canvas id="kpiRadarChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                  <h2 className="font-heading text-4xl font-bold text-primary">Amado por empresas en toda la isla</h2>
              </div>
              <div className="grid lg:grid-cols-3 gap-8 text-center">
                  <div className="p-8">
                      <img src="https://picsum.photos/id/1027/80/80" alt="Cliente" className="w-20 h-20 rounded-full mx-auto mb-4" />
                      <p className="text-gray-600 italic">"NominaDO nos ahorra 10 horas de trabajo al mes. La generación del archivo para la TSS es mágica."</p>
                      <p className="font-bold text-primary mt-4">- Sofía Valdéz, Gerente de RRHH en CaribeTech</p>
                  </div>
                   <div className="p-8">
                      <img src="https://picsum.photos/id/1012/80/80" alt="Cliente" className="w-20 h-20 rounded-full mx-auto mb-4" />
                      <p className="text-gray-600 italic">"Implementarlo fue increíblemente fácil. Ahora tengo control total y visibilidad de mi costo laboral."</p>
                      <p className="font-bold text-primary mt-4">- Carlos Méndez, CEO de Quisqueya Soluciones</p>
                  </div>
                   <div className="p-8">
                      <img src="https://picsum.photos/id/1005/80/80" alt="Cliente" className="w-20 h-20 rounded-full mx-auto mb-4" />
                      <p className="text-gray-600 italic">"La mejor inversión que hemos hecho. El soporte es rápido y entienden perfectamente la ley dominicana."</p>
                      <p className="font-bold text-primary mt-4">- Luis Rojas, Dueño de Constructora del Este</p>
                  </div>
              </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-4xl font-bold text-primary">Preguntas Frecuentes</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Respuestas rápidas a las dudas más comunes. Para más detalles, visita nuestra sección completa de FAQ.</p>
                </div>
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border">
                {topFaqs.map((faq, index) => (
                    <FaqItem
                    key={index}
                    faq={faq}
                    isOpen={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    />
                ))}
                </div>
                <div className="text-center mt-8">
                <button onClick={() => setAuthView(AuthView.FAQ)} className="group font-semibold text-secondary hover:underline inline-flex items-center">
                    Ver todas las preguntas <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"/>
                </button>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="relative bg-primary text-white p-12 rounded-2xl shadow-xl text-center overflow-hidden">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/20 rounded-full" />
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-32 h-32 bg-accent/20 rounded-full" />
                <div className="relative z-10">
                    <h2 className="font-heading text-4xl font-bold">¿Listo para simplificar tu nómina?</h2>
                    <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">Únete a cientos de empresas que ya confían en NominaDO.</p>
                     <button onClick={() => setAuthView(AuthView.REGISTER)} className="group mt-8 bg-secondary text-white font-bold text-lg py-4 px-8 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg inline-flex items-center">
                      Crea tu cuenta gratis <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-white">
        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="col-span-full lg:col-span-1">
                    <div className="flex items-center">
                        <HandCoins className="w-8 h-8 text-secondary" />
                        <h1 className="text-2xl font-heading font-bold ml-2">Nomina<span className="text-secondary">DO</span></h1>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm">Simplificando la nómina en la República Dominicana.</p>
                </div>
                <div>
                    <h3 className="font-heading font-semibold text-white uppercase tracking-wider text-sm">Producto</h3>
                    <ul className="mt-4 space-y-3">
                        <li><a href="#features" className="text-gray-400 hover:text-white transition text-sm">Características</a></li>
                        <li><a href="#precios" className="text-gray-400 hover:text-white transition text-sm">Precios</a></li>
                        <li><button onClick={() => setAuthView(AuthView.FAQ)} className="text-gray-400 hover:text-white transition text-sm text-left">Preguntas Frecuentes</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-heading font-semibold text-white uppercase tracking-wider text-sm">Empresa</h3>
                    <ul className="mt-4 space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Sobre Nosotros</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-heading font-semibold text-white uppercase tracking-wider text-sm">Legal</h3>
                    <ul className="mt-4 space-y-3">
                        <li><button onClick={() => setAuthView(AuthView.PRIVACY)} className="text-gray-400 hover:text-white transition text-sm text-left">Política de Privacidad</button></li>
                        <li><button onClick={() => setAuthView(AuthView.TERMS)} className="text-gray-400 hover:text-white transition text-sm text-left">Términos de Servicio</button></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} NominaDO. Todos los derechos reservados.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;