import { Route } from "react-router-dom";
import MainLayout from "../../../layouts/Mainlayout";
import StudentDocumentPage from "../pages/list_document/StudentDocumentPage";
import DocumentViewPage from "../pages/view_document/DocumentViewPage";


const DocumentRoutes = (
    <Route path="documents" element={<MainLayout />}>
        <Route index element={<StudentDocumentPage />} />
        <Route path=":id" element={<DocumentViewPage />} />
    </Route>
);

export default DocumentRoutes;
