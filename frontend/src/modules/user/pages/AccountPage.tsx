import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, message } from "antd";
import { userService } from "../services/UserService";
import type { UserInfo } from "../interfaces/UserInterface";
import styles from "./AccountPage.module.scss";

const AccountPage: React.FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await userService.getProfile();
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

    return (
        <div className={styles.container}>
            <Card title="Thông Tin Tài Khoản" bordered={false} className={styles.card}>
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
