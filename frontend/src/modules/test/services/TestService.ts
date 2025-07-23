import axiosClient from "../../../axios/AxiosClient";
import type { Question, SubmitTestRequest, TestResult } from "../interfaces/TestInterfaces";

export const TestService = {
    /**
     * Lấy danh sách câu hỏi
     */
    getQuestions: async (): Promise<Question[]> => {
        const res = await axiosClient.get("/questions");
        return res.data as Question[];
    },

    /**
     * Submit câu trả lời và nhận kết quả
     */
    submitTest: async (userId: number, request: SubmitTestRequest): Promise<TestResult> => {
        const res = await axiosClient.post(
            `/test-results?userId=${userId}`,
            request
        );
        return res.data as TestResult;
    },

    /**
     * Lấy lịch sử kết quả test của user
     */
    getTestHistory: async (userId: number): Promise<TestResult[]> => {
        const res = await axiosClient.get(`/test-results/${userId}`);
        return res.data as TestResult[];
    }
};
