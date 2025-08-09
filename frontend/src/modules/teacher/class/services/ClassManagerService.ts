import axiosClient from "../../../../axios/AxiosClient";
import type { Announcement, Clazz, ClassUser } from "../interfaces/ClassManagerInterface";

const CLASS_API = "/classes";
const CLASS_USER_API = "/class-users";
const ANNOUNCEMENT_API = "/announcements";

export const ClassManagerService = {
    getAllClasses: async (): Promise<Clazz[]> => {
        return axiosClient.get(CLASS_API).then(res => res.data as Clazz[]);
    },

    getClassById: async (id: number): Promise<Clazz> => {
        return axiosClient.get(`${CLASS_API}/${id}`).then(res => res.data as Clazz);
    },

    getMyClasses: async (): Promise<Clazz[]> => {
        return axiosClient.get(`${CLASS_API}/my-classes`).then(res => res.data as Clazz[]);
    },

    createClass: async (name: string, password?: string): Promise<Clazz> => {
        return axiosClient.post(CLASS_API, { name, password }).then(res => res.data as Clazz);
    },

    updateClass: (id: number, data: { name?: string; password?: string; teacherId?: number }): Promise<Clazz> => {
        return axiosClient.put(`${CLASS_API}/${id}`, data)
            .then(res => res.data as Clazz);
    },

    deleteClass: (id: number): Promise<void> => {
        return axiosClient.delete(`${CLASS_API}/${id}`);
    },

    getUsersInClass: async (classId: number): Promise<ClassUser[]> => {
        const res = await axiosClient.get(`${CLASS_USER_API}/${classId}/members`);
        return res.data as ClassUser[];
    },

    addUserToClass: (classId: number, userId: number, isTeacher = false): Promise<ClassUser> => {
        return axiosClient.post(`${CLASS_USER_API}/add`, null, {
            params: { classId, userId, isTeacher },
        });
    },

    removeUserFromClass: (classId: number, userId: number): Promise<void> => {
        return axiosClient.delete(`${CLASS_USER_API}/${classId}/${userId}`, {
            params: { classId, userId },
        });
    },

    getAnnouncementsByClass: (classId: number): Promise<Announcement[]> => {
        return axiosClient.get(`${ANNOUNCEMENT_API}/class/${classId}`).then(res => res.data as Announcement[]);
    },

    getAnnouncementById: (id: number): Promise<Announcement> => {
        return axiosClient.get(`${ANNOUNCEMENT_API}/${id}`).then(res => res.data as Announcement);
    },

    createAnnouncement: (
        classId: number,
        data: { title: string; content: string }
    ): Promise<Announcement> => {
        return axiosClient.post(`${ANNOUNCEMENT_API}`, data, {
            params: { clazzId: classId },
        });
    },

    updateAnnouncement: (
        id: number,
        data: { title: string; content: string }
    ): Promise<Announcement> => {
        return axiosClient.put(`${ANNOUNCEMENT_API}/${id}`, data);
    },

    deleteAnnouncement: (id: number): Promise<void> => {
        return axiosClient.delete(`${ANNOUNCEMENT_API}/${id}`);
    },
};
