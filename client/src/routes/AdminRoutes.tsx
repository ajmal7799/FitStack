import { Route, Routes } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../constants/frontendRoutes';
import AdminLoginPage from '../pages/Admin/AdminLoginPage';
import PrivateRoute from '../components/protectedComponents/PrivateRoute';
import PublicRoute from '../components/protectedComponents/PublicRoute';
import UsersListing from '../pages/Admin/UsersListing';
import TrainersListing from '../pages/Admin/TrainerListing';
import VerificationPage from '../pages/Admin/VerificationPage';
import VerificationDetailsPage from '../pages/Admin/VerificationDetailsPage';
import SubscriptionPlan from '../pages/Admin/SubscriptionPlan/SubscriptionPlan';
import SessionAdminHistoryPage from '../pages/Admin/session/SessionAdminHistory';
import SessionAdminHistoryDetails from '../pages/Admin/session/SessionAdminHistoryDetails';
import MembershipListing from '../pages/Admin/memberships/MembershipListing';
import AdminDashboard from '../pages/Admin/dashboard/AdminDashboard'; 
import { AdminSidebarProvider } from '../components/admin/AdminSidebarContext';


 
const AdminRoutes = () => {

  return (
    <AdminSidebarProvider>
    <Routes>
      <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.DASHBOARD} element={<PrivateRoute > <AdminDashboard /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.USERS} element={<PrivateRoute> <UsersListing/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.TRAINER} element={<PrivateRoute> <TrainersListing/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.VERIFICATION} element={<PrivateRoute> <VerificationPage/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.VERIFICATION_DETAILS} element={<PrivateRoute> <VerificationDetailsPage/> </PrivateRoute>} />
      {/* subscription plan */}
      <Route path={FRONTEND_ROUTES.ADMIN.SUBSCRIPTION_PLAN} element={<PrivateRoute> <SubscriptionPlan/> </PrivateRoute>} />

    /* session management */
      <Route path={FRONTEND_ROUTES.ADMIN.SESSION_HISTORY} element={<PrivateRoute> <SessionAdminHistoryPage/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.ADMIN.SESSION_HISTORY_DETAILS} element={<PrivateRoute> <SessionAdminHistoryDetails/> </PrivateRoute>} />

      // membership
      <Route path={FRONTEND_ROUTES.ADMIN.MEMBERSHIPS} element={<PrivateRoute> <MembershipListing/> </PrivateRoute>} />

    </Routes>
    </AdminSidebarProvider>
  );
};

export default AdminRoutes;   