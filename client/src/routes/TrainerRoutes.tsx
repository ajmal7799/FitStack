import { Route, Routes } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../constants/frontendRoutes';
import TrainerDashboard from '../pages/Trainer/TrainerDashboard';
import PrivateRoute from '../components/protectedComponents/PrivateRoute';
import TrainerVerification from '../pages/Trainer/TrainerVerification';
import TrainerProfile from '../pages/Trainer/profile/TrainerProfile';
import TrainerGetVerification from '../pages/Trainer/TrainerGetVerification';
import TrainerProfileEdit from '../pages/Trainer/profile/TrainerProfileEdit';
import TrainerSlotPage from '../pages/Trainer/slot/TrainerSlotPage';


const TrainerRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_DASHBOARD} element={<PrivateRoute > <TrainerDashboard/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_VERIFICATION} element={<PrivateRoute > <TrainerVerification/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE} element={<PrivateRoute > <TrainerProfile/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE_EDIT} element={<PrivateRoute > <TrainerProfileEdit/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_GET_VERIFICATION} element={<PrivateRoute > <TrainerGetVerification/> </PrivateRoute>  } />

      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_SLOT} element={<PrivateRoute > <TrainerSlotPage/> </PrivateRoute>} />
    </Routes>
  );
};   

export default TrainerRoutes;     