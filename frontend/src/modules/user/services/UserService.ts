import axiosClient from "../../../axios/AxiosClient";
import type { UserInfo, UserRequest, ChangePasswordRequest } from "../interfaces/UserInterface";

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export const UserService = {
    getProfile: async (): Promise<UserInfo> => {
        const res = await axiosClient.get("/users/me");
        return res.data.data as UserInfo;
    },

    getAll: async (): Promise<UserInfo[]> => {
        const res = await axiosClient.get("/users");
        return res.data.data as UserInfo[];
    },

    createUser: async (
        user: UserRequest,
        avatarFile?: File
    ): Promise<UserInfo> => {
        const formData = new FormData();
        formData.append("username", user.username);
        if (user.password) formData.append("password", user.password);
        if (user.fullName) formData.append("fullName", user.fullName);
        if (user.email) formData.append("email", user.email);

        if (avatarFile) {
            if (avatarFile.size > MAX_AVATAR_BYTES) {
                throw new Error("Avatar quá lớn (tối đa 10MB)");
            }
            formData.append("avatar", avatarFile);
        }

        const res = await axiosClient.post("/users", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.data as UserInfo;
    },

    updateUser: async (
        id: number,
        user: UserRequest,
        avatarFile?: File
    ): Promise<UserInfo> => {
        const formData = new FormData();
        if (user.username) formData.append("username", user.username);
        if (user.fullName) formData.append("fullName", user.fullName);
        if (user.email) formData.append("email", user.email);
        if (avatarFile) {
            if (avatarFile.size > MAX_AVATAR_BYTES) {
                throw new Error("Avatar quá lớn (tối đa 2MB)");
            }
            formData.append("avatar", avatarFile);
        }

        const res = await axiosClient.put(`/users/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.data as UserInfo;
    },

    deleteUser: async (id: number): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    },

    changePassword: async (payload: ChangePasswordRequest): Promise<UserInfo> => {
        const res = await axiosClient.put("/users/change-password", payload);
        return res.data.data as UserInfo;
    },

};
