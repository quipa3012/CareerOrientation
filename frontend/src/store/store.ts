import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../modules/auth/stores/AuthSlice"
import userReducer from "../modules/user/stores/UserSlice"
import { setAuth, clearAuth } from "../modules/auth/stores/AuthSlice"
import { setupInterceptors } from "../axios/setupInterceptors"
import { AuthService } from "../modules/auth/services/AuthService"
import { fetchCurrentUser, clearCurrentUser } from "../modules/user/stores/UserSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    }
})

setupInterceptors(store);

(async () => {
    try {
        // 🔥 Gọi API refresh lấy accessToken và role
        const { accesstoken, role } = await AuthService.refresh();

        // ✅ Set token vào AuthSlice
        store.dispatch(setAuth({
            accessToken: accesstoken,
            authenticated: true,
            role: role,
        }));

        // ✅ Set thông tin user vào UserSlice
        store.dispatch(fetchCurrentUser());
    } catch (err) {
        // ❌ Nếu lỗi thì clear hết
        store.dispatch(clearAuth());
        store.dispatch(clearCurrentUser());
    }
})();


export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch