import React, { useMemo } from 'react';
import Card from './Card';
import { MOCK_HOLIDAYS } from '../constants';
import { Employee } from '../types';
import { Cake, CalendarDays } from './icons';

interface CalendarProps {
    employees: Employee[];
}

const Calendar: React.FC<CalendarProps> = ({ employees }) => {
    
    const birthdaysThisYear = useMemo(() => {
        const currentYear = new Date().getFullYear();

        return employees
            .map(e => {
                const birthDate = new Date(e.birthDate + 'T00:00:00');
                const birthdayThisYear = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
                return { ...e, birthdayThisYear };
            })
            .sort((a, b) => a.birthdayThisYear.getTime() - b.birthdayThisYear.getTime());
    }, [employees]);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const nextUpcomingHoliday = useMemo(() => {
        return MOCK_HOLIDAYS
            .map(h => ({ ...h, dateObj: new Date(h.date + 'T00:00:00') }))
            .filter(h => h.dateObj >= now)
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];
    }, []);

    const holidaysByMonth = useMemo(() => {
        const grouped: { [key: string]: typeof MOCK_HOLIDAYS } = {};
        const currentYear = new Date().getFullYear();
        
        MOCK_HOLIDAYS.forEach(h => {
            if (new Date(h.date).getFullYear() === currentYear) {
                const monthName = new Date(h.date + 'T00:00:00').toLocaleDateString('es-DO', { month: 'long' });
                if (!grouped[monthName]) {
                    grouped[monthName] = [];
                }
                grouped[monthName].push(h);
            }
        });
        
        const monthOrder = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        
        return Object.entries(grouped).sort(([a], [b]) => monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase()));

    }, []);

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Calendario de Eventos</h1>
      <p className="text-gray-500 mt-1">Consulta los cumpleaños y los feriados de todo el año.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
            <div className="flex items-center mb-4">
                <Cake className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-bold font-heading text-primary ml-3">Cumpleaños del Año</h2>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {birthdaysThisYear.length > 0 ? birthdaysThisYear.map(e => (
                    <div key={e.id} className="flex items-center p-3 bg-light rounded-lg">
                        <img src={e.avatarUrl} alt={e.name} className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <p className="font-semibold text-primary">{e.name}</p>
                            <p className="text-sm text-gray-600">
                                {e.birthdayThisYear.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 py-8">No hay empleados registrados para mostrar cumpleaños.</p>
                )}
            </div>
        </Card>
        
        <Card>
            <div className="flex items-center mb-4">
                <CalendarDays className="w-6 h-6 text-secondary" />
                <h2 className="text-xl font-bold font-heading text-primary ml-3">Días Feriados del Año {new Date().getFullYear()}</h2>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {holidaysByMonth.map(([month, holidays]) => (
                    <div key={month}>
                        <h3 className="font-semibold text-primary capitalize border-b pb-2 mb-2">{month}</h3>
                        <div className="space-y-2">
                            {holidays.map(h => {
                                const holidayDate = new Date(h.date + 'T00:00:00');
                                const isPast = holidayDate < now;
                                const isNextUpcoming = nextUpcomingHoliday && holidayDate.getTime() === nextUpcomingHoliday.dateObj.getTime();
                                
                                const itemClasses = [
                                    "flex items-center text-sm p-2 rounded-md transition-all",
                                    isPast ? "text-gray-400 line-through" : "text-gray-700",
                                    isNextUpcoming ? "bg-secondary/10 border-l-4 border-secondary font-semibold" : ""
                                ].join(' ');

                                return (
                                    <div key={h.date} className={itemClasses}>
                                        <span className={`font-bold w-8 ${isNextUpcoming ? 'text-secondary' : 'text-primary'}`}>
                                            {holidayDate.getDate()}
                                        </span>
                                        <span>{h.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
