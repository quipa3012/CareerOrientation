import { Route } from 'react-router-dom';
import MainLayout from '../../../layouts/Mainlayout';
import AccountPage from '../pages/AccountPage';

const UserRoutes = (
    <Route path="user" element={< MainLayout />}>
        <Route path="me" element={<AccountPage />} />
    </Route>
);

export default UserRoutes;
