import React, { useMemo } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    DashboardOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    BulbOutlined,
    AppstoreOutlined,
    ReadOutlined
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
        role === "TEACHER" && authenticated && {
            key: "teacher",
            icon: <DashboardOutlined />,
            label: <Link to="/teacher/classes">Trang Giáo Viên</Link>,
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
            icon: <InfoCircleOutlined />,
            label: <Link to="/about">Giới Thiệu</Link>
        },
        {
            key: "contact",
            icon: <PhoneOutlined />,
            label: <Link to="/contact">Liên Hệ</Link>
        },
        {
            key: "major",
            icon: <AppstoreOutlined />,
            label: <Link to="/majors">Ngành Học</Link>
        },
        ...(role !== "TEACHER" && role !== "ADMIN" ? [
            {
                key: "test",
                icon: <BulbOutlined />,
                label: <Link to="/test/start">Gợi Ý Khối Học</Link>
            },
            {
                key: "class",
                icon: <ReadOutlined />,
                label: <Link to="/classes">Lớp Học</Link>
            },
            {
                key: "document",
                icon: <ReadOutlined />,
                label: <Link to="/documents">Tài Liệu</Link>
            }
        ] : []),
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
                            {authenticated && currentUser?.fullName && (
                                <span className={styles.fullName}>{currentUser.fullName}</span>
                            )}
                        </div>
                    </Dropdown>
                </div>
            ),
        }
        ,
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

