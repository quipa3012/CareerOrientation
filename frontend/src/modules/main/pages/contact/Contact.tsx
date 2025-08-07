import React from "react";
import { Row, Col, Typography, Form, Input, Button, Card } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import styles from "./Contact.module.scss";
import ContactImg from "./img/Contact_img.png";

const { Title, Paragraph } = Typography;

const Contact: React.FC = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        console.log("Thông tin gửi liên hệ:", values);
        form.resetFields();
    };

    return (
        <div className={styles.contact}>
            <section className={styles.hero}>
                <Row align="middle" gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Title level={1}>Liên hệ với CareerConnect</Title>
                        <Paragraph>
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi thông tin
                            qua form hoặc liên hệ trực tiếp.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <img
                            src={ContactImg}
                            alt="Contact CareerConnect"
                        />
                    </Col>
                </Row>
            </section>

            <section className={styles.section}>
                <Title level={2} className={styles.section__title}>
                    Gửi tin nhắn cho chúng tôi
                </Title>
                <Row justify="center">
                    <Col xs={24} md={12}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            requiredMark={false}
                        >
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Nội dung"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                            >
                                <Input.TextArea rows={4} placeholder="Nhập nội dung liên hệ" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Gửi liên hệ
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </section>

            <section className={`${styles.section} ${styles["section--gray"]}`}>
                <Title level={2} className={styles.section__title}>
                    Thông tin liên lạc
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} md={8}>
                        <Card className={styles["info-card"]}>
                            <MailOutlined className={styles.icon} />
                            <Title level={4}>Email</Title>
                            <Paragraph>support@careerconnect.com</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className={styles["info-card"]}>
                            <PhoneOutlined className={styles.icon} />
                            <Title level={4}>Điện thoại</Title>
                            <Paragraph>+84 123 456 789</Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className={styles["info-card"]}>
                            <EnvironmentOutlined className={styles.icon} />
                            <Title level={4}>Địa chỉ</Title>
                            <Paragraph>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</Paragraph>
                        </Card>
                    </Col>
                </Row>
            </section>

            <section className={styles.section}>
                <iframe
                    title="CareerConnect Map"
                    src="https://maps.google.com/maps?q=Ho%20Chi%20Minh%20City&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className={styles.map}
                ></iframe>
            </section>
        </div>
    );
};

export default Contact;
