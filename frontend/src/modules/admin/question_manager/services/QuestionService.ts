import axiosClient from "../../../../axios/AxiosClient";
import type { Question } from "../interfaces/QuestionInterface";

const API_URL = "/questions";

export const QuestionService = {
    getAll: async (): Promise<Question[]> => {
        const res = await axiosClient.get(API_URL);
        return res.data as Question[];
    },

    getById: async (id: number): Promise<Question> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    update: async (id: number, content: string): Promise<Question> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, { content });
        return res.data;
    },
};
