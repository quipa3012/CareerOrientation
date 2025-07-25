import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import MainRoutes from './main/router/MainRoutes';
import AuthRoutes from './auth/router/AuthRoutes';
import UserRoutes from './user/router/UserRoutes';
import AdminRoutes from './admin/AdminRoutes';
import TestRoutes from './test/router/TestRoutes';
import MajorRoutes from './major/router/MajorRoutes';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {MainRoutes}
                {AuthRoutes}
                {UserRoutes}
                {AdminRoutes}
                {TestRoutes}
                {MajorRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
