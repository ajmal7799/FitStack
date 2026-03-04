import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { type Rootstate } from '../../redux/store';
import toast from 'react-hot-toast';

export const useRequireAuth = () => {
  const { accessToken } = useSelector((state: Rootstate) => state.authData);
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (onAuthorized: () => void) => {
    if (!accessToken) {
      toast.error('Please login to continue');
      // Save where they were trying to go
      navigate('/login', { state: { redirectTo: location.pathname } });
      return;
    }
    onAuthorized();
  };

  return { requireAuth, isLoggedIn: !!accessToken };
};