import type { UserResponse } from "./userInterfaces";

export interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    postId?: string;
    answerId?: string;
    parentId?: string
    postTitle?: string;
    answerTitle?: string;
    status: 'approved' | 'pending' | 'spam';
    has_replies: boolean;
    createdAt: Date;
}

export interface CommentCreateDto {
    content: string;
    postId?: string;
    answerId?: string;
    parentId?: string;
}

export interface CommentUpdateDto {
    content?: string;
    status?: 'approved' | 'pending' | 'rejected';
}

export interface CommentResponse {
    id: string;
    content: string;
    author: UserResponse;
    postId?: string;
    answerId?: string;
    parentId?: string;
    postTitle?: string;
    parentTitle?: string;
    answerTitle?: string;
    status: 'approved' | 'pending' | 'spam';
    has_replies: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentListResponse {
    comments: CommentResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}