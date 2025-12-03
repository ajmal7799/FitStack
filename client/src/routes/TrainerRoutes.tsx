import { Route, Routes } from 'react-router-dom'
import { FRONTEND_ROUTES } from '../constants/frontendRoutes'
import TrainerDashboard from '../pages/Trainer/TrainerDashboard'
import PrivateRoute from '../components/protectedComponents/PrivateRoute'
import TrainerVerification from '../pages/Trainer/TrainerVerification'
import TrainerProfile from '../pages/Trainer/TrainerProfile'
import TrainerGetVerification from '../pages/Trainer/TrainerGetVerification'


const TrainerRoutes = () => {
    return (
        <Routes>
             <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_DASHBOARD} element={<PrivateRoute > <TrainerDashboard/> </PrivateRoute>} />
             <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_VERIFICATION} element={<PrivateRoute > <TrainerVerification/> </PrivateRoute>  } />
             <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE} element={<PrivateRoute > <TrainerProfile/> </PrivateRoute>  } />
             <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_GET_VERIFICATION} element={<PrivateRoute > <TrainerGetVerification/> </PrivateRoute>  } />
        </Routes>
    )
}   

export default TrainerRoutes     