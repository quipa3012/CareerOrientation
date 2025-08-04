import { useEffect, useState } from "react";
import { Table, Button, Typography, Spin, Popconfirm, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
    fetchMajors,
    fetchMajorsByBlock,
    deleteMajor
} from "../../stores/MajorManagerSlice";
import { majorManagerService } from "../../services/MajorManagerService";
import type { Block } from "../../interfaces/MajorManagerInterface";
import styles from "./AdminMajorListPage.module.scss";

const { Title } = Typography;
const { Option } = Select;

const AdminMajorListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { majors, loading } = useAppSelector(state => state.major);
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        dispatch(fetchMajors());
        majorManagerService.getAllBlocks().then(setBlocks).catch(() => { });
    }, [dispatch]);

    const handleBlockFilter = (blockId: number | undefined) => {
        if (blockId) dispatch(fetchMajorsByBlock(blockId));
        else dispatch(fetchMajors());
    };

    const handleDelete = (id: number) => {
        dispatch(deleteMajor(id));
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
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <>
                    <Button type="link" onClick={() => navigate(`/admin/majors/edit/${record.id}`)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xoá ngành?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                    >
                        <Button danger type="link">Xoá</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>
            <Title level={3}>Quản lý ngành học</Title>

            <div className={styles.actions}>
                <Select
                    allowClear
                    placeholder="Lọc theo khối"
                    style={{ width: 250 }}
                    onChange={handleBlockFilter}
                >
                    {blocks.map(block => (
                        <Option key={block.id} value={block.id}>{block.name}</Option>
                    ))}
                </Select>
                <Button type="primary" onClick={() => navigate("/admin/majors/create")}>Thêm ngành</Button>
            </div>

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

export default AdminMajorListPage;