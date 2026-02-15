import { Route, Routes } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../constants/frontendRoutes';
import UserSignUpPage from '../pages/Auth/SignupPage';
import LandingPage from '../pages/LandingPages/landingPage';
import UserLoginPage from '../pages/Auth/LoginPage';
import Home from '../pages/Home/home';
import PrivateRoute from '../components/protectedComponents/PrivateRoute';
import PublicRoute from '../components/protectedComponents/PublicRoute';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import SubscriptionPlans from '../pages/User/Subscription/subscription';
import TrainersPageListing from '../pages/User/Trainer/Trainers';
import SuccessPage from '../pages/User/Subscription/SuccessPage';
import PlansPage from '../pages/User/Subscription/PlansPage';
import AddProfilePage from '../pages/User/Profile/AddProfileDataPage';
import AiWorkoutPlan from '../pages/User/Ai/WorkoutPlanPage';
import AiDietPlan from '../pages/User/Ai/DietPlanPage';
import UserProfile from '../pages/User/Profile/userPersonalPage';
import PersonalInfo from '../pages/User/Profile/userBodyMetrics';
import EditUserPersonalPage from '../pages/User/Profile/EditUserPersonalPage';
import UserBodyMetricsEditPage from '../pages/User/Profile/EditUserBodyMetrics';
import ActiveSubscription from '../pages/User/Subscription/ActiveSubscription';
import TrainerDetails from '../pages/User/Trainer/TrainerDetails';
import GetSelectedTrainer from '../pages/User/Trainer/GetSelectedTrainer';
import UserSlotBookingPage from '../pages/User/Slot/UserSlotBookingPage';
import UserChatPage from '../pages/User/chat/UserChatPage';
import ChangePasswordUserPage from '../pages/User/Profile/ChangePasswordPage';
import UserBookedSlotsPage from '../pages/User/Slot/UserBookedSlotsPage';
import UserBookedSlotDetails from '../pages/User/Slot/UserBookedSlotDetails';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path={FRONTEND_ROUTES.LANDING} element={<PublicRoute> <LandingPage /> </PublicRoute>} />
      <Route path={FRONTEND_ROUTES.USER.SIGNUP} element={<PublicRoute> <UserSignUpPage/> </PublicRoute>} />
      <Route path={FRONTEND_ROUTES.USER.LOGIN} element={<PublicRoute><UserLoginPage/> </PublicRoute>} />
      <Route path={FRONTEND_ROUTES.USER.FORGOTPASSWORD} element={<PublicRoute> < ForgotPassword/></PublicRoute>} />
      <Route path={FRONTEND_ROUTES.USER.HOME} element={<PrivateRoute> < Home /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.ADD_PROFILE} element={<PrivateRoute> <AddProfilePage/> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.SUBSCRIPTION} element={<PrivateRoute> < SubscriptionPlans /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.TRAINER_DETAILS} element={ <PrivateRoute><TrainerDetails /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.TRAINERS} element={ <PrivateRoute> < TrainersPageListing /> </PrivateRoute>  } />
      <Route path={FRONTEND_ROUTES.USER.SELECTED_TRAINER} element={ <PrivateRoute> < GetSelectedTrainer /> </PrivateRoute>  } />

    
      <Route path={FRONTEND_ROUTES.USER.AI_WORKOUT} element={<PrivateRoute> <  AiWorkoutPlan /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.AI_DIET} element={<PrivateRoute> <  AiDietPlan /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.PROFOILE} element={<PrivateRoute> <  UserProfile /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.PROFOILE_EDIT} element={<PrivateRoute> <  EditUserPersonalPage /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.CHANGE_PASSWORD} element={<PrivateRoute> <  ChangePasswordUserPage /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.ACTIVE_SUBSCRIPTION} element={<PrivateRoute> <  ActiveSubscription /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.PROFILE_PERSONAL_INFO} element={<PrivateRoute> <  PersonalInfo /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.PROFILE_PERSONAL_INFO_EDIT} element={<PrivateRoute> <  UserBodyMetricsEditPage /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.PAYMENT_SUCCESS} element={<PrivateRoute> < SuccessPage /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.PAYMENT_CANCEL} element={<PrivateRoute> < PlansPage /> </PrivateRoute>} />


      <Route path={FRONTEND_ROUTES.USER.SLOT_BOOKING} element={<PrivateRoute> < UserSlotBookingPage /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.SLOT_BOOKED} element={<PrivateRoute> < UserBookedSlotsPage /> </PrivateRoute>} />
      <Route path={FRONTEND_ROUTES.USER.SLOT_BOOKED_DETAILS} element={<PrivateRoute> < UserBookedSlotDetails /> </PrivateRoute>} />

      <Route path={FRONTEND_ROUTES.USER.CHAT} element={<PrivateRoute> < UserChatPage /> </PrivateRoute>} />

    </Routes>
  );
};

export default UserRoutes;