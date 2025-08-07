import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, List, Modal, Table, Typography, Form, Input, message, Spin, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ClassManagerService } from "../../services/ClassManagerService";
import type { Clazz, ClassUser, Announcement } from "../../interfaces/ClassManagerInterface";
import styles from "./ClassDetailPage.module.scss";

const { Title } = Typography;

const ClassDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const classId = Number(id);

    const [clazz, setClazz] = useState<Clazz | null>(null);
    const [members, setMembers] = useState<ClassUser[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState<Announcement | null>(null);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [classData, membersData, announcementsData] = await Promise.all([
                ClassManagerService.getClassById(classId),
                ClassManagerService.getUsersInClass(classId),
                ClassManagerService.getAnnouncementsByClass(classId),
            ]);
            setClazz(classData);
            setMembers(membersData);
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải dữ liệu lớp.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) fetchData();
    }, [classId]);

    const handleAddAnnouncement = async () => {
        try {
            const values = await form.validateFields();
            await ClassManagerService.createAnnouncement(classId, values);
            message.success("Thêm thông báo thành công!");
            setIsAddModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Thêm thông báo thất bại.");
        }
    };

    const handleEditAnnouncement = async () => {
        try {
            if (!currentEdit) return;
            const values = await editForm.validateFields();
            await ClassManagerService.updateAnnouncement(currentEdit.id, values);
            message.success("Cập nhật thông báo thành công!");
            setIsEditModalOpen(false);
            setCurrentEdit(null);
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Cập nhật thông báo thất bại.");
        }
    };

    const handleDeleteAnnouncement = async (id: number) => {
        try {
            await ClassManagerService.deleteAnnouncement(id);
            message.success("Xóa thông báo thành công!");
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Xóa thông báo thất bại.");
        }
    };

    const memberColumns = [
        {
            title: "Tên",
            dataIndex: ["user", "fullName"],
            key: "name",
        },
        {
            title: "Username",
            dataIndex: ["user", "username"],
            key: "username",
        },
        {
            title: "Vai trò",
            dataIndex: "teacher",
            key: "role",
            render: (isTeacher: boolean) => (isTeacher ? "Giáo viên" : "Học viên"),
        },
    ];

    return (
        <div className={styles.classDetailContainer}>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>


                    <Card
                        title="Bảng thông báo"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                                Thêm thông báo
                            </Button>
                        }
                    >
                        <List
                            dataSource={announcements}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="link"
                                            icon={<EditOutlined />}
                                            onClick={() => {
                                                setCurrentEdit(item);
                                                editForm.setFieldsValue({
                                                    title: item.title,
                                                    content: item.content,
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </Button>,
                                        <Popconfirm
                                            title="Bạn có chắc muốn xóa thông báo này?"
                                            onConfirm={() => handleDeleteAnnouncement(item.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <Button type="link" danger icon={<DeleteOutlined />}>
                                                Xóa
                                            </Button>
                                        </Popconfirm>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <div className={styles.announcementTitle}>
                                                {item.title}
                                                <br />
                                                <span className={styles.announcementDate}>
                                                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        }
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Title level={3}>Chi tiết lớp: {clazz?.name}</Title>
                    <p>ID lớp: {clazz?.id}</p>

                    <Card title="Danh sách thành viên" style={{ marginBottom: 20 }}>
                        <Table
                            dataSource={members}
                            columns={memberColumns}
                            rowKey={(record) => record.user.id}
                            pagination={false}
                        />
                    </Card>

                    <Modal
                        title="Thêm thông báo mới"
                        open={isAddModalOpen}
                        onCancel={() => setIsAddModalOpen(false)}
                        onOk={handleAddAnnouncement}
                        okText="Thêm"
                        cancelText="Hủy"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Nội dung"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Modal chỉnh sửa */}
                    <Modal
                        title="Chỉnh sửa thông báo"
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        onOk={handleEditAnnouncement}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={editForm} layout="vertical">
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Nội dung"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ClassDetailPage;
