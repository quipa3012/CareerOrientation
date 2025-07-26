import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchMajorById, clearSelectedMajor } from "../../stores/MajorSlice";
import { Typography, Spin, Card } from "antd";
import styles from "./MajorDetailPage.module.scss";

const { Title } = Typography;

const MajorDetailPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { selectedMajor: major, loading } = useAppSelector(state => state.major);

    useEffect(() => {
        if (id) dispatch(fetchMajorById(+id));
        return () => {
            dispatch(clearSelectedMajor());
        };
    }, [dispatch, id]);

    if (loading || !major) return <Spin />;

    return (
        <div className={styles.wrapper}>
            <Card>
                <Title level={2}>{major.name}</Title>
                <p><strong>Mã ngành:</strong> {major.code}</p>
                <p><strong>Khối:</strong> {major.block.name}</p>

                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: major.description }}
                />
            </Card>
        </div>
    );
};

export default MajorDetailPage;
