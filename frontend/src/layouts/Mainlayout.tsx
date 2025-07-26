import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import './MainLayout.scss'; 

const MainLayout: React.FC = () => (
    <div className="layout-container">
        <Header />
        <main className="layout-content">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default MainLayout;
