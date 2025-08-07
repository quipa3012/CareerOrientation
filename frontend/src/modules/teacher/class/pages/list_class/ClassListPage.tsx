import { useEffect } from "react";
import { Button, Card, Col, Row, Spin, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { fetchMyClasses } from "../../stores/ClassManagerSlice";
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
                                onClick={() => {
                                    navigate(`${clazz.id}`);
                                }}
                            >
                                <p>ID: {clazz.id}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ClassListPage;
