import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/header/AdminHeader";
import Footer from "../components/footer/Footer";
import "./AdminLayout.scss"; 

const AdminLayout: React.FC = () => (
    <div className="layout-container">
        <AdminHeader />
        <main className="layout-content">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default AdminLayout;
