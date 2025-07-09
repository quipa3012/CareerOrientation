import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined, UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import styles from "./RegisterPage.module.scss";
import { UserService } from "../../services/UserService";
import { AuthService } from "../../../auth/services/AuthService"; // 🆕 thêm AuthService
import type { UserRequest } from "../../interfaces/UserInterface";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<RcFile | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (values: UserRequest) => {
        setLoading(true);
        try {
            // 🟢 Đăng ký tài khoản
            const res = await UserService.createUser(values, avatarFile || undefined);
            message.success(`Tạo tài khoản thành công cho ${res.username}`);

            // 🟢 Login ngay sau khi đăng ký
            await AuthService.login({
                username: values.username,
                password: values.password
            });

            message.success(`Đăng nhập thành công với ${res.username}`);
            navigate("/user/me");
        } catch (err) {
            console.error(err);
            message.error("Tạo tài khoản hoặc đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ hỗ trợ file ảnh!");
        } else {
            setAvatarFile(file);
        }
        return false; // Không auto upload
    };

    return (
        <div className={styles.registerWrapper}>
            <Card className={styles.registerCard} title="Đăng ký tài khoản" bordered>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập username" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                        <Input placeholder="Full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item label="Ảnh đại diện">
                        <Upload
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            showUploadList={avatarFile ? { showPreviewIcon: true } : false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {avatarFile && (
                            <img
                                src={URL.createObjectURL(avatarFile)}
                                alt="Avatar preview"
                                className={styles.avatarPreview}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;
