import axiosClient from "./AxiosClient";
import { setAuth, clearAuth } from "../modules/auth/stores/AuthSlice";
import { AuthService } from "../modules/auth/services/AuthService";
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
            const token = store.getState().auth.accessToken;

            if (token && !config.url?.includes("/auth/refresh-token")) {
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

            if (originalRequest.url.includes("/auth/refresh-token")) {
                store.dispatch(clearAuth());
                if (window.location.pathname !== "/") {
                    window.location.replace("/");
                }
                return Promise.reject(error);
            }

            if (
                error.response?.status === 401 &&
                !originalRequest._retry
            ) {
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

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const { accesstoken: newAccessToken, role } = await AuthService.refresh();

                    store.dispatch(setAuth({ accessToken: newAccessToken, authenticated: true, role }));

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);

                    return axiosClient(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    store.dispatch(clearAuth());
                    if (window.location.pathname !== "/") {
                        window.location.replace("/");
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

