import { Route } from 'react-router-dom';
import MainLayout from '../../../layouts/Mainlayout';
import AccountPage from '../pages/account/AccountPage';
import RegisterPage from '../pages/register/RegisterPage';
import UpdateUserPage from '../pages/update/UpdateUserPage';
import ChangePasswordPage from '../pages/change_password/ChangePasswordPage';

const UserRoutes = (
    <Route path="user" element={< MainLayout />}>
        <Route path="me" element={<AccountPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="me/update" element={<UpdateUserPage />} />
        <Route path="me/change-password" element={<ChangePasswordPage />} />
    </Route>
);

export default UserRoutes;
