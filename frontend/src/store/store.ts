import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../modules/auth/stores/AuthSlice"
import userReducer from "../modules/user/stores/UserSlice"
import testReducer from "../modules/test/stores/TestSlice"
import majorReducer from "../modules/major/stores/MajorSlice"
import userManagerReducer from "../modules/admin/user_manager/stores/UserManagerSlice"
import majorManagerReducer from "../modules/admin/major_manager/stores/MajorManagerSlice"
import questionReducer from "../modules/admin/question_manager/stores/QuestionSlice";
import classManagerReducer from "../modules/teacher/class/stores/ClassManagerSlice"
import classReducer from "../modules/class/stores/ClassSlice"
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
        major: majorReducer,
        majorManager: majorManagerReducer,
        userManager: userManagerReducer,
        questions: questionReducer,
        classManager: classManagerReducer,
        class: classReducer,
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

        await store.dispatch(fetchCurrentUser());
    } catch (err) {
        store.dispatch(clearAuth());
        store.dispatch(clearCurrentUser());
    }
})();


export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch