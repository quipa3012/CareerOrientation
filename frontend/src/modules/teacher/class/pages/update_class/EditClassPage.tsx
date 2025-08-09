import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateClass } from "../../stores/ClassManagerSlice";
import { ClassManagerService } from "../../services/ClassManagerService";
import { Form, Input, Button, Spin, message } from "antd";
import styles from "./EditClassPage.module.scss";

const EditClassPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loadingData, setLoadingData] = useState(true);
    const { loading, error } = useAppSelector((state) => state.classManager);

    // Load dữ liệu ban đầu
    useEffect(() => {
        if (!id) return;
        ClassManagerService.getClassById(Number(id))
            .then((clazz) => {
                form.setFieldsValue({
                    name: clazz.name,
                    password: "" // không load pass cũ
                });
            })
            .finally(() => setLoadingData(false));
    }, [id, form]);

    const handleSubmit = async (values: { name: string; password?: string }) => {
        if (!id) return;

        const payload = {
            id: Number(id),
            data: {
                name: values.name,
                password: values.password || undefined
            }
        };

        const result = await dispatch(updateClass(payload));
        if (updateClass.fulfilled.match(result)) {
            message.success("Cập nhật lớp thành công!");
            navigate("/teacher/classes");
        }
    };

    if (loadingData) {
        return (
            <div className={styles.loading}>
                <Spin tip="Đang tải dữ liệu lớp..." />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Chỉnh sửa thông tin lớp</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item
                    label="Tên lớp"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
                >
                    <Input placeholder="Nhập tên lớp" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                        { min: 4, message: "Mật khẩu phải từ 4 ký tự trở lên" }
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới (bỏ trống nếu không đổi)" />
                </Form.Item>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.actions}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className={styles.btn}
                    >
                        Lưu thay đổi
                    </Button>
                    <Button
                        onClick={() => navigate("/teacher/classes")}
                        className={styles.btnSecondary}
                    >
                        Hủy
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditClassPage;
