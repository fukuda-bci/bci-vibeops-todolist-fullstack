'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function MembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/members/', { name: newName, email: newEmail });
            setNewName('');
            setNewEmail('');
            fetchMembers();
        } catch (error) {
            console.error('Failed to create member', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            await api.delete(`/members/${id}/`);
            fetchMembers();
        } catch (error) {
            console.error('Failed to delete member', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center">
                    <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold">メンバー管理</h1>
                </div>

                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">新規メンバー登録</h2>
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <Input
                            placeholder="名前"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            className="flex-1"
                        />
                        <Input
                            placeholder="メールアドレス (任意)"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">追加</Button>
                    </form>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">メンバー一覧</h2>
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-700">{member.email}</p>
                                </div>
                                <button onClick={() => handleDelete(member.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        {members.length === 0 && (
                            <p className="text-center text-gray-500">メンバーがいません。</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
