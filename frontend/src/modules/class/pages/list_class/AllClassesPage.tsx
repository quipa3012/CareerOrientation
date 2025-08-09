import { useEffect, useState } from "react";
import {
    Input,
    Select,
    Card,
    Row,
    Col,
    Spin,
    Empty,
    Button,
    Modal,
    message
} from "antd";
import styles from "./AllClassesPage.module.scss";
import type { Clazz } from "../../interfaces/ClassInterface";
import { ClassService } from "../../services/ClassService";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const AllClassesPage = () => {
    const [classes, setClasses] = useState<(Clazz & { joined?: boolean })[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<"all" | "mine">("all");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [joinPassword, setJoinPassword] = useState("");
    const [selectedClass, setSelectedClass] = useState<Clazz | null>(null);

    useEffect(() => {
        loadClasses();
    }, [filter]);

    const loadClasses = async () => {
        setLoading(true);
        try {
            if (filter === "mine") {
                const mine = await ClassService.getMyClasses();
                setClasses(mine.map(c => ({ ...c, joined: true })));
            } else {
                const all = await ClassService.getAllClasses();
                const mine = await ClassService.getMyClasses();
                const myIds = new Set(mine.map(c => c.id));

                const merged = all.map(c => ({
                    ...c,
                    joined: myIds.has(c.id)
                }));

                setClasses(merged);
            }
        } catch (err) {
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleJoinClick = (clazz: Clazz) => {
        setSelectedClass(clazz);
        setJoinPassword("");
        setJoinModalVisible(true);
    };

    const handleConfirmJoin = async () => {
        if (!selectedClass) return;
        try {
            await ClassService.joinClass(selectedClass.id, joinPassword);
            message.success(`Đã tham gia lớp ${selectedClass.name}`);
            setJoinModalVisible(false);
            loadClasses();
        } catch (err) {
            message.error("Mật khẩu không đúng hoặc có lỗi xảy ra");
        }
    };

    const handleLeaveClick = (clazz: Clazz) => {
        Modal.confirm({
            title: "Xác nhận rời lớp",
            content: `Bạn có chắc muốn rời lớp "${clazz.name}" không?`,
            okText: "Rời lớp",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    await ClassService.leaveClass(clazz.id);
                    message.success(`Đã rời lớp ${clazz.name}`);
                    loadClasses();
                } catch (err) {
                    message.error("Không thể rời lớp");
                }
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Search
                    placeholder="Tìm kiếm lớp..."
                    allowClear
                    onSearch={value => setSearch(value)}
                    style={{ width: 300, marginRight: 16 }}
                />
                <Select
                    value={filter}
                    onChange={value => setFilter(value)}
                    style={{ width: 200 }}
                >
                    <Option value="all">Tất cả lớp</Option>
                    <Option value="mine">Lớp của tôi</Option>
                </Select>
            </div>

            {loading ? (
                <Spin />
            ) : filteredClasses.length === 0 ? (
                <Empty description="Không có lớp nào" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredClasses.map(clazz => (
                        <Col xs={24} sm={12} md={8} lg={6} key={clazz.id}>
                            <Card
                                title={clazz.name}
                                hoverable
                                onClick={() => navigate(`${clazz.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <p><strong>Giáo viên:</strong> {clazz.teacher?.fullName}</p>
                                <p><strong>Email GV:</strong> {clazz.teacher?.email}</p>
                                <p><strong>Số thông báo:</strong> {clazz.announcements?.length || 0}</p>
                                <p><strong>Mã lớp:</strong> {clazz.id}</p>

                                {clazz.joined ? (
                                    <Button danger block onClick={(e) => { e.stopPropagation(); handleLeaveClick(clazz); }}>
                                        Rời lớp
                                    </Button>
                                ) : (
                                    <Button type="primary" block onClick={(e) => { e.stopPropagation(); handleJoinClick(clazz); }}>
                                        Tham gia
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title={`Tham gia lớp "${selectedClass?.name}"`}
                open={joinModalVisible}
                onCancel={() => setJoinModalVisible(false)}
                onOk={handleConfirmJoin}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                {selectedClass && (
                    <>
                        <p><strong>Giáo viên:</strong> {selectedClass.teacher?.fullName}</p>
                        <p><strong>Email:</strong> {selectedClass.teacher?.email}</p>
                        <p><strong>Số thông báo:</strong> {selectedClass.announcements?.length || 0}</p>
                    </>
                )}
                <Input.Password
                    placeholder="Mật khẩu lớp"
                    value={joinPassword}
                    onChange={e => setJoinPassword(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default AllClassesPage;
