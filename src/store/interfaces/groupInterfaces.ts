export interface Group {
    id: string;
    name: string;
    description: string;
}

export interface GroupState {
    group: Group | null;
    isLoading: boolean;
    error: string | null;
}

export interface GroupFormData {
    name: string;
    description: string;
}

