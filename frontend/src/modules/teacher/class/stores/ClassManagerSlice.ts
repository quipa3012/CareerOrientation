import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Clazz, ClassUser, Announcement } from "../interfaces/ClassManagerInterface";
import { ClassManagerService } from "../services/ClassManagerService";

interface ClassManagerState {
    classes: Clazz[];
    selectedClass: Clazz | null;
    classUsers: ClassUser[];
    announcements: Announcement[];
    loading: boolean;
    error: string | null;
}

const initialState: ClassManagerState = {
    classes: [],
    selectedClass: null,
    classUsers: [],
    announcements: [],
    loading: false,
    error: null,
};


export const fetchAllClasses = createAsyncThunk("classManager/fetchAllClasses", async () => {
    return await ClassManagerService.getAllClasses();
});

export const fetchClassById = createAsyncThunk("classManager/fetchClassById", async (id: number) => {
    return await ClassManagerService.getClassById(id);
});

export const fetchMyClasses = createAsyncThunk(
    "classManager/fetchMyClasses",
    async () => {
        return await ClassManagerService.getMyClasses();
    }
);

export const fetchUsersInClass = createAsyncThunk("classManager/fetchUsersInClass", async (classId: number) => {
    return await ClassManagerService.getUsersInClass(classId);
});

export const fetchAnnouncements = createAsyncThunk("classManager/fetchAnnouncements", async (classId: number) => {
    return await ClassManagerService.getAnnouncementsByClass(classId);
});




const classManagerSlice = createSlice({
    name: "classManager",
    initialState,
    reducers: {
        clearSelectedClass(state) {
            state.selectedClass = null;
            state.classUsers = [];
            state.announcements = [];
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchAllClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllClasses.fulfilled, (state, action) => {
                state.classes = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to load classes";
            })

            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.selectedClass = action.payload;
            })

            .addCase(fetchUsersInClass.fulfilled, (state, action) => {
                state.classUsers = action.payload;
            })

            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.announcements = action.payload;
            })
            .addCase(fetchMyClasses.fulfilled, (state, action) => {
                state.classes = action.payload;
            }).addCase(fetchMyClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to load my classes";
            });
    },
});


export const { clearSelectedClass } = classManagerSlice.actions;

export default classManagerSlice.reducer;
