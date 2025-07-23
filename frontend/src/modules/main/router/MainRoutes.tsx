import { Route } from 'react-router-dom';
import MainLayout from '../../../layouts/Mainlayout'
import Home from '../pages/home/Home';
import About from '../pages/about/About';
import Contact from '../pages/contact/Contact';
import NotFound from '../pages/notfound/NotFound';
import RefreshTestPage from '../../../components/RefreshTestPage';
import UnauthorizedPage from '../pages/unauthorized/UnauthorizedPage';


const MainRoutes = (
    <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="refresh-test" element={<RefreshTestPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* Các route khác */}
        <Route path="*" element={<NotFound />} />
    </Route>
);

export default MainRoutes;
