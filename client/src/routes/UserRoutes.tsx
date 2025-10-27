import { Route, Routes } from 'react-router-dom'
import UserSignUpPage from '../pages/User/UserSignupPage'
import LandingPage from '../pages/LandingPages/landingPage'
import UserLoginPage from '../pages/User/UserLoginPage'
import Home from '../pages/Home/home'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path="/signup" element={<UserSignUpPage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/home" element={< Home/>} />
        </Routes>
    )
}   

export default UserRoutes