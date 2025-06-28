import type { User, UserResponse } from './userInterfaces';
import type { Tag, TagResponse } from './tagInterfaces';

export interface Post {
    id: string;
    title: string;
    content: string;
    author: User |{
        id:string,
        username:string
    };
    tags: (Tag |
    {
        id: string
        name: string,
    }
    )[];
    status: 'published' | 'draft' | 'archived';
    viewCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostCreateDto {
    title: string;
    content: string;
    tags: string[];
    status?: 'published' | 'draft' | 'archived';
}

export interface PostUpdateDto {
    title?: string;
    content?: string;
    tags?: string[];
    status?: 'published' | 'draft' | 'archived';
}

export interface PostResponse {
    id: string;
    title:string
    content: string;
    author: UserResponse;
    tags: TagResponse[];
    status: 'approved' | 'pending' | 'rejected';
    ReactionCount: number;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PostListResponse {
    posts: PostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}