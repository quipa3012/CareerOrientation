import React from "react";
import { useSelector } from "react-redux";
import { Card, Descriptions, Spin, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { RootState } from "../../../../store/store";
import styles from "./AccountPage.module.scss";

const AccountPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.currentUser);
    const loading = useSelector((state: RootState) => state.user.loading);

    const renderAvatar = () => {
        if (user?.profileImageUrl) {
            const avatarUrl = user.profileImageUrl.startsWith("http")
                ? user.profileImageUrl
                : `${import.meta.env.VITE_BACKEND_URL}${user.profileImageUrl}`;

            return (
                <Avatar
                    size={100}
                    src={avatarUrl}
                    alt="Avatar"
                    className={styles.avatar}
                />
            );
        }
        return (
            <Avatar
                size={100}
                icon={<UserOutlined />}
                className={styles.avatar}
            />
        );
    };

    return (
        <div className={styles.container}>
            <Card
                title="Thông Tin Tài Khoản"
                className={styles.card}
                extra={renderAvatar()}
            >
                {loading ? (
                    <Spin tip="Đang tải thông tin..." > </Spin>
                ) : (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Tên đăng nhập">
                            {user?.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên đầy đủ">
                            {user?.fullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {user?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                            {user?.roleName}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Card>
        </div>
    );
};

export default AccountPage;
