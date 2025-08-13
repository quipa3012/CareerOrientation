import axiosClient from "../../../../axios/AxiosClient";
import type { StatisticalList } from "../interfaces/StatisticalInterface";
import type { Clazz } from "../../class/interfaces/ClassManagerInterface";
import { ClassManagerService } from "../../class/services/ClassManagerService"; "../../class/services/ClassManagerService";

const TEST_RESULT_API = "/test-results";

const StatisticalService = {
    /**
     * Lấy danh sách kết quả test theo lớp
     * @param clazzId id lớp cần lấy thống kê
     */
    getByClass(clazzId: number): Promise<StatisticalList> {
        const url = `${TEST_RESULT_API}/class/${clazzId}`;
        return axiosClient.get(url).then((response) => {
            return response.data as StatisticalList;
        });
    },

    /**
     * Lấy thống kê cho tất cả các lớp mà giáo viên đang phụ trách
     * @returns Promise<{ clazz: Clazz; results: StatisticalList }[]>
     */
    async getMyClassesStatistical(): Promise<{ clazz: Clazz; results: StatisticalList }[]> {
        // 1. Lấy danh sách lớp của giáo viên
        const myClasses = await ClassManagerService.getMyClasses();

        // 2. Lấy thống kê cho từng lớp
        const results = await Promise.all(
            myClasses.map(async (clazz) => {
                const res = await this.getByClass(clazz.id);
                return { clazz, results: res };
            })
        );

        return results;
    },

    /**
 * Lấy thông tin người dùng theo ID
 * @param userId 
 * @returns { id: number; fullName: string }
 */
    async getUserFullName(userId: number): Promise<{ id: number; fullName: string }> {
        const res = await axiosClient.get(`/users/${userId}`);
        return { id: userId, fullName: res.data.fullName };
    },

    /**
     * Lấy thông tin nhiều người dùng cùng lúc
     * @param userIds danh sách userId unique
     * @returns Record<userId, fullName>
     */
    async getUsersFullNames(userIds: number[]): Promise<Record<number, string>> {
        const results = await Promise.all(
            userIds.map(async (id) => {
                const response = await axiosClient.get(`/users/${id}`);
                const user = response.data.data; // vì full info nằm trong data
                return { id: user.id, fullName: user.fullName };
            })
        );

        const map: Record<number, string> = {};
        results.forEach(({ id, fullName }) => {
            map[id] = fullName;
        });
        return map;
    }

};

export default StatisticalService;
