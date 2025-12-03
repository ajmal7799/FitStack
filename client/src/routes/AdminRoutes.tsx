import { Route, Routes } from "react-router-dom";
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import AdminLoginPage from "../pages/Admin/AdminLoginPage";
import AdminDashboardPage from "../pages/Admin/Dashboard";
import PrivateRoute from '../components/protectedComponents/PrivateRoute';
import PublicRoute from '../components/protectedComponents/PublicRoute';
import UsersListing from "../pages/Admin/UsersListing";
import TrainersListing from "../pages/Admin/TrainerListing";
import VerificationPage from "../pages/Admin/VerificationPage";
import VerificationDetailsPage from "../pages/Admin/VerificationDetailsPage";
import SubscriptionPlan from "../pages/Admin/SubscriptionPlan/SubscriptionPlan";
const AdminRoutes = () => {

    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.DASHBOARD} element={<PrivateRoute > <AdminDashboardPage /> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.USERS} element={<PrivateRoute> <UsersListing/> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.TRAINER} element={<PrivateRoute> <TrainersListing/> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.VERIFICATION} element={<PrivateRoute> <VerificationPage/> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.ADMIN.VERIFICATION_DETAILS} element={<PrivateRoute> <VerificationDetailsPage/> </PrivateRoute>} />
            {/* subscription plan */}
             <Route path={FRONTEND_ROUTES.ADMIN.SUBSCRIPTION_PLAN} element={<PrivateRoute> <SubscriptionPlan/> </PrivateRoute>} />
        </Routes>
    )
}

export default AdminRoutes   