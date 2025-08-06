import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
    fetchAllUsers,
    deleteUserAdmin,
} from "../../stores/UserManagerSlice";
import type { UserResponse } from "../../interfaces/UserManagerInterface";
import styles from "./UserManagerPage.module.scss";
import { Button, Input, Select, Table, Popconfirm, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function UserManagerPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { users, loading } = useAppSelector((state) => state.userManager);

    const [searchText, setSearchText] = useState("");
    const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            if (user.roleName.toLowerCase() === "admin") return false;
            const matchesRole = filterRole ? user.roleName === filterRole : true;
            const matchesSearch =
                user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                user.username.toLowerCase().includes(searchText.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [users, searchText, filterRole]);

    const handleDelete = (id: number) => {
        dispatch(deleteUserAdmin(id));
    };

    const columns = [
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Quyền",
            dataIndex: "roleName",
            key: "roleName",
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: UserResponse) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/${record.id}`)}
                    >
                        Xem
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xoá người dùng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                    >
                        <Button danger icon={<DeleteOutlined />}>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <Input.Search
                    placeholder="Tìm theo tên hoặc username"
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.search}
                />

                <Select
                    allowClear
                    placeholder="Lọc theo quyền"
                    onChange={(value) => setFilterRole(value)}
                    className={styles.select}
                >
                    <Option value="STUDENT">Học sinh</Option>
                    <Option value="TEACHER">Giáo viên</Option>
                </Select>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/users/add-teacher")}
                >
                    Thêm giáo viên
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredUsers}
                loading={loading}
                bordered
            />
        </div>
    );
}
