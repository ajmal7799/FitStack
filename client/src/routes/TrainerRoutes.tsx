import { Route, Routes } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import TrainerHome from '../pages/trainer/TrainerHome'
import PrivateRoute from '../components/protectedComponents/PrivateRoute'

const TrainerRoutes = () => {
    return (
        <Routes>
             <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_HOME} element={<PrivateRoute > <TrainerHome/> </PrivateRoute>} />
        </Routes>
    )
}   

export default TrainerRoutes     