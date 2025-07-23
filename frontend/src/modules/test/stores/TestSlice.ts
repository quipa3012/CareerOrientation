import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Question, TestResult, SubmitTestRequest } from "../interfaces/TestInterfaces";
import { TestService } from "../services/TestService";

interface TestState {
    questions: Question[];
    currentResult: TestResult | null;
    loading: boolean;
    error: string | null;
}

const initialState: TestState = {
    questions: [],
    currentResult: null,
    loading: false,
    error: null
};

/**
 * Async thunks
 */
export const fetchQuestions = createAsyncThunk(
    "test/fetchQuestions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await TestService.getQuestions();
            return res;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch questions");
        }
    }
);


export const submitTest = createAsyncThunk(
    "test/submitTest",
    async (payload: { userId: number; request: SubmitTestRequest }, { rejectWithValue }) => {
        try {
            return await TestService.submitTest(payload.userId, payload.request);
        } catch (error) {
            return rejectWithValue("Failed to submit test");
        }
    }
);

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        clearQuestions(state) {
            state.questions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(submitTest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentResult = null;
            })
            .addCase(submitTest.fulfilled, (state, action) => {
                state.loading = false;
                state.currentResult = action.payload;
            })
            .addCase(submitTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearQuestions } = testSlice.actions
export default testSlice.reducer;
