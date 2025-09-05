
import React, { useState } from 'react';
import Card from './Card';
import { Building2, Landmark, UserCog, Plug, Users } from './icons';
import { MOCK_COMPANY_PROFILE, MOCK_BANK_ACCOUNTS, MOCK_USER_ROLES } from '../constants';
import { CompanyProfile, BankAccount, UserRole } from '../types';

type SettingsTab = 'profile' | 'banks' | 'roles' | 'integrations';

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 font-semibold text-sm rounded-lg border-l-4 transition-all duration-200 w-full text-left ${
            isActive
                ? 'border-secondary text-primary bg-secondary/10'
                : 'border-transparent text-gray-500 hover:text-primary hover:bg-gray-50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-primary text-md">{value}</p>
    </div>
);

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading text-xl font-bold text-primary">Perfil de la Empresa</h3>
                             <button className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all text-sm">Editar Información</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                           <InfoItem label="Nombre de la Empresa" value={MOCK_COMPANY_PROFILE.name} />
                           <InfoItem label="RNC" value={MOCK_COMPANY_PROFILE.rnc} />
                           <InfoItem label="Dirección" value={MOCK_COMPANY_PROFILE.address} />
                           <InfoItem label="Teléfono" value={MOCK_COMPANY_PROFILE.phone} />
                           <InfoItem label="Correo Electrónico" value={MOCK_COMPANY_PROFILE.email} />
                           <InfoItem label="Sitio Web" value={MOCK_COMPANY_PROFILE.website} />
                        </div>
                    </Card>
                );
            case 'banks':
                 return (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading text-xl font-bold text-primary">Cuentas Bancarias</h3>
                            <button className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all text-sm">Añadir Cuenta</button>
                        </div>
                        <div className="space-y-4">
                            {MOCK_BANK_ACCOUNTS.map(account => (
                                <div key={account.id} className="flex items-center justify-between p-4 bg-light rounded-lg border">
                                    <div className="flex items-center">
                                        <Landmark className="w-8 h-8 text-secondary mr-4" />
                                        <div>
                                            <p className="font-bold text-primary">{account.bankName} {account.isPrimary && <span className="text-xs text-secondary font-semibold ml-2">(Principal)</span>}</p>
                                            <p className="text-gray-600 text-sm">{account.accountNumber} - {account.accountType}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-primary">•••</button>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            case 'roles':
                 return (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-heading text-xl font-bold text-primary">Roles y Permisos</h3>
                            <button className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all text-sm">Crear Rol</button>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-left">
                                <thead><tr className="bg-light"><th className="p-4 text-sm font-semibold text-gray-500 uppercase">Rol</th><th className="p-4 text-sm font-semibold text-gray-500 uppercase">Permisos</th><th className="p-4 text-sm font-semibold text-gray-500 uppercase">Usuarios</th><th className="p-4 text-sm font-semibold text-gray-500 uppercase">Acciones</th></tr></thead>
                                <tbody>
                                    {MOCK_USER_ROLES.map(role => (
                                        <tr key={role.id} className="border-b last:border-0">
                                            <td className="p-4 font-bold text-primary">{role.name}</td>
                                            <td className="p-4 text-gray-600 text-sm">{role.permissions.map(p => <span key={p} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs mr-1 mb-1">{p}</span>)}</td>
                                            <td className="p-4 text-gray-600"><div className="flex items-center"><Users className="w-4 h-4 mr-2" />{role.userCount}</div></td>
                                            <td className="p-4"><button className="text-secondary hover:underline font-semibold text-sm">Editar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'integrations':
                 return (
                    <Card>
                         <h3 className="font-heading text-xl font-bold text-primary mb-6">Integraciones</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-light rounded-lg border">
                                <div>
                                    <p className="font-bold text-primary">QuickBooks</p>
                                    <p className="text-xs text-gray-500">Sincroniza tus asientos contables.</p>
                                </div>
                                <button className="font-semibold text-sm border border-gray-300 py-1 px-3 rounded-md hover:bg-gray-200">Conectar</button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-light rounded-lg border">
                                <div>
                                    <p className="font-bold text-primary">Google Calendar</p>
                                    <p className="text-xs text-gray-500">Sincroniza fechas de pago y vacaciones.</p>
                                </div>
                               <button className="font-semibold text-sm border border-gray-300 py-1 px-3 rounded-md hover:bg-gray-200">Conectar</button>
                            </div>
                         </div>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-8">
            <h1 className="font-heading text-3xl font-bold text-primary">Configuración</h1>
            <p className="text-gray-500 mt-1">Administra la configuración de tu cuenta y empresa.</p>

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                <div className="lg:w-1/4">
                    <Card className="p-4">
                        <nav className="flex flex-col space-y-1">
                            <TabButton label="Perfil de la Empresa" icon={<Building2 className="w-5 h-5"/>} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                            <TabButton label="Cuentas Bancarias" icon={<Landmark className="w-5 h-5"/>} isActive={activeTab === 'banks'} onClick={() => setActiveTab('banks')} />
                            <TabButton label="Roles y Permisos" icon={<UserCog className="w-5 h-5"/>} isActive={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />
                            <TabButton label="Integraciones" icon={<Plug className="w-5 h-5"/>} isActive={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
                        </nav>
                    </Card>
                </div>
                <div className="lg:w-3/4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;