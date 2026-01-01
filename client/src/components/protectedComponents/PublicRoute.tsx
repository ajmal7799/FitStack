import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../../redux/store';
import type { ReactNode } from 'react';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';


interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const authData = useSelector((state: Rootstate) => state.authData);
  const { accessToken, role,verificationCheck,userProfileCompleted } = authData;
  console.log('authData', authData);
  // If already logged in, redirect based on role 
  if (accessToken) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'trainer'){
      if(verificationCheck===true) {
        return <Navigate to="/trainer/dashboard" replace/>;
      }else {
        return <Navigate to="/trainer/verification" replace />;
      }
      
    } else if (role === 'user') {
      if(userProfileCompleted===true) {
        return <Navigate to="/home" replace/>;
      }else {
        return <Navigate to={FRONTEND_ROUTES.USER.ADD_PROFILE} replace />;
      }
    }
    
  }

  return children;
};

export default PublicRoute;
