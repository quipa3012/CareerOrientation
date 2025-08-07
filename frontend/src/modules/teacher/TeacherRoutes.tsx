import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import TeacherLayout from "../../layouts/TeacherLayout";

const TeacherRoutes = (
    <Route
        path="/teacher"
        element={
            <ProtectedRoute roles={["TEACHER"]}>
                <TeacherLayout />
            </ProtectedRoute>
        }
    >
        <Route index element={<div>Teacher Dashboard</div>} />
        <Route path="classes" element={<div>Quản lý lớp học</div>} />
        <Route path="materials" element={<div>Thống kê</div>} />
        <Route path="*" element={<div>Teacher Not Found</div>} />
    </Route>
);

export default TeacherRoutes;
