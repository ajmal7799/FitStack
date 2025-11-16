import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminDashboardPage from "../pages/Admin/Dashboard";
import AdminUserPage from "../pages/Admin/Users";
import PrivateRoute from '../components/protectedComponents/PrivateRoute'
import PublicRoute from '../components/protectedComponents/PublicRoute'

const AdminRoutes = () => {

    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<PublicRoute> <AdminLoginPage /> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.DASHBOARD} element={<PrivateRoute > <AdminDashboardPage /> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.USERS} element={<PrivateRoute> <AdminUserPage /> </PrivateRoute>} />
        </Routes>
    )
}

export default AdminRoutes   