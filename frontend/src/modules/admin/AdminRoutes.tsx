import { Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";


const AdminRoutes = (

    <Route path="/admin" element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
        </ProtectedRoute>
    }>
        <Route path="dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="users" element={<div>Manage Users</div>} />
        <Route path="settings" element={<div>Admin Settings</div>} />
        <Route path="*" element={<div>Admin Not Found</div>} />
    </Route>
);

export default AdminRoutes;
