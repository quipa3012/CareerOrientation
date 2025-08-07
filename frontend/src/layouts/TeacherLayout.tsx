import React from "react";
import { Outlet } from "react-router-dom";
import TeacherHeader from "../components/header/TeacherHeader";
import Footer from "../components/footer/Footer";
import "./TeacherLayout.scss";

const TeacherLayout: React.FC = () => (
    <div className="layout-container">
        <TeacherHeader />
        <main className="layout-content">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default TeacherLayout;
