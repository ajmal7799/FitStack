import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CheckCircle,
  MessageCircle,
  DollarSign,
  Calendar,
  Menu,
  X,
} from 'lucide-react';

const TrainerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/trainer/dashboard' },
    { id: 'myProfile', label: 'My Profile', icon: User, path: '/trainer/profile' },
    { id: 'verification', label: 'Verification', icon: CheckCircle, path: '/trainer/get-verification' },
    {id: "slots", label: "Slots", icon: Calendar, path: "/trainer/slot"}, 
    { id: 'myChat', label: 'My Chat', icon: MessageCircle, path: '/trainer/chat' },
    { id: 'earnings', label: 'My Earnings', icon: DollarSign, path: '/trainer/earnings' },
    { id: 'sessionHistory', label: 'Session History', icon: Calendar, path: '/trainer/sessions' },
  ];

  const activePath = location.pathname;

  const handleNavigation = (item: any) => {
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Trainer Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
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

        {/* Footer - Trainer Info */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Trainer Name</p>
              <p className="text-xs text-gray-500">trainer@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TrainerSidebar;