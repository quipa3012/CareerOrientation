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
                    {[
                        {
                            name: "Nhóm ngành Công Nghệ Thông Tin",
                            desc: "Nhóm ngành CNTT bao gồm các lĩnh vực như lập trình, phân tích dữ liệu, trí tuệ nhân tạo, an ninh mạng. Sinh viên sẽ được trang bị kiến thức về thuật toán, cơ sở dữ liệu, phát triển phần mềm và ứng dụng AI trong thực tế, giúp đáp ứng nhu cầu số hóa và công nghệ toàn cầu.",
                        },
                        {
                            name: "Nhóm ngành Y Dược Sức Khỏe",
                            desc: "Nhóm ngành Y Dược Sức Khỏe tập trung vào đào tạo các bác sĩ, dược sĩ, điều dưỡng và chuyên gia y tế khác. Sinh viên học về chăm sóc sức khỏe, nghiên cứu lâm sàng, y học dự phòng và các kỹ năng thực hành trong môi trường bệnh viện và phòng thí nghiệm.",
                        },
                        {
                            name: "Nhóm ngành Kinh Tế Quản Lý",
                            desc: "Nhóm ngành Kinh Tế Quản Lý cung cấp kiến thức về quản trị doanh nghiệp, tài chính, marketing, kế toán và logistics. Sinh viên sẽ học cách phân tích thị trường, lập kế hoạch chiến lược và quản lý nguồn lực hiệu quả trong môi trường kinh doanh hiện đại.",
                        }
                    ].map((major, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card hoverable>
                                <img
                                    src={MajorImg}
                                    alt={major.name}
                                    className={styles["card-img"]}
                                />
                                <Title level={4}>{major.name}</Title>
                                <Paragraph>{major.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

        </div>
    );
};

export default Home;
