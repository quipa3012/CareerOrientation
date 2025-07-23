import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../modules/auth/stores/AuthSlice"
import userReducer from "../modules/user/stores/UserSlice"
import testReducer from "../modules/test/stores/TestSlice"
import { fetchQuestions } from "../modules/test/stores/TestSlice"
import { setAuth, clearAuth } from "../modules/auth/stores/AuthSlice"
import { setupInterceptors } from "../axios/setupInterceptors"
import { AuthService } from "../modules/auth/services/AuthService"
import { fetchCurrentUser, clearCurrentUser } from "../modules/user/stores/UserSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        test: testReducer,
    }
})

setupInterceptors(store);

(async () => {
    try {
        await store.dispatch(fetchQuestions());

        const { accesstoken, role } = await AuthService.refresh();

        store.dispatch(setAuth({
            accessToken: accesstoken,
            authenticated: true,
            role: role,
        }));

        store.dispatch(fetchCurrentUser());
    } catch (err) {
        store.dispatch(clearAuth());
        store.dispatch(clearCurrentUser());
    }
})();


export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch