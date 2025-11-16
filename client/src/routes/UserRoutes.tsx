import { Route, Routes } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import UserSignUpPage from '../pages/Auth/SignupPage'
import LandingPage from '../pages/LandingPages/landingPage'
import UserLoginPage from '../pages/Auth/LoginPage'
import Home from '../pages/Home/home'
import PrivateRoute from '../components/protectedComponents/PrivateRoute'
import PublicRoute from '../components/protectedComponents/PublicRoute'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path={FRONTEND_ROUTES.LANDING} element={<PublicRoute> <LandingPage /> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.SIGNUP} element={<PublicRoute> <UserSignUpPage /> </PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<PublicRoute><UserLoginPage /></PublicRoute>} />
            <Route path={FRONTEND_ROUTES.USER.HOME} element={<PrivateRoute> < Home /> </PrivateRoute>} />

        </Routes>
    )
}

export default UserRoutes