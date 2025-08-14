import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DocumentManagerService } from "../services/DocumentManagerService";
import type {
    DocumentResponse,
    DocumentCreateRequest,
    DocumentSearchParams,
} from "../interfaces/DocumentManagerInterface";

interface DocumentState {
    documents: DocumentResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: DocumentState = {
    documents: [],
    loading: false,
    error: null,
};

export const fetchAllDocuments = createAsyncThunk(
    "documents/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await DocumentManagerService.getAllDocuments();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải tài liệu");
        }
    }
);

export const searchDocuments = createAsyncThunk(
    "documents/search",
    async (params: DocumentSearchParams, { rejectWithValue }) => {
        try {
            return await DocumentManagerService.searchDocuments(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tìm kiếm tài liệu");
        }
    }
);

export const uploadDocument = createAsyncThunk(
    "documents/upload",
    async (payload: DocumentCreateRequest, { rejectWithValue }) => {
        try {
            return await DocumentManagerService.uploadDocument(payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi upload tài liệu");
        }
    }
);

export const deleteDocument = createAsyncThunk(
    "documents/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await DocumentManagerService.deleteDocument(id);
            return id; // trả về ID để xóa khỏi state
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa tài liệu");
        }
    }
);

const documentSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllDocuments.fulfilled, (state, action: PayloadAction<DocumentResponse[]>) => {
            state.loading = false;
            state.documents = action.payload;
        });
        builder.addCase(fetchAllDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(searchDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(searchDocuments.fulfilled, (state, action: PayloadAction<DocumentResponse[]>) => {
            state.loading = false;
            state.documents = action.payload;
        });
        builder.addCase(searchDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(uploadDocument.fulfilled, (state, action: PayloadAction<DocumentResponse>) => {
            state.documents.push(action.payload);
        });

        builder.addCase(deleteDocument.fulfilled, (state, action: PayloadAction<number>) => {
            state.documents = state.documents.filter((doc) => doc.id !== action.payload);
        });
    },
});

export default documentSlice.reducer;
