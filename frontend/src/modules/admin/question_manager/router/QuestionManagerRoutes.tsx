import { Route } from "react-router-dom";
import QuestionListPage from "../pages/list_questions/AdminQuestionListPage";
import AdminQuestionEditPage from "../pages/update_question/AdminQuestionEditPage";

const QuestionManagerRoutes = (
    <Route path="questions">
        <Route index element={<QuestionListPage />} />
        <Route path="edit/:id" element={<AdminQuestionEditPage />} />
    </Route>
);

export default QuestionManagerRoutes;
