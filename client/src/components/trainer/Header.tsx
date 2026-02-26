import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearData } from '../../redux/slice/userSlice/authDataSlice';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLogout } from '../../hooks/Auth/AuthHooks';
import NotificationBell from '../notification/NotificationBell';
import type { Rootstate } from '../../redux/store';
import { useTrainerSidebar } from '../trainer/TrainerSidebarContext';

const TrainerHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userData = useSelector((state: Rootstate) => state.authData);
    const { toggle } = useTrainerSidebar(); // ← from context
    const profileImage = userData.profileImage;

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                dispatch(clearData());
                toast.success('Trainer logged out successfully');
                navigate('/login');
            },
            onError: () => {
                toast.error('Logout failed. Please try again.');
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
            <div className="h-16 flex items-center justify-between px-4 md:px-6">

                {/* ✅ Sidebar toggle — mobile only */}
                <button
                    className="lg:hidden text-white p-1"
                    onClick={toggle}
                >
                    <Menu size={24} />
                </button>

                <div className="hidden lg:block" />

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    <NotificationBell />

                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-white">{userData.name}</p>
                        <p className="text-xs text-gray-400">{userData.email}</p>
                    </div>

                    <div 
                        className="w-9 h-9 rounded-full flex-shrink-0 shadow-md overflow-hidden cursor-pointer"
                        onClick={() => navigate('/trainer/profile')}
                    >
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 bg-gray-700 flex items-center justify-center text-white font-bold text-sm">
                                {userData.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>

                    {/* Mobile user menu */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div 
                            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                            onClick={() => navigate('/trainer/profile')}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {userData.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile User Dropdown */}
            {isUserMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                        <div 
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer flex-shrink-0"
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                                    {userData.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{userData.name}</p>
                            <p className="text-xs text-gray-400">{userData.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default TrainerHeader;
