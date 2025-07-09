import { Route } from 'react-router-dom';
import MainLayout from '../../../layouts/Mainlayout';
import AccountPage from '../pages/account/AccountPage';
import RegisterPage from '../pages/register/RegisterPage';

const UserRoutes = (
    <Route path="user" element={< MainLayout />}>
        <Route path="me" element={<AccountPage />} />
        <Route path="register" element={<RegisterPage />} />
    </Route>
);

export default UserRoutes;
