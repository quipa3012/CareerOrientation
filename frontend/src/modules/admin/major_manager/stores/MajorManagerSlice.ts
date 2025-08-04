import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MajorManager, MajorManagerRequest } from "../interfaces/MajorManagerInterface";
import { majorManagerService } from "../services/MajorManagerService";

interface MajorManagerState {
    majors: MajorManager[];
    currentMajor: MajorManager | null;
    loading: boolean;
    error: string | null;
}

const initialState: MajorManagerState = {
    majors: [],
    currentMajor: null,
    loading: false,
    error: null,
};

// =================== THUNKS ===================
export const fetchMajors = createAsyncThunk("majors/fetchAll", async () => {
    return await majorManagerService.getAll();
});

export const fetchMajorById = createAsyncThunk("majors/fetchById", async (id: number) => {
    return await majorManagerService.getById(id);
});

export const createMajor = createAsyncThunk(
    "majors/create",
    async (data: MajorManagerRequest, { dispatch }) => {
        const res = await majorManagerService.create(data);
        dispatch(fetchMajors());
        return res;
    }
);

export const fetchMajorsByBlock = createAsyncThunk(
    "majorManager/fetchByBlock",
    async (blockId: number) => {
        const data = await majorManagerService.getByBlock(blockId);
        return data;
    }
);



export const updateMajor = createAsyncThunk(
    "majors/update",
    async ({ id, data }: { id: number; data: MajorManagerRequest }, { dispatch }) => {
        const res = await majorManagerService.update(id, data);
        dispatch(fetchMajors());
        return res;
    }
);

export const deleteMajor = createAsyncThunk("majors/delete", async (id: number, { dispatch }) => {
    await majorManagerService.delete(id);
    dispatch(fetchMajors());
});

// =================== SLICE ===================
const majorManagerSlice = createSlice({
    name: "majorManager",
    initialState,
    reducers: {
        clearCurrentMajor(state) {
            state.currentMajor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMajors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMajors.fulfilled, (state, action: PayloadAction<MajorManager[]>) => {
                state.majors = action.payload;
                state.loading = false;
            })
            .addCase(fetchMajors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Lỗi không xác định";
            })

            .addCase(fetchMajorById.fulfilled, (state, action: PayloadAction<MajorManager>) => {
                state.currentMajor = action.payload;
            })

            .addCase(createMajor.rejected, (state, action) => {
                state.error = action.error.message ?? "Tạo ngành thất bại";
            })

            .addCase(updateMajor.rejected, (state, action) => {
                state.error = action.error.message ?? "Cập nhật ngành thất bại";
            })

            .addCase(deleteMajor.rejected, (state, action) => {
                state.error = action.error.message ?? "Xoá ngành thất bại";
            });
    },
});

export const { clearCurrentMajor } = majorManagerSlice.actions;
export default majorManagerSlice.reducer;
