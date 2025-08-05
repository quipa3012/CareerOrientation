import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, LoginResponse, LogoutPayload } from "../interfaces/AuthInterface";
import { AuthService } from "../services/AuthService";
import { fetchCurrentUser, clearCurrentUser } from "../../user/stores/UserSlice";

const initialState: AuthState = {
    accessToken: null,
    authenticated: false,
    role: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
    "auth/login",
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const data = await AuthService.login(payload);

            await dispatch(fetchCurrentUser());

            return data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Network error");
        }
    }
);

export const logout = createAsyncThunk<void, LogoutPayload>(
    "auth/logout",
    async (token, { rejectWithValue, dispatch }) => {
        try {
            await AuthService.logout(token);

            dispatch(clearCurrentUser());
        } catch (error: any) {
            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Logout failed due to network error");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            state.accessToken = action.payload.accessToken;
            state.authenticated = true;
            state.role = action.payload.role;
        },
        clearAuth(state) {
            state.accessToken = null;
            state.authenticated = false;
            state.role = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.accessToken = action.payload.accesstoken;
                state.authenticated = action.payload.authenticated;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.accessToken = null;
                state.authenticated = false;
                state.role = null;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
