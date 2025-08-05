import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserInfo, UserRequest, ChangePasswordRequest } from "../interfaces/UserInterface";
import { UserService } from "../services/UserService";

interface UserState {
    currentUser: UserInfo | null;
    users: UserInfo[];
    loading: boolean;
    error: string | null;
}


const initialState: UserState = {
    currentUser: null,
    users: [],
    loading: false,
    error: null
};



export const fetchCurrentUser = createAsyncThunk(
    "users/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const user = await UserService.getProfile();
            return user;
        } catch (error: any) {
            return rejectWithValue("Failed to fetch user info");
        }
    }
);


export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
    return await UserService.getAll();
});

export const createUser = createAsyncThunk(
    "users/create",
    async (payload: { user: UserRequest; avatarFile?: File }) => {
        return await UserService.createUser(payload.user, payload.avatarFile);
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async (payload: { id: number; user: UserRequest; avatarFile?: File }) => {
        return await UserService.updateUser(payload.id, payload.user, payload.avatarFile);
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id: number) => {
        await UserService.deleteUser(id);
        return id;
    }
);

export const changePassword = createAsyncThunk<
    UserInfo,
    ChangePasswordRequest,
    { rejectValue: string }
>(
    "users/changePassword",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await UserService.changePassword(payload);
            return res;
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Đổi mật khẩu không thành công";
            return rejectWithValue(msg);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearCurrentUser(state) {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch users";
            })

            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || "Failed to change password";
            });
    }
});

export const { clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
