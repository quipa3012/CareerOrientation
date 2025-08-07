// 📁 src/modules/admin/question_manager/pages/AdminQuestionListPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Table, Typography, Button, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { fetchQuestions } from "../../stores/QuestionSlice";
import type { Question } from "../../interfaces/QuestionInterface";
import styles from "./AdminQuestionListPage.module.scss";

const { Title } = Typography;
const { Option } = Select;

const AdminQuestionListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { questions, loading } = useAppSelector((state) => state.questions);
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);

    const filteredQuestions = useMemo(() => {
        if (!categoryFilter) return questions;
        return questions.filter((q) => q.category === categoryFilter);
    }, [questions, categoryFilter]);

    const uniqueCategories = useMemo(() => {
        const categories = questions.map((q) => q.category);
        return Array.from(new Set(categories));
    }, [questions]);

    const columns = [
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: Question) => (
                <div className={styles.actionsButtons}>
                    <Button type="default" onClick={() => navigate(`/admin/questions/edit/${record.id}`)}>
                        Sửa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>
            <Title level={3}>Quản lý câu hỏi</Title>

            <div className={styles.actions}>
                <Select
                    allowClear
                    placeholder="Lọc theo danh mục"
                    style={{ width: 250 }}
                    onChange={(value) => setCategoryFilter(value)}
                >
                    {uniqueCategories.map((cat) => (
                        <Option key={cat} value={cat}>
                            {cat}
                        </Option>
                    ))}
                </Select>
            </div>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    rowKey="id"
                    dataSource={filteredQuestions}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default AdminQuestionListPage;
