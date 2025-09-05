
import React, { useState } from 'react';
import Card from './Card';
import ReportModal from './ReportModal';
import { Download, Building, Briefcase } from './icons';
import { Employee } from '../types';

type ReportType = 'TSS' | 'DGII' | 'DGT3' | 'DGT4';

interface ReportInfo {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  agency: string;
}

const reportTypes: ReportInfo[] = [
  { type: 'TSS', title: 'Autodeterminación (SUIR+)', description: 'Genera el archivo de autodeterminación mensual para la Tesorería de la Seguridad Social.', agency: 'TSS', icon: <Building className="w-8 h-8 text-secondary" /> },
  { type: 'DGII', title: 'Retenciones Asalariados (IR-3)', description: 'Planilla de retenciones de Impuesto Sobre la Renta para la DGII.', agency: 'DGII', icon: <Building className="w-8 h-8 text-secondary" /> },
  { type: 'DGT3', title: 'Planilla Personal Fijo (DGT-3)', description: 'Reporte anual de la planilla de todo el personal fijo de la empresa.', agency: 'Ministerio de Trabajo', icon: <Briefcase className="w-8 h-8 text-secondary" /> },
  { type: 'DGT4', title: 'Cambios en Personal (DGT-4)', description: 'Reporte de altas y bajas de empleados ocurridas durante el mes.', agency: 'Ministerio de Trabajo', icon: <Briefcase className="w-8 h-8 text-secondary" /> },
];

// Fix: Add props interface to accept employees data
interface ReportsProps {
  employees: Employee[];
}

// Fix: Use ReportsProps and destructure employees from props
const Reports: React.FC<ReportsProps> = ({ employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportInfo | null>(null);

  const handleGenerateReport = (report: ReportInfo) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  // Fix: Use employees prop instead of MOCK_EMPLOYEES
  const generateMockData = (type: ReportType) => {
    switch (type) {
      case 'TSS':
        return employees.map(e => ({ RNC_CEDULA: e.identifier, NOMBRES_APELLIDOS: e.name, SALARIO_COTIZABLE_SFS: e.salary, SALARIO_COTIZABLE_AFP: e.salary }));
      case 'DGII':
        return employees.map(e => ({ 'Cédula/RNC': e.identifier, 'Nombre y Apellido': e.name, 'Salario Anual': e.salary * 12, 'Retención Anual': (e.salary * 12) * 0.1 })); // Simplified
      case 'DGT3':
      case 'DGT4':
        return employees.map(e => ({ Cédula: e.identifier, Nombre: e.name, Posición: e.position, Salario: e.salary, 'Fecha de Inicio': '2023-01-01' }));
      default:
        return [];
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Reportes y Cumplimiento</h1>
      <p className="text-gray-500 mt-1">Genera los reportes de ley con un solo clic.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {reportTypes.map((report) => (
          <Card key={report.type} className="flex flex-col">
            <div className="flex items-start">
              <div className="p-3 bg-secondary/10 rounded-lg mr-4">
                {report.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">{report.agency}</p>
                <h2 className="font-heading text-xl font-bold text-primary mt-1">{report.title}</h2>
              </div>
            </div>
            <p className="text-gray-600 mt-4 flex-grow">{report.description}</p>
            <div className="mt-6 text-right">
              <button
                onClick={() => handleGenerateReport(report)}
                className="flex items-center justify-center ml-auto bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm"
              >
                <Download className="w-5 h-5 mr-2" />
                Generar Reporte
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          report={{ title: selectedReport.title, data: generateMockData(selectedReport.type) }}
        />
      )}
    </div>
  );
};

export default Reports;