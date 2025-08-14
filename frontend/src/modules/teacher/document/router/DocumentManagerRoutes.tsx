import { Route } from "react-router-dom";
import DocumentManagerPage from "../pages/list_document/DocumentManagerPage";
import DocumentViewPage from "../pages/view_document/DocumentViewPage";

const DocumentManagerRoutes = (
    <Route path="documents">
        <Route index element={<DocumentManagerPage />} />
        <Route path=":id" element={<DocumentViewPage />} />
    </Route>
);

export default DocumentManagerRoutes;
