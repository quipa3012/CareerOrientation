import { Route } from 'react-router-dom';
import Login from '../pages/login/LoginPage';
import MainLayout from '../../../layouts/Mainlayout';

const AuthRoutes = (
    <Route path="auth" element={<MainLayout />}>
        <Route path="login" element={<Login />} />
    </Route>
);

export default AuthRoutes;
