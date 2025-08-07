import { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ClassManagerService } from "../../services/ClassManagerService";
import styles from "./AddClassPage.module.scss";

const { Title } = Typography;

const AddClassPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values: { name: string; password?: string }) => {
        setLoading(true);
        try {
            const { name, password } = values;
            await ClassManagerService.createClass(name.trim(), password?.trim());
            message.success("Tạo lớp thành công");
            navigate("/classes");
        } catch (err) {
            message.error("Tạo lớp thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Title level={3}>Tạo lớp học mới</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên lớp"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
                    >
                        <Input placeholder="Nhập tên lớp..." />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu lớp (tuỳ chọn)"
                        name="password"
                        rules={[{ max: 32, message: "Tối đa 32 ký tự" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu lớp (nếu cần)..." />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Tạo lớp
                        </Button>
                        <Button
                            style={{ marginLeft: "1rem" }}
                            onClick={() => navigate("/classes")}
                        >
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddClassPage;
