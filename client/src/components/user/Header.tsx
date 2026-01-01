import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type Rootstate } from '../../redux/store';
import { clearData } from '../../redux/slice/userSlice/authDataSlice';
import toast from 'react-hot-toast';
import { useLogout } from '../../hooks/Auth/AuthHooks';
import { FiLogOut } from 'react-icons/fi';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import { useQueryClient } from '@tanstack/react-query';


const Header = () => {
  const userData = useSelector((state: Rootstate) => state.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData());
        queryClient.clear();
        toast.success('User logged out successfully');
        // window.location.reload();
        navigate('/admin/login');
      },
      onError: () => {
        toast.error('Logout failed. Please try again.');
      }
    });
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white border-b border-gray-100 shadow-sm">
      <h1 className="text-2xl font-extrabold text-blue-700">FitStack</h1>
      <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
        <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/home')}>
          Home
        </li>
        <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate(FRONTEND_ROUTES.USER.AI_WORKOUT)}>
          AI Diet & Work Out
        </li>
        <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/subscription')}>
          Subscription
        </li>
        <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/trainers')}>
          Trainers
        </li>
        <li className="hover:text-blue-700 cursor-pointer transition duration-300">
          Reviews
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        {/* User Info & Logout */}
        <div className="flex items-center space-x-3">
          {/* Profile Icon */}
          <div
            className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            {userData.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
            <p className="text-xs text-gray-500">{userData.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;