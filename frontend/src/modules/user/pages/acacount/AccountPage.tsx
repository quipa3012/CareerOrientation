import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, message, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserService } from "../../services/UserService";
import type { UserInfo } from "../../interfaces/UserInterface";
import styles from "./AccountPage.module.scss";

const AccountPage: React.FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await UserService.getProfile();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user info:", error);
                message.error("Không thể lấy thông tin người dùng.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const renderAvatar = () => {
        if (user?.profileImageUrl) {
            return (
                <Avatar
                    size={100}
                    src={user.profileImageUrl}
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
                    <Spin tip="Đang tải thông tin..." />
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
