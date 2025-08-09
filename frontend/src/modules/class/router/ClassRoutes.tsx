import { Route } from "react-router-dom";
import MainLayout from "../../../layouts/Mainlayout";
import AllClassesPage from "../pages/list_class/AllClassesPage";
import ClassDetailPage from "../pages/class_detail/ClassDetailPage";

const ClassRoutes = (
    <Route path="classes" element={<MainLayout />}>
        <Route index element={<AllClassesPage />} />
        <Route path=":id" element={<ClassDetailPage />} />
    </Route>
);

export default ClassRoutes;
