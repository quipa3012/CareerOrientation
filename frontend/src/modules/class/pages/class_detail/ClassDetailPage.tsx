import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store"; // chỉnh theo đường dẫn root reducer của anh
import { Card, List, Table, Typography, message, Spin, Modal, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Clazz, Announcement, ClassUser } from "../../interfaces/ClassInterface";
import { ClassService } from "../../services/ClassService";
import styles from "./ClassDetailPage.module.scss";

const { Title } = Typography;

const ClassDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const classId = Number(id);

    const currentUserId = useSelector((state: RootState) => state.user.currentUser?.id);

    const [clazz, setClazz] = useState<Clazz | null>(null);
    const [members, setMembers] = useState<ClassUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [leaving, setLeaving] = useState(false);
    const [joined, setJoined] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchClassDetail = async () => {
        try {
            setLoading(true);
            const data = await ClassService.getClassById(classId);
            setClazz(data);

            const membersData = await ClassService.getMembersByClassId(classId);
            setMembers(membersData);

            if (currentUserId) {
                const isJoined = membersData.some((m) => m.id === currentUserId);
                setJoined(isJoined);
            } else {
                setJoined(false);
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể tải dữ liệu lớp.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId && currentUserId !== undefined) fetchClassDetail();
    }, [classId, currentUserId]);

    const handleLeaveClass = () => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn rời lớp này?",
            onOk: async () => {
                try {
                    setLeaving(true);
                    await ClassService.leaveClass(classId);
                    message.success("Bạn đã rời lớp thành công.");
                    setJoined(false);
                    fetchClassDetail();
                } catch (error) {
                    console.error(error);
                    message.error("Rời lớp thất bại.");
                } finally {
                    setLeaving(false);
                }
            },
        });
    };

    const memberColumns = [
        {
            title: "Ảnh đại diện",
            dataIndex: "profileImageUrl",
            key: "profileImageUrl",
            render: (text: string) => {
                const src = text && text.startsWith("http") ? text : (text ? `${backendUrl}${text}` : null);

                return src ? (
                    <Avatar src={src} size={80} />
                ) : (
                    <Avatar icon={<UserOutlined />} size={80} />
                )
            }
        },
        {
            title: "Tên",
            dataIndex: "fullName",
            key: "name",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
    ];

    if (loading) return <Spin size="large" className={styles.spinCenter} />;

    if (!clazz) return <p>Lớp không tồn tại hoặc đã bị xóa.</p>;

    return (
        <div className={styles.container}>

            <div className={styles.classDetailSection}>
                <Title level={2}>Tên lớp: {clazz.name}</Title>
                <p><b>Mã số lớp:</b> {clazz.id}</p>
                <p><b>Giáo viên:</b> {clazz.teacher.fullName} ({clazz.teacher.email})</p>
            </div>
            <Card title="Thông báo" className={styles.announcementsSection}>
                {clazz.announcements.length === 0 ? (
                    <p>Chưa có thông báo nào.</p>
                ) : (
                    <List
                        dataSource={clazz.announcements}
                        renderItem={(item: Announcement) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.title}
                                    description={
                                        <>
                                            <p>Ngày: {new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>
                                            <div>{item.content}</div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Card title="Danh sách thành viên" className={styles.membersSection} style={{ marginTop: 20 }}>
                <Table
                    dataSource={members}
                    columns={memberColumns}
                    rowKey={(record) => record.id}
                    pagination={false}
                    size="small"
                />
            </Card>

            <div style={{ marginTop: 24 }}>
                {joined ? (
                    <Button danger loading={leaving} onClick={handleLeaveClass}>
                        Rời lớp
                    </Button>
                ) : (
                    <Button type="primary" disabled>
                        Chưa tham gia lớp (thao tác tham gia ở trang khác)
                    </Button>
                )}
            </div>
        </div>
    );

};

export default ClassDetailPage;
