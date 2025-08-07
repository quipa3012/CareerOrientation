import React from "react";
import { Row, Col, Typography, Button, Card } from "antd";
import styles from "./Home.module.scss";
import HeroImg from "./img/Hero_img.png";
import AIImg from "./img/AI_img.jpg";
import MajorImg from "./img/major_img.jpg";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <Row align="middle" gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Title level={1}>
                            Khám phá ngành học phù hợp với bạn cùng CareerConnect
                        </Title>
                        <Paragraph>
                            Thực hiện bài trắc nghiệm RIASEC + TIPI và nhận tư vấn ngành học
                            chính xác từ AI.
                        </Paragraph>
                        <Button type="primary" size="large" style={{ marginRight: 16 }}>
                            Bắt đầu trắc nghiệm
                        </Button>
                        <Button size="large">Tìm hiểu thêm</Button>
                    </Col>
                    <Col xs={24} md={12}>
                        <img
                            src={HeroImg}
                            alt="Hero banner"
                        />
                    </Col>
                </Row>
            </section>

            <section className={styles.section}>
                <Title level={2} className={styles.section__title}>
                    Tính năng nổi bật
                </Title>
                <Row gutter={[24, 24]}>
                    {[
                        {
                            title: "Trắc nghiệm chuẩn quốc tế",
                            desc: "RIASEC & TIPI được sử dụng rộng rãi để định hướng nghề nghiệp.",
                        },
                        {
                            title: "AI gợi ý ngành học",
                            desc: "Phân tích kết quả test và xu hướng việc làm để đề xuất ngành phù hợp.",
                        },
                        {
                            title: "Thư viện ngành nghề",
                            desc: "Cung cấp thông tin chi tiết về các ngành học và khối thi.",
                        },
                    ].map((f, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card hoverable>
                                <img
                                    src={AIImg}
                                    alt={f.title}
                                    className={styles["card-img"]}
                                />
                                <Title level={4}>{f.title}</Title>
                                <Paragraph>{f.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <section className={`${styles.section} ${styles["section--gray"]}`}>
                <Title level={2} className={styles.section__title}>
                    Quy trình 3 bước
                </Title>
                <Row gutter={[24, 24]}>
                    {[
                        {
                            step: "1",
                            title: "Đăng ký tài khoản",
                            desc: "Tạo tài khoản miễn phí để lưu trữ kết quả trắc nghiệm.",
                        },
                        {
                            step: "2",
                            title: "Làm bài test",
                            desc: "Hoàn thành RIASEC + TIPI để đánh giá sở thích & tính cách.",
                        },
                        {
                            step: "3",
                            title: "Nhận gợi ý từ AI",
                            desc: "Xem ngành học phù hợp và định hướng tương lai.",
                        },
                    ].map((s, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card hoverable style={{ textAlign: "center" }}>
                                <Title level={3}>{s.step}</Title>
                                <Title level={4}>{s.title}</Title>
                                <Paragraph>{s.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <section className={styles.section}>
                <Title level={2} className={styles.section__title}>
                    Ngành học nổi bật
                </Title>
                <Row gutter={[24, 24]}>
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card hoverable>
                                <img
                                    src={MajorImg}
                                    alt="Ngành học"
                                    className={styles["card-img"]}
                                />
                                <Title level={4}>Tên ngành học {idx + 1}</Title>
                                <Paragraph>
                                    Mô tả ngắn gọn về ngành học này và tiềm năng trong tương lai.
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default Home;
