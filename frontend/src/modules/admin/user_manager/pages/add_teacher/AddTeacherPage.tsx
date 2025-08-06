import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Card } from "antd";
import { useAppDispatch } from "../../../../../store/hooks";
import { generateTeacherAccount } from "../../stores/UserManagerSlice";
import type { GenerateTeacherRequest, GeneratedAccountResponse } from "../../interfaces/UserManagerInterface";
import styles from "./AddTeacherPage.module.scss";

export default function AddTeacherPage() {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [generatedAccount, setGeneratedAccount] = useState<GeneratedAccountResponse | null>(null);

    const handleSubmit = async (values: GenerateTeacherRequest) => {
        try {
            const resultAction = await dispatch(generateTeacherAccount(values));
            const data = resultAction.payload as GeneratedAccountResponse;
            setGeneratedAccount(data);
            message.success("Tạo tài khoản giáo viên thành công!");
        } catch (error) {
            message.error("Tạo tài khoản thất bại!");
        }
    };

    return (
        <div className={styles.wrapper}>
            <Card title="Tạo tài khoản giáo viên mới" bordered style={{ maxWidth: 600, margin: "0 auto" }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className={styles.form}
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <div className={styles.buttons}>
                            <Button type="primary" htmlType="submit">
                                Tạo tài khoản
                            </Button>
                            <Button onClick={() => navigate(-1)}>
                                Quay lại
                            </Button>
                        </div>
                    </Form.Item>
                </Form>

                {generatedAccount && (
                    <Card type="inner" title="Tài khoản đã tạo" className={styles.resultCard}>
                        <p><strong>Tên đăng nhập:</strong> {generatedAccount.username}</p>
                        <p><strong>Mật khẩu mặc định:</strong> {generatedAccount.rawPassword}</p>
                    </Card>
                )}
            </Card>
        </div>
    );
}
