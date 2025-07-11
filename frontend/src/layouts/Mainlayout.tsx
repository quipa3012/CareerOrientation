import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

const MainLayout: React.FC = () => (
    <>
        <Header />
        <main style={{ padding: '20px', height: '75%' }}>
            <Outlet />
        </main>
        <Footer />
    </>
);

export default MainLayout;