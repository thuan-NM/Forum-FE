import type { User } from './userInterfaces';

export interface Notification {
    id: string;
    type: 'system' | 'user' | 'post' | 'comment' | 'question' | 'answer';
    title: string;
    message: string;
    recipient: User | {
        id:string,
        username:string,
    };
    sender?: User | string;
    relatedId?: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
}

export interface NotificationCreateDto {
    type: 'system' | 'user' | 'post' | 'comment' | 'question' | 'answer';
    title: string;
    message: string;
    recipientId: string;
    senderId?: string;
    relatedId?: string;
}

export interface NotificationUpdateDto {
    isRead?: boolean;
}

export interface NotificationResponse {
    id: string;
    type: 'system' | 'user' | 'post' | 'comment' | 'question' | 'answer';
    title: string;
    message: string;
    recipient: {
        id: string;
        username: string;
        avatar?: string;
    };
    sender?: {
        id: string;
        username: string;
        avatar?: string;
    };
    relatedId?: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationListResponse {
    notifications: NotificationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
}
