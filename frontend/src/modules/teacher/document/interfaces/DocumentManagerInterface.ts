export interface DocumentResponse {
    id: number;
    title: string;
    description?: string;
    fileUrl: string;
    updatedAt: string;
    updatedBy: string;
}

export interface DocumentCreateRequest {
    title: string;
    description?: string;
    file: File;
    userId: number;
}

export interface DocumentSearchParams {
    keyword?: string;
}

export interface DocumentState {
    documents: DocumentResponse[];
    loading: boolean;
    error?: string;
}
