import { Route, Routes } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import UserSignUpPage from '../pages/Auth/SignupPage'
import LandingPage from '../pages/LandingPages/landingPage'
import UserLoginPage from '../pages/Auth/LoginPage'
import Home from '../pages/Home/home'
import PrivateRoute from '../components/protectedComponents/PrivateRoute'
import PublicRoute from '../components/protectedComponents/PublicRoute'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import SubscriptionPlans from '../pages/User/subscription'
import TrainersPageListing from '../pages/User/Trainers'
import SuccessPage from '../pages/User/SuccessPage'
import PlansPage from '../pages/User/PlansPage'



const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<PublicRoute> <LandingPage /> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.SIGNUP} element={<PublicRoute> <UserSignUpPage/> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<PublicRoute><UserLoginPage/> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.FORGOTPASSWORD} element={<PublicRoute> < ForgotPassword/></PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.HOME} element={<PrivateRoute> < Home /> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.USER.SUBSCRIPTION} element={<PrivateRoute> < SubscriptionPlans /> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.USER.TRAINERS} element={<PrivateRoute> < TrainersPageListing /> </PrivateRoute>} />

            <Route path={FRONTEND_ROUTES.USER.PAYMENT_SUCCESS} element={<PrivateRoute> < SuccessPage /> </PrivateRoute>} />
            <Route path={FRONTEND_ROUTES.USER.PAYMENT_CANCEL} element={<PrivateRoute> < PlansPage /> </PrivateRoute>} />


        </Routes>
    )
}

export default UserRoutes