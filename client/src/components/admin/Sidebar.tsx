import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Dumbbell, CheckCircle,
    CreditCard, Calendar, X, Award
} from 'lucide-react';
import { useAdminSidebar } from './AdminSidebarContext';

const AdminSidebar = () => {
    const { isOpen, close } = useAdminSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
        { id: 'trainers', label: 'Trainers', icon: Dumbbell, path: '/admin/trainers' },
        { id: 'verification', label: 'Verification', icon: CheckCircle, path: '/admin/verification' },
        { id: 'subscription', label: 'Subscription', icon: CreditCard, path: '/admin/subscriptions' },
        { id: 'memberships', label: 'Memberships', icon: Award, path: '/admin/memberships' },
        { id: 'session', label: 'Session', icon: Calendar, path: '/admin/sessions' },
    ];

    const activePath = location.pathname;

    const handleNavigation = (path: string) => {
        close();
        navigate(path);
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={close}
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black
                flex flex-col h-screen
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 bg-gray-900 border-b border-gray-800 px-4 flex-shrink-0">
                    <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    <button onClick={close} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto mt-6 px-3 pb-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activePath === item.path;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gray-800 text-white'
                                                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;