import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import type { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { login } from '../../stores/AuthSlice';
import type { LoginPayload } from '../../interfaces/AuthInterface';

const { Title } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>()

    const handleLogin = async (values: LoginPayload) => {
        try {

            const resultAction = await dispatch(login(values))

            if (login.fulfilled.match(resultAction)) {
                message.success("Đăng nhập thành công!")
                navigate("/")
            } else {
                const errMsg = (resultAction.payload as string) || "Tài khoản hoặc mật khẩu không đúng!"
                message.error(errMsg)
            }
        } catch (error) {
            message.error("Đã có lỗi xảy ra, vui lòng thử lại!")
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Title level={2} className={styles.title}>Đăng nhập</Title>
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={handleLogin}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập tên đăng nhập"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.loginButton}
                            block
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
