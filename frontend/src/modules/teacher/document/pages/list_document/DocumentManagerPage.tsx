import React, { useEffect, useState } from "react";
import { Button, Table, Space, Modal, message, Popconfirm, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../../store/store";
import {
    fetchAllDocuments,
    deleteDocument,
} from "../../stores/DocumentManagerSlice";
import type { DocumentResponse, DocumentCreateRequest } from "../../interfaces/DocumentManagerInterface";
import styles from "./DocumentManagerPage.module.scss";
import { useNavigate } from "react-router-dom";
import { DocumentManagerService } from "../../services/DocumentManagerService";

const { TextArea } = Input;

const DocumentManagerPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { documents, loading } = useSelector((state: RootState) => state.documents);
    const navigate = useNavigate();
    const currentUserId = useSelector((state: RootState) => state.user.currentUser?.id);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDocument, setEditingDocument] = useState<DocumentResponse | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredDocuments, setFilteredDocuments] = useState<DocumentResponse[]>([]);

    useEffect(() => {
        dispatch(fetchAllDocuments());
    }, [dispatch]);

    useEffect(() => {
        setFilteredDocuments(documents);
    }, [documents]);

    const handleSearch = async () => {
        if (!searchKeyword) {
            setFilteredDocuments(documents);
            return;
        }
        try {
            const results = await DocumentManagerService.searchDocuments({ keyword: searchKeyword });
            setFilteredDocuments(results);
        } catch (err) {
            message.error("Tìm kiếm thất bại");
        }
    };

    const handleAdd = () => {
        setEditingDocument(null);
        setFileList([]);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: DocumentResponse) => {
        setEditingDocument(record);
        setFileList([]);
        form.setFieldsValue({
            title: record.title,
            description: record.description,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteDocument(id)).unwrap();
            message.success("Xóa tài liệu thành công");
        } catch (error: any) {
            message.error(error || "Xóa thất bại");
        }
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            const payload: DocumentCreateRequest = {
                title: values.title,
                description: values.description,
                file: fileList[0]?.originFileObj,
                userId: currentUserId || 1,
            };

            if (editingDocument) {
                await DocumentManagerService.updateDocument(editingDocument.id, payload);
                message.success("Cập nhật tài liệu thành công");
            } else {
                await DocumentManagerService.uploadDocument(payload);
                message.success("Thêm tài liệu thành công");
            }

            setIsModalVisible(false);
            dispatch(fetchAllDocuments());
        } catch (err: any) {
            console.error(err);
            message.error("Có lỗi xảy ra. Vui lòng kiểm tra lại");
        } finally {
            setSubmitting(false);
        }
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isPdf = file.type === "application/pdf";
            if (!isPdf) message.error("Chỉ cho phép file PDF");
            return false; // prevent auto upload
        },
        onRemove: () => setFileList([]),
        fileList,
        onChange: (info: any) => setFileList(info.fileList),
    };

    const columns = [
        { title: "ID", dataIndex: "id", width: 70 },
        { title: "Tiêu đề", dataIndex: "title" },
        { title: "Mô tả", dataIndex: "description", ellipsis: true },
        { title: "Ngày tạo", dataIndex: "updatedAt", render: (text: string) => new Date(text).toLocaleDateString() },
        { title: "Người tạo", dataIndex: "updatedBy", render: (text: string) => text || "Không xác định" },
        {
            title: "File",
            dataIndex: "fileUrl",
            render: (_: string, record: DocumentResponse) =>
                record.fileUrl ? (
                    <Button type="link" onClick={() => navigate(`${record.id}`)}>
                        Xem tài liệu
                    </Button>
                ) : "Không có",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: DocumentResponse) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <h2>Quản lý tài liệu</h2>
                <Input
                    placeholder="Tìm kiếm tài liệu theo tiêu đề..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: 300 }}
                />
                <Button onClick={handleSearch}>Tìm kiếm</Button>
                <Button type="primary" onClick={handleAdd}>+ Thêm tài liệu</Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredDocuments}
                loading={loading}
                bordered
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingDocument ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleModalSubmit}
                confirmLoading={submitting}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="File PDF" required>
                        <Upload {...uploadProps} accept=".pdf" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                        </Upload>
                        {editingDocument && !fileList.length && (
                            <p>File hiện tại: {editingDocument.fileUrl.split("/").pop()}</p>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DocumentManagerPage;
