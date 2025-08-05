import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store";
import { changePassword } from "../../stores/UserSlice";
import type { ChangePasswordRequest } from "../../interfaces/UserInterface";
import styles from "./ChangePasswordPage.module.scss";
import { useNavigate } from "react-router-dom";

const PASSWORD_MIN_LENGTH = 8;

const ChangePasswordPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.user.loading);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: ChangePasswordRequest) => {
        try {
            await dispatch(changePassword(values)).unwrap();
            message.success("Đổi mật khẩu thành công");
            form.resetFields();
            navigate("/user/me");
        } catch (err: any) {
            const errMsg = typeof err === "string" ? err : err?.message || "Đổi mật khẩu thất bại";
            message.error(errMsg);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Card title="Đổi mật khẩu" className={styles.card}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className={styles.form}
                    requiredMark={false}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu hiện tại"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới" },
                            { min: PASSWORD_MIN_LENGTH, message: `Mật khẩu tối thiểu ${PASSWORD_MIN_LENGTH} ký tự` },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu mới"
                            autoComplete="new-password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmNewPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={["newPassword"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu mới"
                            autoComplete="new-password"
                        />
                    </Form.Item>

                    <Form.Item className={styles.actions}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            aria-label="Đổi mật khẩu"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
