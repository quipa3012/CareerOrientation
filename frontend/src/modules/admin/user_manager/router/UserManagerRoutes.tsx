import { Route } from "react-router-dom";
import UserManagerPage from "../pages/list_user/UserManagerPage";
import AddTeacherPage from "../pages/add_teacher/AddTeacherPage";
import UserManagerDetailPage from "../pages/user_detail/UserManagerDetailPage";

const UserManagerRoutes = (
    <Route path="users">
        <Route index element={<UserManagerPage />} />
        <Route path="add-teacher" element={<AddTeacherPage />} />
        <Route path=":id" element={<UserManagerDetailPage />} />
    </Route>
);

export default UserManagerRoutes;
