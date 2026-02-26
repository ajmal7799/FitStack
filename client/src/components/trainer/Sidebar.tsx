import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import type { Rootstate } from '../../redux/store';
import { useTrainerSidebar } from '../trainer/TrainerSidebarContext';
import {
    LayoutDashboard, User, CheckCircle, MessageCircle,
    DollarSign, Calendar, X, Lock, Wallet
} from "lucide-react";

const TrainerSidebar = () => {
    const { isOpen, close } = useTrainerSidebar(); // ← from context
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector((state: Rootstate) => state.authData);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/trainer/dashboard" },
        { id: "myProfile", label: "My Profile", icon: User, path: "/trainer/profile" },
        { id: "verification", label: "Verification", icon: CheckCircle, path: "/trainer/get-verification" },
        { id: "slots", label: "Slots", icon: Calendar, path: "/trainer/slot" },
        { id: "upcomingSlots", label: "Session", icon: Calendar, path: "/trainer/upcoming-slots" },
        { id: "myChat", label: "My Chat", icon: MessageCircle, path: "/trainer/chat" },
        { id: "earnings", label: "My Earnings", icon: DollarSign, path: "/trainer/earnings" },
        { id: "wallet", label: "My Wallet", icon: Wallet, path: "/trainer/wallet" },
        { id: "sessionHistory", label: "Session History", icon: Calendar, path: "/trainer/sessions-history" },
        { id: "change-password", label: "Change Password", icon: Lock, path: "/trainer/change-password" },
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
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 bg-gray-900 border-b border-gray-800 px-4 flex-shrink-0">
                    <h1 className="text-xl font-bold text-white">Trainer Panel</h1>
                    <button onClick={close} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto mt-4 px-3 pb-4">
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
                                                ? "bg-gray-800 text-white"
                                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {userData.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userData.name || 'Trainer'}</p>
                            <p className="text-xs text-gray-500 truncate">{userData.email || 'trainer@example.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default TrainerSidebar;