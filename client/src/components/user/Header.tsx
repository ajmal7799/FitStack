import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type Rootstate } from '../../redux/store';
import { clearData } from '../../redux/slice/userSlice/authDataSlice';
import toast from 'react-hot-toast';
import { useLogout } from '../../hooks/Auth/AuthHooks';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import { useQueryClient } from '@tanstack/react-query';
import NotificationBell from '../notification/NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userData = useSelector((state: Rootstate) => state.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const profileImage = userData.profileImage;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData());
        queryClient.clear();
        toast.success('User logged out successfully');
        navigate('/admin/login');
      },
      onError: () => {
        toast.error('Logout failed. Please try again.');
      }
    });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-12 py-4">
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-700">FitStack</h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/home')}>Home</li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate(FRONTEND_ROUTES.USER.AI_WORKOUT)}>AI Diet & Work Out</li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/subscription')}>Subscription</li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300" onClick={() => navigate('/trainers')}>Trainers</li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">Reviews</li>
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-3">
          {/* ✅ Notification Bell */}
          <NotificationBell />

          <div
            className="w-10 h-10 rounded-full shadow-md cursor-pointer overflow-hidden"
            onClick={() => navigate('/profile')}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="hidden lg:block text-right">
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

        {/* Mobile Right Section */}
        <div className="md:hidden flex items-center gap-2">
          {/* ✅ Notification Bell on mobile too */}
          <NotificationBell />
          <button
            className="text-gray-700 text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          {/* User Profile Section */}
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100">
            <div
              className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex-shrink-0"
              onClick={() => handleNavigate('/profile')}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="py-2">
            {[
              { label: 'Home', path: '/home' },
              { label: 'AI Diet & Work Out', path: FRONTEND_ROUTES.USER.AI_WORKOUT },
              { label: 'Subscription', path: '/subscription' },
              { label: 'Trainers', path: '/trainers' },
              { label: 'Reviews', path: '' },
            ].map(({ label, path }) => (
              <li
                key={label}
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition duration-200"
                onClick={() => path ? handleNavigate(path) : setIsMenuOpen(false)}
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-md hover:bg-red-700 transition duration-300"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
