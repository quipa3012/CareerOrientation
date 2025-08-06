import axiosClient from "../../../../axios/AxiosClient";
import type {
    UserRequest,
    UserResponse,
    GenerateTeacherRequest,
    GeneratedAccountResponse,
} from "../interfaces/UserManagerInterface";

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export const UserManagerService = {
    getAll: async (): Promise<UserResponse[]> => {
        const res = await axiosClient.get("/users");
        return res.data.data as UserResponse[];
    },

    getById: async (id: number): Promise<UserResponse> => {
        const res = await axiosClient.get(`/users/${id}`);
        return res.data.data as UserResponse;
    },

    create: async (
        user: UserRequest,
        avatarFile?: File
    ): Promise<UserResponse> => {
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("fullName", user.fullName);
        formData.append("email", user.email);

        if (avatarFile) {
            if (avatarFile.size > MAX_AVATAR_BYTES) {
                throw new Error("Ảnh đại diện vượt quá giới hạn 10MB");
            }
            formData.append("avatar", avatarFile);
        }

        const res = await axiosClient.post("/users", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data as UserResponse;
    },

    update: async (
        id: number,
        user: Partial<UserRequest>,
        avatarFile?: File
    ): Promise<UserResponse> => {
        const formData = new FormData();
        if (user.username) formData.append("username", user.username);
        if (user.password) formData.append("password", user.password);
        if (user.fullName) formData.append("fullName", user.fullName);
        if (user.email) formData.append("email", user.email);

        if (avatarFile) {
            if (avatarFile.size > MAX_AVATAR_BYTES) {
                throw new Error("Ảnh đại diện vượt quá giới hạn 10MB");
            }
            formData.append("avatar", avatarFile);
        }

        const res = await axiosClient.put(`/users/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data as UserResponse;
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    },

    generateTeacherAccount: async (
        payload: GenerateTeacherRequest
    ): Promise<GeneratedAccountResponse> => {
        const res = await axiosClient.post("/users/generate-teacher", payload);
        return res.data as GeneratedAccountResponse;
    },
};
