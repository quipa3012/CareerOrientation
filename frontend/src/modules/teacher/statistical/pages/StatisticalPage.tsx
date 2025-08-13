import React, { useEffect, useState, useMemo } from "react";
import { Table, Spin, Typography, message, Card, Select, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store";
import { fetchMyClassesStatistical } from "../stores/StatisticalSlice";
import type { StatisticalResult } from "../interfaces/StatisticalInterface";
import StatisticalService from "../services/StatisticalService";
import styles from "./StatisticalPage.module.scss";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const { Title } = Typography;

const StatisticalPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { byTeacher, loading, error } = useSelector((state: RootState) => state.statistical);

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [resultsWithName, setResultsWithName] = useState<StatisticalResult[]>([]);

    useEffect(() => {
        dispatch(fetchMyClassesStatistical());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (byTeacher.length > 0 && selectedClassId === null) {
            setSelectedClassId(byTeacher[0].clazz.id);
        }
    }, [byTeacher, selectedClassId]);

    const selectedClassData = byTeacher.find(item => item.clazz.id === selectedClassId);

    useEffect(() => {
        if (!selectedClassData) return;

        const uniqueUserIds = [...new Set(selectedClassData.results.map(r => r.userId))];
        StatisticalService.getUsersFullNames(uniqueUserIds)
            .then(userMap => {
                const updatedResults = selectedClassData.results.map(r => ({
                    ...r,
                    fullName: userMap[r.userId] || "—"
                }));
                setResultsWithName(updatedResults);
            })
            .catch(() => message.error("Không thể tải tên học sinh"));
    }, [selectedClassData]);


    const columns = [
        { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
        { title: "Ngành dự đoán", dataIndex: "predictedMajor", key: "predictedMajor" },
        {
            title: "Ngày làm test",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: string) => new Date(value).toLocaleString(),
        },
    ];

    const chartData = useMemo(() => {
        if (!selectedClassData) return { labels: [], datasets: [] };

        let khtnCount = 0;
        let khxhCount = 0;
        const countedUsers: number[] = [];

        selectedClassData.results.forEach((result) => {
            if (countedUsers.includes(result.userId)) return;

            countedUsers.push(result.userId);

            const major = result.predictedMajor || "";
            if (major === "Khối Khoa Học Tự Nhiên") {
                khtnCount++;
            } else if (major === "Khối Khoa Học Xã Hội") {
                khxhCount++;
            }
        });

        return {
            labels: ["KHTN", "KHXH"],
            datasets: [
                {
                    label: "Số lượng học sinh",
                    data: [khtnCount, khxhCount],
                    backgroundColor: ["#1890ff", "#f5222d"],
                    borderWidth: 1
                }
            ]
        };
    }, [selectedClassData]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: {
                display: true,
                text: "Tổng kết KHTN vs KHXH",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className={styles.statisticalPage}>
            <Title level={3}>Thống kê kết quả bài test</Title>

            {byTeacher.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <Select
                        value={selectedClassId ?? undefined}
                        onChange={setSelectedClassId}
                        style={{ width: 250 }}
                        options={byTeacher.map(({ clazz }) => ({
                            value: clazz.id,
                            label: clazz.name,
                        }))}
                    />
                </div>
            )}

            <Spin spinning={loading}>
                {!selectedClassData ? (
                    <p>Không có dữ liệu thống kê.</p>
                ) : (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card
                                title={`Lớp: ${selectedClassData.clazz.name}`}
                                className={styles.classCard}
                            >
                                <Table<StatisticalResult>
                                    columns={columns}
                                    dataSource={resultsWithName}
                                    rowKey="id"
                                    pagination={{ pageSize: 5 }}
                                />
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card >
                                <Bar data={chartData} options={chartOptions} />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Spin>
        </div>
    );
};

export default StatisticalPage;
