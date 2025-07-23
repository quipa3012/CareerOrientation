import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { fetchQuestions, submitTest } from "../../stores/TestSlice";
import { Card, Button, Form, Radio, Spin, message, Modal, Progress } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import styles from "./QuestionPage.module.scss";

const LOCAL_STORAGE_KEY = "career_test_answers";

const QuestionPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { questions, loading } = useSelector((state: RootState) => state.test);
    const user = useSelector((state: RootState) => state.user.currentUser);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [currentGroup, setCurrentGroup] = useState<string>("R");
    const [savedAnswers, setSavedAnswers] = useState<Record<string, number>>({});

    const groupKeys = ["R", "I", "A", "S", "E", "C", "TIPI", "Other"];

    // Group các câu hỏi
    const groupedQuestions: Record<string, typeof questions> = groupKeys.reduce(
        (acc, key) => ({ ...acc, [key]: [] }),
        {}
    );
    questions.forEach((q) => {
        const prefix = q.code.match(/[A-Z]+/)?.[0] || "Other";
        groupedQuestions[prefix]?.push(q);
    });

    // Tính phần trăm hoàn thành
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(savedAnswers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    const modalShownRef = useRef(false); // ✅ Flag không bị reset khi re-render

    useEffect(() => {
        dispatch(fetchQuestions()).then(() => {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored && !modalShownRef.current) {
                modalShownRef.current = true; // ✅ Đánh dấu đã show modal
                const parsed = JSON.parse(stored);

                Modal.confirm({
                    title: "Bạn có muốn tiếp tục bài test trước đó?",
                    content: `Đã trả lời ${Object.keys(parsed).length}/${questions.length} câu.`,
                    okText: "Tiếp tục",
                    cancelText: "Làm mới",
                    onOk() {
                        setSavedAnswers(parsed);
                        form.setFieldsValue(parsed);
                        message.info("Đã load dữ liệu bài test trước đó.");
                    },
                    onCancel() {
                        localStorage.removeItem(LOCAL_STORAGE_KEY);
                        form.resetFields();
                        setSavedAnswers({});
                        message.success("Bắt đầu bài test mới.");
                    }
                });
            }
        });
    }, [dispatch, form]);



    /** 💾 Auto save với debounce (500ms) */
    const debounceSave = useCallback(
        (() => {
            let timeout: ReturnType<typeof setTimeout>;
            return (data: Record<string, number>) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                }, 500);
            };
        })(),
        []
    );

    /** 📝 Handle form value change */
    const handleValueChange = (
        changedValues: Record<string, number>,
    ) => {
        const mergedValues = { ...savedAnswers, ...changedValues }; // giữ dữ liệu cũ
        setSavedAnswers(mergedValues);
        debounceSave(mergedValues); // save localStorage
    };

    /** 🔄 Handle chuyển group */
    const handleGroupChange = (newGroup: string) => {
        setCurrentGroup(newGroup);
        form.setFieldsValue(savedAnswers); // fill lại các câu đã trả lời
    };

    /** 🚀 Submit form */
    const handleSubmit = async () => {
        if (!user) {
            message.error("Bạn cần đăng nhập trước khi làm bài test");
            return;
        }

        try {
            const currentValues = form.getFieldsValue(); // chỉ lấy các field hiện tại
            const fullAnswers = { ...savedAnswers, ...currentValues }; // merge tất cả

            // Validate: check còn câu nào chưa trả lời không
            const unanswered = questions.filter((q) => !(q.code in fullAnswers));
            if (unanswered.length > 0) {
                message.error(`⚠️ Bạn còn ${unanswered.length} câu chưa trả lời.`);
                return;
            }

            const payload = { answers: fullAnswers };

            await dispatch(
                submitTest({
                    userId: user.id,
                    request: payload
                })
            );

            form.resetFields();
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setSavedAnswers({});
            setCurrentGroup(groupKeys[0]);
            navigate("/test/result");
        } catch (err) {
            message.error("❌ Gửi bài test thất bại!");
        }
    };


    if (loading) return <Spin tip="Đang tải câu hỏi..." > </Spin>;

    return (
        <Card
            title="Bài Test Định Hướng Nghề Nghiệp"
            className={styles.card}
        >
            <Progress
                percent={progressPercent}
                status="active"
                style={{ marginBottom: 16 }}
            />
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValueChange}
                preserve={true}
                className={styles.form}
            >
                {groupedQuestions[currentGroup]?.map((q) => (
                    <Form.Item
                        key={q.code}
                        label={`${q.code}: ${q.content}`}
                        name={q.code}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng chọn 1 đáp án" }
                        ]}
                        className={styles.question}
                    >
                        <Radio.Group className={styles.radioGroup}>
                            {(() => {
                                const prefix = q.code.match(/[A-Z]+/)?.[0];
                                let options: { value: number, label: string }[] = [];

                                if (["R", "I", "A", "S", "E", "C"].includes(prefix || "")) {
                                    // RIASEC: 1–5
                                    options = [
                                        { value: 1, label: "Không thích" },
                                        { value: 2, label: "Hơi không thích" },
                                        { value: 3, label: "Bình thường" },
                                        { value: 4, label: "Hơi thích" },
                                        { value: 5, label: "Rất thích" },
                                    ];
                                } else if (prefix === "TIPI") {
                                    // TIPI: 1–7
                                    options = [
                                        { value: 1, label: "Hoàn toàn không đồng ý" },
                                        { value: 2, label: "Không đồng ý nhiều" },
                                        { value: 3, label: "Hơi không đồng ý" },
                                        { value: 4, label: "Trung lập" },
                                        { value: 5, label: "Hơi đồng ý" },
                                        { value: 6, label: "Đồng ý nhiều" },
                                        { value: 7, label: "Hoàn toàn đồng ý" },
                                    ];
                                } else if (q.code === "gender") {
                                    // gender: 1–3
                                    options = [
                                        { value: 1, label: "Nam" },
                                        { value: 2, label: "Nữ" },
                                        { value: 3, label: "Khác" },
                                    ];
                                } else if (q.code === "urban") {
                                    // urban: 1–3
                                    options = [
                                        { value: 1, label: "Nông thôn" },
                                        { value: 2, label: "Ngoại ô" },
                                        { value: 3, label: "Thành thị" },
                                    ];
                                }

                                return options.map((opt) => (
                                    <Radio.Button
                                        key={opt.value}
                                        value={opt.value}
                                        className={styles.radioBtn}
                                    >
                                        {opt.label || opt.value}
                                    </Radio.Button>
                                ));
                            })()}
                        </Radio.Group>
                    </Form.Item>

                ))}

                <div className={styles.buttonGroup}>
                    <Button
                        disabled={currentGroup === groupKeys[0]}
                        onClick={() =>
                            handleGroupChange(
                                groupKeys[groupKeys.indexOf(currentGroup) - 1]
                            )
                        }
                    >
                        <ArrowLeftOutlined /> Trước
                    </Button>

                    {currentGroup === groupKeys[groupKeys.length - 1] ? (
                        <Button type="primary" onClick={handleSubmit}>
                            Gửi Bài Test <SendOutlined />
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() =>
                                handleGroupChange(
                                    groupKeys[groupKeys.indexOf(currentGroup) + 1]
                                )
                            }
                        >
                            Tiếp <ArrowRightOutlined />
                        </Button>
                    )}
                </div>
            </Form>
        </Card>
    );
};

export default QuestionPage;
