export interface Post {
    id: string;
    content: string;
    status: string;
}

export interface PostState {
    post: Post | null;
    isLoading: boolean;
    error: string | null;
}

export interface PostFormData {
    content: string;
    status: string;
    group_id: string;
}

export interface PostItemProp {
    post_id: number;  // API trả về post_id, không phải id
    content: string;
    status: string;
    group_id: number;
    user_id: number;
    created_at: string;  // API trả về string, không phải Date
    updated_at: string;
}

