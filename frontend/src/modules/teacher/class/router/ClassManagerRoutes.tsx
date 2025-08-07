import { Route } from "react-router-dom";
import ClassListPage from "../pages/list_class/ClassListPage";
import AddClassPage from "../pages/create_class/AddClassPage";
import ClassDetailPage from "../pages/class_detail/ClassDetailPage";

const ClassManagerRoutes = (
    <Route path="classes">
        <Route index element={<ClassListPage />} />
        <Route path="add" element={<AddClassPage />} />
        <Route path=":id" element={<ClassDetailPage />} />
    </Route>
);

export default ClassManagerRoutes;
