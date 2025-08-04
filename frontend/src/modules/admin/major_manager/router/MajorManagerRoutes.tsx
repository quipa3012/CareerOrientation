// 📁 src/modules/admin/major_manager/router/MajorManagerRoutes.tsx
import { Route } from "react-router-dom";
import AdminMajorListPage from "../pages/majors_list/AdminMajorListPage";
import AdminMajorCreatePage from "../pages/create_major/AdminMajorCreatePage";
import AdminMajorEditPage from "../pages/edit_major/AdminMajorEditPage";

const MajorManagerRoutes = (
    <Route path="majors" >
        <Route index element={< AdminMajorListPage />} />
        < Route path="create" element={< AdminMajorCreatePage />} />
        < Route path="edit/:id" element={< AdminMajorEditPage />} />
    </Route>
);

export default MajorManagerRoutes;
