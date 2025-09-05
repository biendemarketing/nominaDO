
import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, Employee } from '../types';
import { Trash2 } from './icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id'>) => void;
  onDelete: (taskId: string) => void;
  taskToEdit: Task | null;
  employees: Employee[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, taskToEdit, employees }) => {
  const initialState = {
    title: '',
    category: 'Gestión',
    assigneeId: employees.length > 0 ? employees[0].id : '',
    dueDate: new Date().toISOString().split('T')[0],
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
  };
  
  const [formData, setFormData] = useState(initialState);
  
  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    } else {
      setFormData(initialState);
    }
  }, [taskToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleDelete = () => {
    if (taskToEdit && window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      onDelete(taskToEdit.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="font-heading text-2xl font-bold text-primary">{taskToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-600">Título</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assigneeId" className="block text-sm font-semibold mb-2 text-gray-600">Asignar a</label>
                  <select id="assigneeId" name="assigneeId" value={formData.assigneeId} onChange={handleChange} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-semibold mb-2 text-gray-600">Fecha de Vencimiento</label>
                  <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold mb-2 text-gray-600">Prioridad</label>
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-600">Categoría</label>
                  <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 bg-light border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                </div>
            </div>
          </div>
          <div className="p-6 bg-light flex justify-between items-center rounded-b-xl">
            <div>
              {taskToEdit && (
                <button type="button" onClick={handleDelete} className="flex items-center text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-all">
                    <Trash2 className="w-5 h-5 mr-2" /> Eliminar
                </button>
              )}
            </div>
            <div className="space-x-3">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all">
                Cancelar
              </button>
              <button type="submit" className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all shadow-sm">
                Guardar Tarea
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
