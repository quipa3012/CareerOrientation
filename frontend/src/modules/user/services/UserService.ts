import axiosClient from "../../../axios/AxiosClient";
import type { UserInfo } from "../interfaces/UserInterface";

export const userService = {
    getProfile: async (): Promise<UserInfo> => {
        const res = await axiosClient.get("/users/me");
        return res.data.data as UserInfo;
    },
};
