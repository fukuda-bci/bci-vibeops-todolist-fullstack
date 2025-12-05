'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { STATUS_LABELS } from '@/lib/constants';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members/');
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await api.post('/tasks/', data);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingTask) return;
    try {
      await api.patch(`/tasks/${editingTask.id}/`, data);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当によろしいですか？')) return;
    try {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(`/tasks/${id}/`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  // Removed handleLogout

  const filteredTasks = tasks.filter(task => {
    let statusMatch = true;
    if (filter === 'OVERDUE') {
      const now = new Date();
      const dueDate = task.due_date ? new Date(task.due_date) : null;
      // Check if due date is in the past and status is not DONE
      // We compare timestamps to be safe, or just use < now
      statusMatch = dueDate !== null && dueDate < now && task.status !== 'DONE';
    } else {
      statusMatch = filter === 'ALL' || task.status === filter;
    }

    const assigneeMatch = assigneeFilter === 'ALL' || (task.assignee && task.assignee.toString() === assigneeFilter);
    return statusMatch && assigneeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">タスク管理</h1>
          <Link href="/members">
            <Button variant="outline">
              メンバー管理
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2">
            {Object.keys(STATUS_LABELS).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${filter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100'
                  }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="rounded-md border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="ALL">すべての担当者</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> 新規タスク
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="mt-12 text-center text-gray-600">
            タスクが見つかりません。新しいタスクを作成しましょう！
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        initialData={editingTask}
      />
    </div>
  );
}
