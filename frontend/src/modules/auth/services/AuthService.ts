import axiosClient from '../../../axios/AxiosClient';
import type { LoginPayload, LoginResponse, RefreshRespondse, LogoutPayload } from "../interfaces/AuthInterface";

export const authService = {
    login: (payload: LoginPayload): Promise<LoginResponse> => {
        return axiosClient.post("/auth/login", payload).then((res) => res.data.data);
    },
    refresh: async (): Promise<RefreshRespondse> => {
        try {
            const res = await axiosClient.post("/auth/refresh-token", {}, { withCredentials: true });
            return res.data.data;
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.data?.message === "COOKIE_NOT_FOUND") {
                console.warn("❌ Không có refresh-token hoặc token không hợp lệ");
                throw new Error("NO_REFRESH_TOKEN");
            }
            throw error;
        }
    },
    logout: (payload: LogoutPayload): Promise<void> => {
        return axiosClient.post("/auth/logout", payload).then(() => { });
    },
};
