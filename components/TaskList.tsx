
import React, { useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, Employee } from '../types';
import { PlusCircle, Calendar, SignalHigh, SignalMedium, SignalLow, Pencil } from './icons';

interface TaskListProps {
  tasks: Task[];
  employees: Employee[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onOpenTaskModal: (task?: Task | null) => void;
}

const PriorityIndicator: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    switch (priority) {
        case TaskPriority.HIGH:
            return <SignalHigh className="w-4 h-4 text-red-500" />;
        case TaskPriority.MEDIUM:
            return <SignalMedium className="w-4 h-4 text-yellow-500" />;
        case TaskPriority.LOW:
            return <SignalLow className="w-4 h-4 text-blue-500" />;
        default:
            return null;
    }
};

const TaskCard: React.FC<{ task: Task; employee?: Employee; onEdit: () => void; onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void }> = ({ task, employee, onEdit, onDragStart }) => {
    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < new Date() && task.status !== TaskStatus.DONE;

    return (
        <div 
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            onClick={onEdit}
            className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm mb-4 cursor-pointer hover:shadow-md hover:border-secondary/50 transition-all group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold bg-secondary/10 text-secondary px-2 py-1 rounded-full">{task.category}</span>
                 <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-primary"><Pencil className="w-4 h-4"/></button>
            </div>
            <p className="font-semibold text-primary mb-3">{task.title}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                    <PriorityIndicator priority={task.priority} />
                    <span>{task.priority}</span>
                </div>
                 {employee && (
                    <img
                        src={employee.avatarUrl}
                        alt={employee.name}
                        title={`Asignado a: ${employee.name}`}
                        className="w-7 h-7 rounded-full border-2 border-white -mr-2"
                    />
                )}
                <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                    <Calendar className="w-4 h-4"/>
                    <span>{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );
};

const TaskColumn: React.FC<{ title: string; status: TaskStatus; tasks: Task[]; children: React.ReactNode; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void; }> = ({ title, status, tasks, children, onDragOver, onDrop }) => {
    
    const getHeaderStyle = (status: TaskStatus) => {
        switch(status) {
            case TaskStatus.TODO: return "border-t-yellow-400";
            case TaskStatus.IN_PROGRESS: return "border-t-blue-400";
            case TaskStatus.DONE: return "border-t-green-400";
            default: return "border-t-gray-300";
        }
    }

    return (
        <div 
            className="bg-light rounded-lg p-4 h-full"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
        >
            <h2 className={`font-heading text-lg font-bold text-primary mb-4 pb-2 border-b-2 ${getHeaderStyle(status)}`}>
                {title} <span className="text-sm font-medium text-gray-400">{tasks.length}</span>
            </h2>
            <div className="min-h-[200px]">
                {children}
            </div>
        </div>
    );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, employees, setTasks, onOpenTaskModal }) => {
    
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        }
    };

    const columns: { title: string; status: TaskStatus }[] = [
        { title: 'Pendiente', status: TaskStatus.TODO },
        { title: 'En Progreso', status: TaskStatus.IN_PROGRESS },
        { title: 'Completado', status: TaskStatus.DONE },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-primary">Gestión de Tareas</h1>
                    <p className="text-gray-500 mt-1">Organiza, asigna y da seguimiento a todas las tareas pendientes.</p>
                </div>
                <button onClick={() => onOpenTaskModal(null)} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-sm">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Crear Tarea
                </button>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {columns.map(({ title, status }) => (
                    <TaskColumn
                        key={status}
                        title={title}
                        status={status}
                        tasks={tasks.filter(t => t.status === status)}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {tasks.filter(t => t.status === status).map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                employee={employeeMap.get(task.assigneeId)}
                                onEdit={() => onOpenTaskModal(task)}
                                onDragStart={handleDragStart}
                            />
                        ))}
                    </TaskColumn>
                ))}
            </div>
        </div>
    );
};

export default TaskList;