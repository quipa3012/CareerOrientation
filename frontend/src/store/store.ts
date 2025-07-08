import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../modules/auth/stores/AuthSlice"
import { setAuth, clearAuth } from "../modules/auth/stores/AuthSlice"
import { setupInterceptors } from "../axios/setupInterceptors"
import { authService } from "../modules/auth/services/AuthService"

const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})

setupInterceptors(store);

// ✅ Khi reload trang, nếu chưa có accessToken thì refresh
(async () => {
    try {
        const { accesstoken } = await authService.refresh();
        store.dispatch(setAuth({ accessToken: accesstoken }));
    } catch (err) {
        store.dispatch(clearAuth());
    }
})();

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch