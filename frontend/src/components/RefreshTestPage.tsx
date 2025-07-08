import React, { useState } from "react";
import axios from "axios";
import { Button, Card, Typography, message } from "antd";

const { Title, Paragraph } = Typography;

const RefreshTestPage: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:8080/api/auth/refresh-token",
                {}, // backend không cần body
                {
                    withCredentials: true, // gửi cookie refreshToken
                }
            );

            const newAccessToken = res.data.data.accesstoken;
            setAccessToken(newAccessToken);
            message.success("Refresh token thành công!");
            console.log("New Access Token:", newAccessToken);
        } catch (err: any) {
            console.error("Error refreshing token:", err.response || err);
            message.error("Refresh token thất bại!");
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
            <Card style={{ maxWidth: 600, width: "100%" }}>
                <Title level={3}>Test Refresh Token</Title>
                <Paragraph>
                    Nhấn nút bên dưới để test API <code>/auth/refresh-token</code>. Kết quả trả về sẽ hiển thị ở đây.
                </Paragraph>
                <Button
                    type="primary"
                    onClick={handleRefresh}
                    loading={loading}
                    style={{ marginBottom: "20px" }}
                >
                    Gửi request refresh-token
                </Button>

                {accessToken && (
                    <>
                        <Title level={4}>Access Token mới:</Title>
                        <Paragraph copyable style={{ wordBreak: "break-all" }}>
                            {accessToken}
                        </Paragraph>
                    </>
                )}
            </Card>
        </div>
    );
};

export default RefreshTestPage;
