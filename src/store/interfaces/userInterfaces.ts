export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    // Không lưu trữ mật khẩu ở phía client
}

export interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}
