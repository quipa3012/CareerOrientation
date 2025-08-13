import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StatisticalList } from "../interfaces/StatisticalInterface";
import StatisticalService from "../services/StatisticalService";
import type { Clazz } from "../../class/interfaces/ClassManagerInterface";

interface StatisticalState {
    byClass: StatisticalList;
    byTeacher: { clazz: Clazz; results: StatisticalList }[];
    loading: boolean;
    error: string | null;
}

const initialState: StatisticalState = {
    byClass: [],
    byTeacher: [],
    loading: false,
    error: null,
};

export const fetchStatisticalByClass = createAsyncThunk<
    StatisticalList,
    number,
    { rejectValue: string }
>(
    "statistical/fetchByClass",
    async (clazzId, { rejectWithValue }) => {
        try {
            return await StatisticalService.getByClass(clazzId);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tải dữ liệu thống kê"
            );
        }
    }
);

export const fetchMyClassesStatistical = createAsyncThunk<
    { clazz: Clazz; results: StatisticalList }[],
    void,
    { rejectValue: string }
>(
    "statistical/fetchMyClasses",
    async (_, { rejectWithValue }) => {
        try {
            return await StatisticalService.getMyClassesStatistical();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Không thể tải dữ liệu thống kê"
            );
        }
    }
);

const statisticalSlice = createSlice({
    name: "statistical",
    initialState,
    reducers: {
        clearStatistical(state) {
            state.byClass = [];
            state.byTeacher = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // By class
            .addCase(fetchStatisticalByClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchStatisticalByClass.fulfilled,
                (state, action: PayloadAction<StatisticalList>) => {
                    state.loading = false;
                    state.byClass = action.payload;
                }
            )
            .addCase(fetchStatisticalByClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi không xác định";
            })

            // By teacher
            .addCase(fetchMyClassesStatistical.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchMyClassesStatistical.fulfilled,
                (state, action: PayloadAction<{ clazz: Clazz; results: StatisticalList }[]>) => {
                    state.loading = false;
                    state.byTeacher = action.payload;
                }
            )
            .addCase(fetchMyClassesStatistical.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi không xác định";
            });
    },
});

export const { clearStatistical } = statisticalSlice.actions;
export default statisticalSlice.reducer;
