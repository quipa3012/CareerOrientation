import React from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../modules/auth/stores/AuthSlice";
import type { AppDispatch } from "../../store/store";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { authenticated } = useSelector((state: any) => state.auth);
    const accessToken = useSelector((state: any) => state.auth.accessToken);

    const handleLogout = async () => {
        try {
            await dispatch(logout(accessToken));
            message.success("Đã đăng xuất");
            navigate("/auth/login");
        } catch (err) {
            console.error("Logout error:", err);
            message.error("Đăng xuất thất bại");
        }
    };

    const userMenu = {
        items: authenticated
            ? [
                {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: <Link to="/user/me">Thông Tin Tài Khoản</Link>,
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
                    label: <Link to="/auth/register">Đăng ký</Link>,
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
        { key: "home", label: <Link to="/">Trang Chủ</Link> },
        { key: "about", label: <Link to="/about">Giới Thiệu</Link> },
        { key: "contact", label: <Link to="/contact">Liên Hệ</Link> },
        {
            key: "auth",
            label: (
                <div className={styles.user}>
                    <Dropdown menu={userMenu} placement="bottomRight" arrow>
                        <Avatar size="large" icon={<UserOutlined />} />
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
