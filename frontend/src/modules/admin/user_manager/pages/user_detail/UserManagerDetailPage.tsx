import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { fetchUserById } from "../../stores/UserManagerSlice";
import { Card, Descriptions, Spin, Avatar, Alert, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./UserManagerDetailPage.module.scss";

const UserManagerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { users, loading } = useAppSelector((state) => state.userManager);
    const user = users.find((u) => u.id === userId);

    useEffect(() => {
        if (!user && id) {
            dispatch(fetchUserById(userId));
        }
    }, [id, user]);

    const renderAvatar = () => {
        if (user?.profileImageUrl) {
            const avatarUrl = user.profileImageUrl.startsWith("http")
                ? user.profileImageUrl
                : `${backendUrl}${user.profileImageUrl}`;
            return <Avatar size={200} src={avatarUrl} className={styles.avatar} />;
        }
        return <Avatar size={100} icon={<UserOutlined />} className={styles.avatar} />;
    };

    if (loading || !user) {
        return (
            <div className={styles.loadingContainer}>
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Card
                title="Chi Tiết Người Dùng"
                className={styles.card}
                extra={renderAvatar()}
            >
                {!user.passwordChanged && (
                    <Alert
                        message="Người dùng chưa đổi mật khẩu"
                        description="Tài khoản này vẫn chưa thay đổi mật khẩu mặc định."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Tên đăng nhập">
                        {user.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="Họ và tên">
                        {user.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quyền">
                        {user.roleName}
                    </Descriptions.Item>
                </Descriptions>

                <div className={styles.actions}>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                </div>
            </Card>
        </div>
    );
};

export default UserManagerDetailPage;
