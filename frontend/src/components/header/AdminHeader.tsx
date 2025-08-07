import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    TeamOutlined,
    SettingOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import styles from "./AdminHeader.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../modules/auth/stores/AuthSlice";
import type { AppDispatch } from "../../store/store";

const { Header: AntHeader } = Layout;

const AdminHeader: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    const { accessToken } = useSelector((state: any) => state.auth);

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

    const adminMenuItems = [

        {
            key: "logo",
            label: (
                <Link to="/admin">
                    <div className={styles.logo}>Admin Panel</div>
                </Link>
            ),
        },

        {
            key: "home",
            icon: <HomeOutlined />,
            label: <Link to="/">Trang Chủ</Link>
        },
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: "users",
            icon: <TeamOutlined />,
            label: <Link to="/admin/users">Quản Lý Người Dùng</Link>,
        },
        {
            key: "majors",
            icon: <SettingOutlined />,
            label: <Link to="/admin/majors">Quản Lý Ngành học</Link>,
        },
        {
            key: "questions",
            icon: <SettingOutlined />,
            label: <Link to="/admin/questions">Quản Lý Bộ Câu Hỏi</Link>,
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
                defaultSelectedKeys={["dashboard"]}
                className={styles.menu}
                items={adminMenuItems}
            />
        </AntHeader>
    );
};

export default AdminHeader;
