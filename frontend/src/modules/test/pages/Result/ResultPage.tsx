import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "antd";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import styles from "./ResultPage.module.scss";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const { Title, Paragraph } = Typography;

const ResultPage: React.FC = () => {
    const navigate = useNavigate();
    const result = useSelector((state: RootState) => state.test.currentResult);

    useEffect(() => {
        if (!result) {
            navigate("/test/start");
        }
    }, [result, navigate]);

    if (!result) return null;

    const groupKeys = ["R", "I", "A", "S", "E", "C"];
    const groupScores = groupKeys.map((key) =>
        Object.entries(result.answers)
            .filter(([code]) => code.startsWith(key))
            .reduce((sum, [, value]) => sum + value, 0)
    );

    // ✅ Dữ liệu chart
    const chartData = {
        labels: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
        datasets: [
            {
                label: "Tổng Điểm",
                data: groupScores,
                backgroundColor: [
                    "#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0", "#607d8b"
                ]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx: any) => `Điểm: ${ctx.raw}` } }
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    return (
        <div className={styles.resultPage}>
            <Card className={styles.card}>
                <Title level={2} className={styles.title}>
                    Kết Quả Bài Test
                </Title>

                <Paragraph className={styles.resultText}>
                    <b>Ngành dự đoán:</b> <span className={styles.predicted}>{result.predictedMajor}</span>
                </Paragraph>

                <div className={styles.chartContainer}>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className={styles.evaluation}>
                    <Title level={4}>Đánh giá</Title>
                    <Paragraph className={styles.resultText}>
                        Dựa trên kết quả, bạn phù hợp với <b>{result.predictedMajor}</b>.
                        Hãy tìm hiểu thêm về các ngành trong khối này để định hướng nghề nghiệp phù hợp.
                    </Paragraph>
                </div>

                <div className={styles.actions}>
                    <Button className={styles.retakeButton} type="primary" onClick={() => navigate("/test/start")}>
                        Làm lại bài test
                    </Button>
                    <Button className={styles.retakeButton} onClick={() => navigate("/test/history")}>
                        Xem lịch sử bài test
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ResultPage;
