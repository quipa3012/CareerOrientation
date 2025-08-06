import { Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import MajorManagerRoutes from "./major_manager/router/MajorManagerRoutes";
import UserManagerRoutes from "./user_manager/router/UserManagerRoutes";

const AdminRoutes = (

    <Route path="/admin" element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
        </ProtectedRoute>
    }>
        {MajorManagerRoutes}
        {UserManagerRoutes}

        <Route path="dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="users" element={<div>Manage Users</div>} />
        <Route path="settings" element={<div>Admin Settings</div>} />
        <Route path="*" element={<div>Admin Not Found</div>} />
    </Route>
);

export default AdminRoutes;
