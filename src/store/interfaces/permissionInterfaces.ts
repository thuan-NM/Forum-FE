export interface Permission {
    id: string;
    role: string; 
    resource: string;
    action: string;
    allowed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    usersCount: number;
    isSystem: boolean; 
    permissions: Permission[];
    createdAt: string; 
}