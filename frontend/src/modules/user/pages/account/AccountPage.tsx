import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Descriptions, Spin, Avatar, Button, Alert } from "antd";
import { UserOutlined, EditOutlined, KeyOutlined } from "@ant-design/icons";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchCurrentUser } from "../../stores/UserSlice";
import styles from "./AccountPage.module.scss";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.currentUser);
    const loading = useSelector((state: RootState) => state.user.loading);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!user) {
            dispatch(fetchCurrentUser());
        }
    }, [user, dispatch]);

    const renderAvatar = () => {
        if (user?.profileImageUrl) {
            const avatarUrl = user.profileImageUrl.startsWith("http")
                ? user.profileImageUrl
                : `${backendUrl}${user.profileImageUrl}`;
            return (
                <Avatar
                    size={200}
                    src={avatarUrl}
                    alt="Avatar"
                    className={styles.avatar}
                />
            );
        }
        return <Avatar size={100} icon={<UserOutlined />} className={styles.avatar} />;
    };

    const handleEdit = () => {
        navigate("update");
    };

    const handleChangePassword = () => {
        navigate("change-password");
    };

    return (
        <div className={styles.container}>
            <Card
                title="Thông Tin Tài Khoản"
                className={styles.card}
                extra={renderAvatar()}
            >
                {loading || !user ? (
                    <Spin tip="Đang tải thông tin..." />
                ) : (
                    <>

                        {!user.passwordChanged && (
                            <Alert
                                message="Mật khẩu của bạn chưa được đổi"
                                description="Vì lý do bảo mật, vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên."
                                type="warning"
                                showIcon
                                style={{ marginBottom: "16px" }}
                            />
                        )}

                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Tên đăng nhập">
                                {user.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Họ tên đầy đủ">
                                {user.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                {user.roleName}
                            </Descriptions.Item>
                        </Descriptions>
                        <div className={styles.actions}>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                            >
                                Sửa hồ sơ
                            </Button>
                            <Button
                                type="primary"
                                icon={<KeyOutlined />}
                                onClick={handleChangePassword}
                            >
                                Đổi mật khấu
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default AccountPage;
