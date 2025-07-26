import axiosClient from "../../../axios/AxiosClient";
import type { UserInfo, UserRequest } from "../interfaces/UserInterface";

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
        formData.append("password", user.password);
        formData.append("fullName", user.fullName);
        formData.append("email", user.email);

        if (avatarFile) {
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
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("fullName", user.fullName);
        formData.append("email", user.email);

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        const res = await axiosClient.put(`/users/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.data as UserInfo;
    },


    deleteUser: async (id: number): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    }
};
