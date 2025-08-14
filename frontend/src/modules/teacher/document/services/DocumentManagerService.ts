import axiosClient from "../../../../axios/AxiosClient";
import type {
    DocumentResponse,
    DocumentCreateRequest,
    DocumentSearchParams,
} from "../interfaces/DocumentManagerInterface";

const BASE_URL = "/documents";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const DocumentManagerService = {
    getAllDocuments: async (): Promise<DocumentResponse[]> => {
        const res = await axiosClient.get<DocumentResponse[]>(BASE_URL);
        return res.data.map(doc => ({
            ...doc,
            fileUrl: `${BACKEND_URL}${doc.fileUrl}`
        }));
    },

    searchDocuments: async (params: DocumentSearchParams): Promise<DocumentResponse[]> => {
        const res = await axiosClient.get<DocumentResponse[]>(`${BASE_URL}/search`, {
            params,
        });
        return res.data.map(doc => ({
            ...doc,
            fileUrl: `${BACKEND_URL}${doc.fileUrl}`
        }));
    },

    uploadDocument: async (payload: DocumentCreateRequest): Promise<DocumentResponse> => {
        const formData = new FormData();
        formData.append("title", payload.title);
        if (payload.description) {
            formData.append("description", payload.description);
        }
        formData.append("file", payload.file);
        formData.append("userId", String(payload.userId));

        const res = await axiosClient.post<DocumentResponse>(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return {
            ...res.data,
            fileUrl: `${BACKEND_URL}${res.data.fileUrl}`
        };
    },

    deleteDocument: async (id: number): Promise<void> => {
        await axiosClient.delete(`${BASE_URL}/${id}`);
    },

    getDocumentById: async (id: number): Promise<DocumentResponse> => {
        const res = await axiosClient.get<DocumentResponse>(`${BASE_URL}/${id}`);
        return {
            ...res.data,
            fileUrl: `${BACKEND_URL}${res.data.fileUrl}`
        };
    },

    updateDocument: async (
        id: number,
        payload: Partial<DocumentCreateRequest> & { file?: File }
    ): Promise<DocumentResponse> => {
        const formData = new FormData();
        formData.append("title", payload.title || "");
        if (payload.description) {
            formData.append("description", payload.description);
        }
        if (payload.file) {
            formData.append("file", payload.file);
        }
        if (payload.userId !== undefined) {
            formData.append("userId", String(payload.userId));
        }

        const res = await axiosClient.put<DocumentResponse>(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return {
            ...res.data,
            fileUrl: `${BACKEND_URL}${res.data.fileUrl}`
        };
    },
};
