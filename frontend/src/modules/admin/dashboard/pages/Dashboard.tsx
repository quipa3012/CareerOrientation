import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { UserOutlined, BookOutlined, ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.dashboard}>
            <Title level={2}>Dashboard Admin</Title>
            <Paragraph>
                Đây là trang tổng quan hệ thống. Tại đây bạn có thể nhanh chóng truy cập các chức năng quản lý quan trọng của hệ thống:
            </Paragraph>

            <Row gutter={24} className={styles.cardList}>
                <Col span={8}>
                    <Card hoverable className={styles.card}>
                        <UserOutlined className={styles.iconUser} />
                        <Button type="primary" block onClick={() => navigate("/admin/users")}>
                            Quản lý người dùng
                        </Button>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable className={styles.card}>
                        <BookOutlined className={styles.iconMajor} />
                        <Button type="primary" block onClick={() => navigate("/admin/majors")}>
                            Quản lý ngành học
                        </Button>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card hoverable className={styles.card}>
                        <ProfileOutlined className={styles.iconQuestion} />
                        <Button type="primary" block onClick={() => navigate("/admin/questions")}>
                            Quản lý bộ câu hỏi
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
