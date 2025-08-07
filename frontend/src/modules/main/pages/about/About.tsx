import React from "react";
import { Row, Col, Typography, Card } from "antd";
import styles from "./About.module.scss";
import AboutImg from "./img/About_img.png";
import MemberImg from "./img/member_img.png";


const { Title, Paragraph } = Typography;

const About: React.FC = () => {
    return (
        <div className={styles.about}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <Row align="middle" gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Title level={1}>Về CareerConnect</Title>
                        <Paragraph>
                            CareerConnect là nền tảng hướng nghiệp giúp học sinh, sinh viên
                            khám phá ngành học phù hợp dựa trên bài trắc nghiệm RIASEC + TIPI
                            kết hợp trí tuệ nhân tạo.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <img
                            src={AboutImg}
                            alt="About CareerConnect"
                        />
                    </Col>
                </Row>
            </section>

            {/* Mission Section */}
            <section className={styles.section}>
                <Title level={2} className={styles.section__title}>
                    Sứ mệnh & Giá trị cốt lõi
                </Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Card hoverable>
                            <Title level={4}>Chính xác</Title>
                            <Paragraph>
                                Đưa ra kết quả tư vấn dựa trên dữ liệu và thuật toán AI đáng tin
                                cậy.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card hoverable>
                            <Title level={4}>Cá nhân hóa</Title>
                            <Paragraph>
                                Mỗi học sinh nhận gợi ý ngành học riêng, phù hợp sở thích & năng
                                lực.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card hoverable>
                            <Title level={4}>Tiện lợi</Title>
                            <Paragraph>
                                Nền tảng trực tuyến, truy cập mọi lúc mọi nơi.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={6}>
                        <Card hoverable>
                            <Title level={4}>Hợp tác</Title>
                            <Paragraph>
                                Kết nối với trường học, giáo viên để hỗ trợ học sinh toàn diện.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Team Section */}
            <section className={`${styles.section} ${styles["section--gray"]}`}>
                <Title level={2} className={styles.section__title}>
                    Đội ngũ phát triển
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    {[1, 2, 3].map((id) => (
                        <Col xs={24} md={6} key={id}>
                            <Card hoverable className={styles["team-card"]}>
                                <img
                                    src={MemberImg}
                                    alt={`Thành viên ${id}`}
                                />
                                <Title level={4}>Thành viên {id}</Title>
                                <Paragraph>Vai trò trong dự án</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>


        </div>
    );
};

export default About;
