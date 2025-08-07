import { useEffect, useState } from "react";
import { Form, Input, Button, Typography, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../../store/hooks";
import { updateQuestion } from "../../stores/QuestionSlice";
import { QuestionService } from "../../services/QuestionService";
import type { Question } from "../../interfaces/QuestionInterface";
import styles from "./AdminQuestionEditPage.module.scss";

const { Title } = Typography;

const AdminQuestionEditPage = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const questionId = Number(id);

    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await QuestionService.getById(questionId);
                setQuestion(data);
            } catch (err) {
                message.error("Không tìm thấy câu hỏi.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    useEffect(() => {
        if (question) {
            form.setFieldsValue({
                content: question.content,
            });
        }
    }, [question, form]);


    const handleSubmit = async (values: { content: string }) => {
        try {
            await dispatch(updateQuestion({ id: questionId, content: values.content })).unwrap();
            message.success("Cập nhật thành công!");
            navigate("/admin/questions");
        } catch (err) {
            message.error("Cập nhật thất bại!");
        }
    };


    if (loading) return <Spin size="large" />;

    if (!question) {
        return <p>Không tìm thấy câu hỏi với ID: {questionId}</p>;
    }

    return (
        <div className={styles.wrapper}>
            <Title level={3}>Chỉnh sửa nội dung câu hỏi</Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item label="Mã câu hỏi">
                    <Input value={question.code} disabled />
                </Form.Item>

                <Form.Item
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Danh mục">
                    <Input value={question.category} disabled />
                </Form.Item>

                <Form.Item>
                    <div className={styles.actions}>
                        <Button type="default" onClick={() => navigate("/admin/questions")}>
                            Quay lại
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminQuestionEditPage;
