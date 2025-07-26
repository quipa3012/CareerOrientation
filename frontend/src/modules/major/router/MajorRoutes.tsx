import { Route } from "react-router-dom";
import MainLayout from "../../../layouts/Mainlayout";
import MajorListPage from "../pages/major/MajorListPage";
import MajorDetailPage from "../pages/detail/MajorDetailPage";

const MajorRoutes = (
    <Route path="majors" element={<MainLayout />}>
        <Route index element={<MajorListPage />} />
        <Route path=":id" element={<MajorDetailPage />} />
    </Route>
);

export default MajorRoutes;
