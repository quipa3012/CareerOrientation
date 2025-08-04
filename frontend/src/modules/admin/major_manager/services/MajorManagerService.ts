import type { MajorManager, MajorManagerRequest, Block } from "../interfaces/MajorManagerInterface";
import axiosClient from "../../../../axios/AxiosClient";

const BASE_URL = "/majors";

export const majorManagerService = {
    getAll(): Promise<MajorManager[]> {
        return axiosClient.get(BASE_URL).then(response => response.data);
    },

    getById(id: number): Promise<MajorManager> {
        return axiosClient.get(`${BASE_URL}/${id}`).then(response => response.data);
    },

    create(data: MajorManagerRequest): Promise<MajorManager> {
        return axiosClient.post(BASE_URL, data);
    },

    update(id: number, data: MajorManagerRequest): Promise<MajorManager> {
        return axiosClient.put(`${BASE_URL}/${id}`, data);
    },

    delete(id: number): Promise<void> {
        return axiosClient.delete(`${BASE_URL}/${id}`);
    },

    getByBlock(blockId: number): Promise<MajorManager[]> {
        return axiosClient.get(`${BASE_URL}/block/${blockId}`).then(response => response.data);
    },

    getAllBlocks(): Promise<Block[]> {
        return axiosClient.get("/blocks").then(response => response.data);
    }
};
