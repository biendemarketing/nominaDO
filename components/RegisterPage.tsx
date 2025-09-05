import React from 'react';
import { HandCoins } from './icons';

interface RegisterPageProps {
    onRegister: () => void;
    switchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, switchToLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister();
    };

    return (
        <div className="min-h-screen bg-light flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-8">
                    <HandCoins className="w-10 h-10 text-secondary" />
                    <h1 className="text-3xl font-heading font-bold ml-2 text-primary">Nomina<span className="text-secondary">DO</span></h1>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg p-8">
                    <h2 className="font-heading text-2xl font-bold text-primary text-center">Crea tu Cuenta</h2>
                    <p className="text-gray-500 text-center mt-2 mb-6">Empieza a simplificar tu nómina hoy.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="company" className="block text-sm font-semibold text-gray-600 mb-2">Nombre de la Empresa</label>
                            <input
                                type="text"
                                id="company"
                                placeholder="Tu Empresa SRL"
                                className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition text-gray-900"
                                required
                            />
                        </div>
                         <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tu@empresa.com"
                                className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition text-gray-900"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password"className="block text-sm font-semibold text-gray-600 mb-2">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 transition text-gray-900"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
                            Crear Cuenta
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿Ya tienes una cuenta?{' '}
                        <button onClick={switchToLogin} className="font-semibold text-secondary hover:underline">
                            Inicia Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;