import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import { PlayCircleOutlined, HistoryOutlined } from "@ant-design/icons";
import styles from "./StartPage.module.scss";

const StartPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/test/questions");
    };

    const handleGetTestHistory = () => {
        navigate("/test/history")
    }

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <h1 className={styles.title}>Bài Test Định Hướng Khối Học Phù Hợp</h1>
                <p className={styles.description}>
                    Trả lời các câu hỏi để khám phá sở thích, tính cách và khối học phù hợp với bạn.
                </p>
                <p className={styles.description}>
                    Bài trắc nghiệm RIASEC (Holland Code) là công cụ đánh giá tính cách nghề nghiệp phổ biến, phân loại con người thành 6 nhóm: Thực tế, Nghiên cứu, Nghệ thuật, Xã hội, Quản lý và Quy củ.
                </p>
                <p className={styles.description}>
                    Hệ thống sử dụng kết quả từ RIASEC để phân tích xu hướng tư duy và sở thích cá nhân, từ đó dự đoán khối học phù hợp như Khoa học Tự nhiên (KHTN) hoặc Khoa học Xã hội (KHXH).
                </p>
                <p className={styles.description}>
                    Bên cạnh RIASEC, hệ thống còn sử dụng bài trắc nghiệm TIPI (Ten Item Personality Inventory) – một công cụ đánh giá nhanh 5 nhóm đặc điểm tính cách cơ bản theo mô hình Big Five,  Thông qua TIPI, hệ thống có thêm góc nhìn bổ sung về cá tính và hành vi của bạn, từ đó nâng cao độ chính xác khi tư vấn khối học và ngành nghề phù hợp.
                </p>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleStart}
                    icon={<PlayCircleOutlined />}
                    className={styles.startButton}
                >
                    Bắt đầu Làm Trắc Nghiệm
                </Button>
                <p className={styles.description}>
                    Hoặc
                </p>
                <Button
                    type="default"
                    size="large"
                    onClick={handleGetTestHistory}
                    icon={<HistoryOutlined />}
                    className={styles.startButton}
                >
                    Xem Lại Lịch Sử Gợi Ý
                </Button>
            </Card>
        </div>
    );
};

export default StartPage;
