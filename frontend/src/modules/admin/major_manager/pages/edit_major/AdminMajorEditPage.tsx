import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { majorManagerService } from "../../services/MajorManagerService";
import type { Block, MajorManagerRequest, MajorManager } from "../../interfaces/MajorManagerInterface";
import Editor from "../../../../../components/editer/Editor";

const { Title } = Typography;
const { Option } = Select;

const AdminMajorEditPage = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [form] = Form.useForm();
    const { id } = useParams(); // lấy id ngành từ URL
    const navigate = useNavigate();

    useEffect(() => {
        // Load danh sách khối
        majorManagerService.getAllBlocks()
            .then(setBlocks)
            .catch(() => {
                message.error("Không thể tải danh sách khối.");
            });

        // Load dữ liệu ngành cần sửa
        if (id) {
            majorManagerService.getById(Number(id))
                .then((data: MajorManager) => {
                    form.setFieldsValue({
                        code: data.code,
                        name: data.name,
                        blockId: data.block.id,
                        description: data.description
                    });
                })
                .catch(() => {
                    message.error("Không thể tải dữ liệu ngành.");
                });
        }
    }, [id]);

    const handleSubmit = async (values: MajorManagerRequest) => {
        try {
            await majorManagerService.update(Number(id), values);
            message.success("Cập nhật ngành thành công");
            navigate("/admin/majors");
        } catch (error) {
            message.error("Lỗi khi cập nhật ngành");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Chỉnh sửa ngành học</Title>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
            >
                <Form.Item label="Mã ngành" name="code" rules={[{ required: true, message: "Bắt buộc" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Tên ngành" name="name" rules={[{ required: true, message: "Bắt buộc" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Khối" name="blockId" rules={[{ required: true, message: "Bắt buộc" }]}>
                    <Select placeholder="Chọn khối">
                        {blocks.map(block => (
                            <Option key={block.id} value={block.id}>{block.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item shouldUpdate>
                    {() => (
                        <Form.Item label="Mô tả" name="description" noStyle>
                            <Editor
                                value={form.getFieldValue("description") || ""}
                                onChange={(value: string) => form.setFieldsValue({ description: value })}
                            />
                        </Form.Item>
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminMajorEditPage;
