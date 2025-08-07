import axiosClient from "../../../../axios/AxiosClient";
import type { Announcement, Clazz, ClassUser } from "../interfaces/ClassManagerInterface";

const CLASS_API = "/classes";
const CLASS_USER_API = "/class-users";
const ANNOUNCEMENT_API = "/announcements";

export const ClassManagerService = {
    getAllClasses: (): Promise<Clazz[]> => {
        return axiosClient.get(CLASS_API).then(res => res.data as Clazz[]);
    },

    getClassById: (id: number): Promise<Clazz> => {
        return axiosClient.get(`${CLASS_API}/${id}`).then(res => res.data as Clazz);
    },

    getMyClasses: (): Promise<Clazz[]> => {
        return axiosClient.get(`${CLASS_API}/my-classes`).then(res => res.data as Clazz[]);
    },

    createClass: (name: string, password?: string): Promise<Clazz> => {
        return axiosClient.post(CLASS_API, { name, password }).then(res => res.data as Clazz);
    },

    updateClass: (id: number, name: string): Promise<Clazz> => {
        return axiosClient.put(`${CLASS_API}/${id}`, null, {
            params: { name },
        }).then(res => res.data as Clazz);
    },

    deleteClass: (id: number): Promise<void> => {
        return axiosClient.delete(`${CLASS_API}/${id}`);
    },

    getUsersInClass: (classId: number): Promise<ClassUser[]> => {
        return axiosClient.get(`${CLASS_USER_API}/clazz/${classId}`).then(res => res.data as ClassUser[]);
    },

    addUserToClass: (classId: number, userId: number, isTeacher = false): Promise<ClassUser> => {
        return axiosClient.post(`${CLASS_USER_API}/add`, null, {
            params: { classId, userId, isTeacher },
        });
    },

    removeUserFromClass: (classId: number, userId: number): Promise<void> => {
        return axiosClient.delete(`${CLASS_USER_API}/remove`, {
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
