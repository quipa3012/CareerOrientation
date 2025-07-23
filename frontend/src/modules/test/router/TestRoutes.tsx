import { Route } from "react-router-dom";
import MainLayout from "../../../layouts/Mainlayout";
import QuestionPage from "../pages/Question/QuestionPage";
import ProtectedRoute from "../../../components/ProtectedRoute";
import StartPage from "../pages/Start/StartPage";
import ResultPage from "../pages/Result/ResultPage";
import TestHistoryPage from "../pages/TestHistory/TestHistoryPage";

const TestRoutes = (
    <Route path="test" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="questions" element={<QuestionPage />} />
        <Route path="start" element={<StartPage />}></Route>
        <Route path="result" element={<ResultPage />}></Route>
        <Route path="history" element={<TestHistoryPage />}></Route>
    </Route>
);

export default TestRoutes;
