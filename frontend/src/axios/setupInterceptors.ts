import axiosClient from "./AxiosClient";
import { setAuth, clearAuth } from "../modules/auth/stores/AuthSlice";
import { authService } from "../modules/auth/services/AuthService";
import type { Store } from "@reduxjs/toolkit";

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = (store: Store) => {
    axiosClient.interceptors.request.use(
        (config) => {
            // ✅ Luôn đính kèm accessToken nếu có
            const token = store.getState().auth.accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // ✅ Chỉ xử lý nếu nhận về 401 và chưa retry
            if (
                error.response?.status === 401 &&
                !originalRequest._retry
            ) {
                // 🔥 Check nếu đang refresh thì xếp hàng đợi
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            return axiosClient(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                // ✅ Đánh dấu request đã retry
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // 🔥 Gọi API refresh token nếu có cookie
                    const { accesstoken: newAccessToken, role: role } = await authService.refresh();
                    console.log("✅ Refresh token thành công");

                    // ✅ Set token mới vào Redux
                    store.dispatch(setAuth({ accessToken: newAccessToken, authenticated: true, role: role }));

                    // ✅ Retry lại request ban đầu
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);

                    return axiosClient(originalRequest);
                } catch (err) {
                    console.warn("❌ Refresh token thất bại, redirect login");
                    processQueue(err, null);
                    store.dispatch(clearAuth());
                    if (window.location.pathname !== "/") {
                        window.location.replace("/"); // Chuyển về trang chủ
                    }
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};
