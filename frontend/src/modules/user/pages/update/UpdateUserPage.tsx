import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Card, Row, Col } from "antd";
import { UploadOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import styles from "./UpdateUserPage.module.scss";
import { UserService } from "../../services/UserService";
import type { UserRequest } from "../../interfaces/UserInterface";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchCurrentUser } from "../../stores/UserSlice";


const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

const UpdateUserPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<RcFile | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        const init = async () => {
            try {
                let profile = user;
                if (!profile) {
                    const res = await dispatch(fetchCurrentUser()).unwrap();
                    profile = res;
                }

                setCurrentUserId(profile.id);
                form.setFieldsValue({
                    username: profile.username,
                    fullName: profile.fullName,
                    email: profile.email,
                });

                if (profile.profileImageUrl) {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const url = profile.profileImageUrl.startsWith("http")
                        ? profile.profileImageUrl
                        : `${backendUrl}${profile.profileImageUrl}`;
                    setPreviewUrl(url);
                }
            } catch (err) {
                console.error(err);
                message.error("Không lấy được thông tin người dùng");
            }
        };

        init();

        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);


    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ hỗ trợ file ảnh!");
            return false;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            message.error("Kích thước ảnh quá lớn. Tối đa 10MB.");
            return false;
        }

        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(url);
        return false;
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const handleSubmit = async (values: UserRequest) => {
        if (!currentUserId) {
            message.error("Không xác định được user id");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                username: values.username,
                fullName: values.fullName,
                email: values.email,
            };

            await UserService.updateUser(currentUserId, payload, avatarFile || undefined);
            message.success("Cập nhật thông tin thành công");
            navigate("/user/me");
        } catch (err: any) {
            console.error(err);
            const msg = err?.response?.data?.message || err?.message || "Cập nhật thất bại";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.updateWrapper}>
            <Card className={styles.updateCard} title="Cập nhật hồ sơ" bordered>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Tên đăng nhập" name="username">
                                <Input prefix={<UserOutlined />} disabled />
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
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Ảnh đại diện">
                                <Upload
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                </Upload>

                                <div className={styles.avatarContainer}>
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Avatar preview" className={styles.avatarPreview} />
                                            <div className={styles.avatarActions}>
                                                <Button onClick={handleRemoveAvatar} size="small">Xoá</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.noAvatar}>Chưa có ảnh đại diện</div>
                                    )}
                                </div>
                                <div className={styles.hint}>Hỗ trợ: jpg, jpeg, png. Tối đa 2MB.</div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UpdateUserPage;
