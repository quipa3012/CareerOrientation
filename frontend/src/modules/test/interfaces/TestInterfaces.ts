export interface Question {
    id: number;
    code: string;
    content: string;
    category: string;
}

export interface SubmitTestRequest {
    answers: Record<string, number>;
}

export interface TestResult {
    id: number;
    userId: number;
    answers: Record<string, number>;
    predictedMajor: string;
    createdAt: string;
}
