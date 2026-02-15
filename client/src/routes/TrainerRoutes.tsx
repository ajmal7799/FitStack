import { Route, Routes } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../constants/frontendRoutes';
import TrainerDashboard from '../pages/Trainer/TrainerDashboard';
import PrivateRoute from '../components/protectedComponents/PrivateRoute';
import TrainerVerification from '../pages/Trainer/TrainerVerification';
import TrainerProfile from '../pages/Trainer/profile/TrainerProfile';
import TrainerGetVerification from '../pages/Trainer/TrainerGetVerification';
import TrainerProfileEdit from '../pages/Trainer/profile/TrainerProfileEdit';
import TrainerSlotPage from '../pages/Trainer/slot/TrainerSlotPage';
import TrainerChatPage from '../pages/Trainer/chat/TrainerChatPage';
import ChangeTrainerPasswordPage from '../pages/Trainer/profile/TrainerChangePassword';
import UpcomingSlotsPage from '../pages/Trainer/slot/UpcomingSlotsPage';
import UpcomingSlotDetails from '../pages/Trainer/slot/UpcomingSlotDetails';

const TrainerRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_DASHBOARD} element={<PrivateRoute > <TrainerDashboard/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_VERIFICATION} element={<PrivateRoute > <TrainerVerification/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE} element={<PrivateRoute > <TrainerProfile/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE_EDIT} element={<PrivateRoute > <TrainerProfileEdit/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_CHANGE_PASSWORD} element={<PrivateRoute > <ChangeTrainerPasswordPage/> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_GET_VERIFICATION} element={<PrivateRoute > <TrainerGetVerification/> </PrivateRoute>  } />

      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_SLOT} element={<PrivateRoute > <TrainerSlotPage/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_UPCOMING_SLOTS} element={<PrivateRoute > <UpcomingSlotsPage/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_UPCOMING_SLOT_DETAILS} element={<PrivateRoute > <UpcomingSlotDetails/> </PrivateRoute>} />


      <Route path={FRONTEND_ROUTES.TRAINER.TRAINER_CHAT} element={<PrivateRoute > <TrainerChatPage/> </PrivateRoute>} />

    </Routes>
  );
};   

export default TrainerRoutes;     