export interface Member {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assignee: number | null;
    assignee_details: Member | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}
