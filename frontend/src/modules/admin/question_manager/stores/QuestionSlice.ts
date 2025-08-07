import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Question } from "../interfaces/QuestionInterface";
import { QuestionService } from "../services/QuestionService";

interface QuestionState {
    questions: Question[];
    loading: boolean;
    error: string | null;
}

const initialState: QuestionState = {
    questions: [],
    loading: false,
    error: null,
};

export const fetchQuestions = createAsyncThunk(
    "questions/fetchAll",
    async (_, thunkAPI) => {
        try {
            return await QuestionService.getAll();
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || "Failed to fetch questions");
        }
    }
);

export const updateQuestion = createAsyncThunk(
    "questions/update",
    async (
        { id, content }: { id: number; content: string },
        thunkAPI
    ) => {
        try {
            const updated = await QuestionService.update(id, content);
            return updated;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || "Failed to update question");
        }
    }
);


const questionSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
                state.questions = action.payload;
                state.loading = false;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
                const index = state.questions.findIndex(q => q.id === action.payload.id);
                if (index !== -1) {
                    state.questions[index] = action.payload;
                }
            });
    },
});

export default questionSlice.reducer;
