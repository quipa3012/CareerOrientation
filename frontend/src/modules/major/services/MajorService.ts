import axiosClient from "../../../axios/AxiosClient";
import type { Major, Block } from "../interfaces/MajorInterface";

export const majorService = {
    getAll: (): Promise<Major[]> => {
        return axiosClient.get("/majors").then(res => res.data);
    },

    getByBlock: (blockId: number): Promise<Major[]> => {
        return axiosClient.get(`/majors/block/${blockId}`).then(res => res.data);
    },

    getById: (id: number): Promise<Major> => {
        return axiosClient.get(`/majors/${id}`).then(res => res.data);
    },

    create: (data: Partial<Major>): Promise<Major> => {
        return axiosClient.post("/majors", data).then(res => res.data);
    },

    update: (id: number, data: Partial<Major>, blockId: number): Promise<Major> => {
        return axiosClient.put(`/majors/${id}?blockId=${blockId}`, data).then(res => res.data);
    },

    delete: (id: number): Promise<void> => {
        return axiosClient.delete(`/majors/${id}`).then(res => res.data);
    },

    getAllBlocks: (): Promise<Block[]> => {
        return axiosClient.get("/blocks").then(res => res.data);
    }
};
