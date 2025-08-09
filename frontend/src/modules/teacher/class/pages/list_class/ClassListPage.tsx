import { useEffect } from "react";
import { Button, Card, Col, Row, Spin, Typography, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { fetchMyClasses, deleteClass } from "../../stores/ClassManagerSlice";
import styles from "./ClassListPage.module.scss";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ClassListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { classes, loading } = useAppSelector((state) => state.classManager);

    useEffect(() => {
        dispatch(fetchMyClasses());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteClass(id)).unwrap();
            message.success("Xóa lớp thành công");
        } catch (error) {
            message.error("Xóa lớp thất bại");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title level={3}>Danh sách lớp bạn quản lý</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("add")}
                >
                    Thêm lớp
                </Button>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {classes.map((clazz) => (
                        <Col span={6} key={clazz.id}>
                            <Card
                                title={clazz.name}
                                hoverable
                                onClick={() => navigate(`${clazz.id}`)}
                                actions={[
                                    <EditOutlined
                                        key="edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`edit/${clazz.id}`);
                                        }}
                                    />,
                                    <Popconfirm
                                        key="delete"
                                        title="Bạn có chắc muốn xóa lớp này?"
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            handleDelete(clazz.id);
                                        }}
                                        onCancel={(e) => e?.stopPropagation()}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <DeleteOutlined
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Popconfirm>,
                                ]}
                            >
                                <p>Mã số lớp học: {clazz.id}</p>
                                <p>Mật khẩu lớp: {clazz.password}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ClassListPage;
