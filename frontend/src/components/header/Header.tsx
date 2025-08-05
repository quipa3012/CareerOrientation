import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    DashboardOutlined,
    HomeOutlined
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../modules/auth/stores/AuthSlice";
import type { AppDispatch, RootState } from "../../store/store";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    const avatarSrc = useMemo(() => {
        const url = currentUser?.profileImageUrl;
        if (!url) return undefined;
        return url.startsWith("http") ? url : `${backendUrl}${url}`;
    }, [currentUser?.profileImageUrl, backendUrl]);


    const { authenticated, role, accessToken } = useSelector((state: any) => state.auth);

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
        items: authenticated
            ? [
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
            ]
            : [
                {
                    key: "login",
                    icon: <LoginOutlined />,
                    label: <Link to="/auth/login">Đăng nhập</Link>,
                },
                {
                    key: "register",
                    icon: <UserOutlined />,
                    label: <Link to="/user/register">Đăng ký</Link>,
                },
            ],
    };

    const mainMenuItems = [
        {
            key: "logo",
            label: (
                <Link to="/">
                    <div className={styles.logo}>CareerConnect</div>
                </Link>
            ),
        },
        role === "ADMIN" && authenticated && {
            key: "admin",
            icon: <DashboardOutlined />,
            label:
                <Link to="/admin">Trang Quản Trị</Link>

        },
        {
            key: "home",
            icon: <HomeOutlined />,
            label: <Link to="/">Trang Chủ</Link>
        },
        {
            key: "about",
            label: <Link to="/about">Giới Thiệu</Link>
        },
        {
            key: "contact",
            label: <Link to="/contact">Liên Hệ</Link>
        },
        {
            key: "test",
            label: <Link to="/test/start">Gợi Ý Khối Học</Link>
        },
        {
            key: "major",
            label: <Link to="/majors">Ngành Học</Link>
        },
        {
            key: "class",
            label: <Link to="/">Lớp Học</Link>
        },
        {
            key: "auth",
            label: (
                <div className={styles.user}>
                    <Dropdown menu={userMenu} placement="bottomRight" arrow>
                        <Avatar
                            size="large"
                            src={avatarSrc}
                            alt={currentUser?.fullName || currentUser?.username || ""}
                        >
                            {!avatarSrc && <UserOutlined />}
                        </Avatar>

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
                items={mainMenuItems}
            />
        </AntHeader>
    );
};

export default Header;

