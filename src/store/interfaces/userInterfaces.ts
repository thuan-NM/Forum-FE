export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at: Date
}

export interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}
