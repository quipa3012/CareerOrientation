import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
    fetchMajors,
    fetchMajorsByBlock,
} from "../../stores/MajorSlice";
import { majorService } from "../../services/MajorService";
import type { Block } from "../../interfaces/MajorInterface";
import { Table, Select, Typography, Spin, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./MajorListPage.module.scss";

const { Title } = Typography;
const { Option } = Select;

const MajorListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { majors, loading } = useAppSelector(state => state.major);
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        dispatch(fetchMajors());
        majorService.getAllBlocks().then(setBlocks).catch(() => { });
    }, [dispatch]);


    const handleBlockFilter = (blockId: number | undefined) => {
        if (blockId) dispatch(fetchMajorsByBlock(blockId));
        else dispatch(fetchMajors());
    };

    const columns = [
        {
            title: "Mã ngành",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Tên ngành",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Khối",
            dataIndex: ["block", "name"],
            key: "block",
        },
        {
            title: "Chi tiết",
            key: "action",
            render: (_: any, record: any) => (
                <Button type="link" onClick={() => navigate(`/majors/${record.id}`)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>
            <Title level={3}>Danh sách ngành học</Title>

            <Select
                allowClear
                placeholder="Lọc theo khối"
                style={{ width: 250, marginBottom: 16 }}
                onChange={handleBlockFilter}
            >
                {blocks.map(block => (
                    <Option key={block.id} value={block.id}>
                        {block.name}
                    </Option>
                ))}
            </Select>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    rowKey="id"
                    dataSource={majors}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default MajorListPage;
