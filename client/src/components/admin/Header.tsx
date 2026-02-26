import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearData } from '../../redux/slice/userSlice/authDataSlice';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLogout } from '../../hooks/Auth/AuthHooks';
import { useAdminSidebar } from './AdminSidebarContext'; 

const AdminHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mutate: logout } = useLogout();
    const { toggle } = useAdminSidebar();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                dispatch(clearData());
                toast.success('Admin logged out successfully');
                navigate('/admin/login');
            },
            onError: () => {
                toast.error('Logout failed. Please try again.');
            }
        });
    };

    return (
        <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
            <div className="h-16 flex items-center justify-between px-4 md:px-6">

                {/* ✅ Sidebar toggle - mobile only */}
                <button
                    className="lg:hidden text-white p-1"
                    onClick={toggle}
                >
                    <Menu size={24} />
                </button>

                <div className="hidden lg:block" />

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Logout - desktop */}
                    <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                    </button>

                    {/* Mobile avatar button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            A
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {isUserMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4">
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

export default AdminHeader;