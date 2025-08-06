import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserResponse, UserRequest } from "../interfaces/UserManagerInterface";
import { UserManagerService } from "../services/UserManagerService";
import type { GenerateTeacherRequest, GeneratedAccountResponse } from "../interfaces/UserManagerInterface";


interface UserManagerState {
    users: UserResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: UserManagerState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchAllUsers = createAsyncThunk(
    "userManager/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await UserManagerService.getAll();
        } catch (err: any) {
            return rejectWithValue("Lỗi khi lấy danh sách người dùng");
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "userManager/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            return await UserManagerService.getById(id);
        } catch (err: any) {
            return rejectWithValue("Không tìm thấy người dùng");
        }
    }
);

export const createUserAdmin = createAsyncThunk(
    "userManager/create",
    async (
        payload: { user: UserRequest; avatarFile?: File },
        { rejectWithValue }
    ) => {
        try {
            return await UserManagerService.create(payload.user, payload.avatarFile);
        } catch (err: any) {
            return rejectWithValue("Tạo người dùng thất bại");
        }
    }
);

export const updateUserAdmin = createAsyncThunk(
    "userManager/update",
    async (
        payload: { id: number; user: Partial<UserRequest>; avatarFile?: File },
        { rejectWithValue }
    ) => {
        try {
            return await UserManagerService.update(payload.id, payload.user, payload.avatarFile);
        } catch (err: any) {
            return rejectWithValue("Cập nhật người dùng thất bại");
        }
    }
);

export const deleteUserAdmin = createAsyncThunk(
    "userManager/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await UserManagerService.delete(id);
            return id;
        } catch (err: any) {
            return rejectWithValue("Xoá người dùng thất bại");
        }
    }
);

export const generateTeacherAccount = createAsyncThunk<
    GeneratedAccountResponse,
    GenerateTeacherRequest,
    { rejectValue: string }
>(
    "userManager/generateTeacherAccount",
    async (payload, { rejectWithValue }) => {
        try {
            return await UserManagerService.generateTeacherAccount(payload);
        } catch (err: any) {
            return rejectWithValue("Tạo tài khoản giáo viên thất bại");
        }
    }
);


const userManagerSlice = createSlice({
    name: "userManager",
    initialState,
    reducers: {
        clearUserManagerError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createUserAdmin.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })

            .addCase(updateUserAdmin.fulfilled, (state, action) => {
                const index = state.users.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })

            .addCase(deleteUserAdmin.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.payload);
            });
    },
});

export const { clearUserManagerError } = userManagerSlice.actions;
export default userManagerSlice.reducer;
