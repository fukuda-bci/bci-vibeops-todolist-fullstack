import { Task } from '@/lib/types'; // Need to define types
import { Button } from './ui/button';
import { Trash2, Edit, Calendar } from 'lucide-react';
import { STATUS_LABELS, TASK_STATUSES } from '@/lib/constants';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-blue-600">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="mb-4 text-sm text-gray-800">{task.description}</p>
            {task.due_date && (
                <div className="mb-2 flex items-center text-xs text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    <span>期限: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-700">
                <span>担当者: {task.assignee_details?.name || '未割り当て'}</span>
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    className="rounded border bg-gray-50 px-2 py-1"
                >
                    {TASK_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
