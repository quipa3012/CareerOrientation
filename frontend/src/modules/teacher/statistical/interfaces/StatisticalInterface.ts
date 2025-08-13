
export interface StatisticalResult {
    id: number;
    userId: number;
    answers: Record<string, number>;
    predictedMajor: string;
    createdAt: string;
    fullName?: string;
}

export type StatisticalList = StatisticalResult[];

export interface StatisticalClassData {
    clazz: {
        id: number;
        name: string;
    };
    results: StatisticalResult[];
}

