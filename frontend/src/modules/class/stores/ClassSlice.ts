import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Clazz, Announcement, ClassUser } from "../interfaces/ClassInterface";
import { ClassService } from "../services/ClassService";

interface ClassState {
    allClasses: Clazz[];
    myClasses: Clazz[];
    selectedClass: Clazz | null;
    announcements: Announcement[];
    members: ClassUser[];
    loading: boolean;
    error: string | null;
}

const initialState: ClassState = {
    allClasses: [],
    myClasses: [],
    selectedClass: null,
    announcements: [],
    members: [],
    loading: false,
    error: null,
};

export const fetchAllClasses = createAsyncThunk("class/fetchAllClasses", async () => {
    return await ClassService.getAllClasses();
});

export const fetchMyClasses = createAsyncThunk("class/fetchMyClasses", async () => {
    return await ClassService.getMyClasses();
});

export const fetchClassById = createAsyncThunk("class/fetchClassById", async (id: number) => {
    return await ClassService.getClassById(id);
});

export const fetchAnnouncements = createAsyncThunk("class/fetchAnnouncements", async (classId: number) => {
    return await ClassService.getAnnouncementsByClass(classId);
});

export const fetchMembersByClassId = createAsyncThunk(
    "class/fetchMembersByClassId",
    async (classId: number) => {
        return await ClassService.getMembersByClassId(classId);
    }
);

export const joinClass = createAsyncThunk(
    "class/joinClass",
    async ({ classId, password }: { classId: number; password?: string }) => {
        return await ClassService.joinClass(classId, password);
    }
);

export const leaveClass = createAsyncThunk("class/leaveClass", async (classId: number) => {
    return await ClassService.leaveClass(classId);
});

const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {
        clearSelectedClass(state) {
            state.selectedClass = null;
            state.announcements = [];
            state.members = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllClasses.fulfilled, (state, action) => {
                state.allClasses = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to load classes";
            })

            .addCase(fetchMyClasses.fulfilled, (state, action) => {
                state.myClasses = action.payload;
            })
            .addCase(fetchMyClasses.rejected, (state, action) => {
                state.error = action.error.message ?? "Failed to load my classes";
            })

            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.selectedClass = action.payload;
            })

            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.announcements = action.payload;
            })

            .addCase(joinClass.fulfilled, (state) => {
                state.loading = false;
                state.error = null;

            })

            .addCase(leaveClass.fulfilled, (state) => {
                const leftClassId = state.selectedClass?.id;
                state.selectedClass = null;
                state.announcements = [];
                state.myClasses = state.myClasses.filter((clazz) => clazz.id !== leftClassId);
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMembersByClassId.fulfilled, (state, action) => {
                state.members = action.payload as ClassUser[];
            })
            .addCase(fetchMembersByClassId.rejected, (state, action) => {
                state.error = action.error.message ?? "Failed to load class members";
            });
    },
});

export const { clearSelectedClass } = classSlice.actions;
export default classSlice.reducer;
