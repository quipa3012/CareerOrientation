import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    ReadOutlined,
    BookOutlined
} from "@ant-design/icons";
import styles from "./TeacherHeader.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../modules/auth/stores/AuthSlice";
import type { AppDispatch } from "../../store/store";

const { Header: AntHeader } = Layout;

const TeacherHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const { accessToken } = useSelector((state: any) => state.auth);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    const avatarSrc = useMemo(() => {
        const url = currentUser?.profileImageUrl;
        if (!url) return undefined;
        return url.startsWith("http") ? url : `${backendUrl}${url}`;
    }, [currentUser?.profileImageUrl, backendUrl]);

    const handleLogout = async () => {
        try {
            await dispatch(logout(accessToken));
            message.success("Đã đăng xuất");
            navigate("/auth/login");
        } catch (err) {
            message.error("Đăng xuất thất bại");
        }
    };

    const userMenu = {
        items: [
            {
                key: "profile",
                icon: <UserOutlined />,
                label: <Link to="/user/me">Tài Khoản</Link>,
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span onClick={handleLogout}>Đăng xuất</span>,
            },
        ],
    };

    const teacherMenuItems = [
        {
            key: "logo",
            label: (
                <Link to="/teacher/classes">
                    <div className={styles.logo}>Teacher Panel</div>
                </Link>
            ),
        },
        {
            key: "home",
            icon: <HomeOutlined />,
            label: <Link to="/">Trang Chủ</Link>,
        },
        {
            key: "classes",
            icon: <ReadOutlined />,
            label: <Link to="/teacher/classes">Lớp Giảng Dạy</Link>,
        },
        {
            key: "statistical",
            icon: <BookOutlined />,
            label: <Link to="/teacher/statistical">Thống Kê</Link>,
        },
        {
            key: "auth",
            label: (
                <div className={styles.user}>
                    <Dropdown menu={userMenu} placement="bottomRight" arrow>
                        <div className={styles.avatarWrapper}>
                            <Avatar
                                size="large"
                                src={avatarSrc}
                                alt={currentUser?.fullName || currentUser?.username || ""}
                            >
                                {!avatarSrc && <UserOutlined />}
                            </Avatar>
                            {currentUser?.fullName && (
                                <span className={styles.fullName}>{currentUser.fullName}</span>
                            )}
                        </div>
                    </Dropdown>
                </div>
            ),
        },
    ];

    return (
        <AntHeader className={styles.header}>
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["home"]}
                className={styles.menu}
                items={teacherMenuItems}
            />
        </AntHeader>
    );
};

export default TeacherHeader;
