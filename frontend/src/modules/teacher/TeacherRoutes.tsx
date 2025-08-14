import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import TeacherLayout from "../../layouts/TeacherLayout";
import ClassManagerRoutes from "./class/router/ClassManagerRoutes";
import StatisticalRoutes from "./statistical/router/StatisticalRoutes";
import DocumentManagerRoutes from "./document/router/DocumentManagerRoutes";

const TeacherRoutes = (
    <Route
        path="/teacher"
        element={
            <ProtectedRoute roles={["TEACHER"]}>
                <TeacherLayout />
            </ProtectedRoute>
        }
    >

        {ClassManagerRoutes}
        {StatisticalRoutes}
        {DocumentManagerRoutes}

        <Route path="materials" element={<div>Thống kê</div>} />
        <Route path="*" element={<div>Teacher Not Found</div>} />
    </Route>
);

export default TeacherRoutes;
