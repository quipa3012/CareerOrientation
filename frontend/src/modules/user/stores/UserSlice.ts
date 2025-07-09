import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserInfo, UserRequest } from "../interfaces/UserInterface";
import { UserService } from "../services/UserService";

interface UserState {
    currentUser: UserInfo | null; // 🆕 user đang login
    users: UserInfo[];
    loading: boolean;
    error: string | null;
}


const initialState: UserState = {
    currentUser: null, // 🆕 user đang login
    users: [],
    loading: false,
    error: null
};

/**
 * Async thunks
 */

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
    return await UserService.getAll(); // Cần viết API getAll ở userService
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
        await UserService.deleteUser(id); // Cần viết API delete ở userService
        return id;
    }
);

/**
 * Slice
 */
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
            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload; // 🆕 lưu current user
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch users
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

            // Create user
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            // Update user
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            });
    }
});

export const { clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
