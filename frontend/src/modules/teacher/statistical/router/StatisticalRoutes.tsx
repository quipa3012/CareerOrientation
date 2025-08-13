import { Route } from "react-router-dom";
import StatisticalPage from "../pages/StatisticalPage";


const StatisticalRoutes = (
    <Route path="statistical" >
        <Route index element={<StatisticalPage />} />
    </Route>
);

export default StatisticalRoutes;
