import { Button, Form, Input, Select, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { majorManagerService } from "../../services/MajorManagerService";
import type { Block } from "../../interfaces/MajorManagerInterface";
import Editor from "../../../../../components/editer/Editor";
import styles from "./AdminMajorCreatePage.module.scss";

const { Title } = Typography;
const { Option } = Select;

const AdminMajorCreatePage = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        majorManagerService.getAllBlocks().then(setBlocks).catch(() => {
            message.error("Không thể tải danh sách khối.");
        });
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            await majorManagerService.create(values);
            message.success("Thêm ngành thành công");
            navigate("/admin/majors");
        } catch (error) {
            message.error("Lỗi khi thêm ngành");
        }
    };

    return (

        <div className={styles.page}>
            <div className={styles.page__container}>
                <Title className={styles.page__title} level={3}>Thêm ngành học</Title>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{
                        code: "",
                        name: "",
                        blockId: undefined,
                        description: "",
                    }}
                >
                    <Form.Item
                        label="Mã ngành"
                        name="code"
                        rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên ngành"
                        name="name"
                        rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Khối"
                        name="blockId"
                        rules={[{ required: true, message: "Bắt buộc" }]}
                    >
                        <Select placeholder="Chọn khối">
                            {blocks.map((block) => (
                                <Option key={block.id} value={block.id}>
                                    {block.name}
                                </Option>
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
                        <Button type="primary" htmlType="submit">
                            Thêm ngành
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>

    );
};

export default AdminMajorCreatePage;