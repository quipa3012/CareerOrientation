import { Route } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import MajorManagerRoutes from "./major_manager/router/MajorManagerRoutes";
import UserManagerRoutes from "./user_manager/router/UserManagerRoutes";
import QuestionManagerRoutes from "./question_manager/router/QuestionManagerRoutes";
import Dashboard from "./dashboard/pages/Dashboard";

const AdminRoutes = (

    <Route path="/admin" element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminLayout />
        </ProtectedRoute>
    }>
        {MajorManagerRoutes}
        {UserManagerRoutes}
        {QuestionManagerRoutes}

        <Route index element={<Dashboard />} />
        <Route path="*" element={<div>Admin Not Found</div>} />
    </Route>
);

export default AdminRoutes;
