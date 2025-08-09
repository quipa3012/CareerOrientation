import axiosClient from "../../../axios/AxiosClient";
import type { Announcement, Clazz, ClassUser } from "../interfaces/ClassInterface";

const CLASS_API = "/classes";
const CLASS_USER_API = "/class-users";
const ANNOUNCEMENT_API = "/announcements";

export const ClassService = {
    getAllClasses: (): Promise<Clazz[]> => {
        return axiosClient.get(CLASS_API).then(res => res.data as Clazz[]);
    },

    getMyClasses: (): Promise<Clazz[]> => {
        return axiosClient.get(`${CLASS_USER_API}/my-classes`).then(res => res.data as Clazz[]);
    },

    joinClass: (classId: number, password?: string): Promise<void> => {
        return axiosClient.post(`${CLASS_USER_API}/${classId}/join`, null, {
            params: { classId, password },
        });
    },

    leaveClass: (classId: number): Promise<void> => {
        return axiosClient.delete(`${CLASS_USER_API}/${classId}/leave`, {
            params: { classId },
        });
    },

    getClassById: (id: number): Promise<Clazz> => {
        return axiosClient.get(`${CLASS_API}/${id}`).then(res => res.data as Clazz);
    },

    getAnnouncementsByClass: (classId: number): Promise<Announcement[]> => {
        return axiosClient.get(`${ANNOUNCEMENT_API}/class/${classId}`).then(res => res.data as Announcement[]);
    },

    getMembersByClassId: (classId: number): Promise<ClassUser[]> => {
        return axiosClient.get(`${CLASS_USER_API}/${classId}/members`).then(res => res.data as ClassUser[]);
    },
};
