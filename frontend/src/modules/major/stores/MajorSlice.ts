import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Major } from "../interfaces/MajorInterface";
import { majorService } from "../services/MajorService";

interface MajorState {
    majors: Major[];
    selectedMajor: Major | null;
    loading: boolean;
    error: string | null;
}

const initialState: MajorState = {
    majors: [],
    selectedMajor: null,
    loading: false,
    error: null,
};


export const fetchMajors = createAsyncThunk("majors/fetchAll", async () => {
    return await majorService.getAll();
});

export const fetchMajorsByBlock = createAsyncThunk(
    "majors/fetchByBlock",
    async (blockId: number) => {
        return await majorService.getByBlock(blockId);
    }
);

export const fetchMajorById = createAsyncThunk(
    "majors/fetchById",
    async (id: number) => {
        return await majorService.getById(id);
    }
);


const majorSlice = createSlice({
    name: "majors",
    initialState,
    reducers: {
        clearSelectedMajor(state) {
            state.selectedMajor = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMajors.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMajors.fulfilled, (state, action) => {
                state.majors = action.payload;
                state.loading = false;
            })
            .addCase(fetchMajors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Lỗi khi tải danh sách ngành";
            })
            .addCase(fetchMajorsByBlock.fulfilled, (state, action) => {
                state.majors = action.payload;
            })
            .addCase(fetchMajorById.fulfilled, (state, action) => {
                state.selectedMajor = action.payload;
            });
    },
});

export const { clearSelectedMajor } = majorSlice.actions;

export default majorSlice.reducer;
