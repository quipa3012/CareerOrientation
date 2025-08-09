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

export const deleteClass = createAsyncThunk(
    "classManager/deleteClass",
    async (id: number) => {
        await ClassManagerService.deleteClass(id);
        return id;
    }
);

export const updateClass = createAsyncThunk(
    'class/updateClass',
    async ({ id, data }: { id: number; data: { name?: string; password?: string; teacherId?: number } }) => {
        return await ClassManagerService.updateClass(id, data);
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
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                state.classes = state.classes.filter(c => c.id !== action.payload);
            })
            .addCase(deleteClass.rejected, (state, action) => {
                state.error = action.error.message ?? "Failed to delete class";
            })
            .addCase(updateClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClass.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.classes.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (index !== -1) {
                    state.classes[index] = action.payload;
                }
            })
            .addCase(updateClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update class";
            })
            ;
    },
});


export const { clearSelectedClass } = classManagerSlice.actions;

export default classManagerSlice.reducer;
