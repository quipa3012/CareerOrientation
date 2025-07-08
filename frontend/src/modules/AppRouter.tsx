import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import MainRoutes from './main/router/MainRoutes';
import AuthRoutes from './auth/router/AuthRoutes';
import UserRoutes from './user/router/UserRoutes';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {MainRoutes}
                {AuthRoutes}
                {UserRoutes}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
