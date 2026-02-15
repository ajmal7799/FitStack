import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { type Rootstate } from '../../redux/store';
import {
  User,
  FileText,
  MessageCircle,
  Calendar,
  Menu,
  X,
  ArrowLeft,
  Crown,
  Users,
  Lock
} from "lucide-react";

const UserSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state: Rootstate) => state.authData);

  const menuItems = [
    { id: "profile", label: "Personal Info", icon: User, path: "/profile" },
    {
      id: "personal-info",
      label: "Body Metrics",
      icon: FileText,
      path: "/profile/personal-info",
    },

    {
      id: "subscription",
      label: "Subscription",
      icon: Crown,
      path: "/active-subscription",
    },
    { id: "trainer", label: "Trainer", icon: Users, path: "/selected-trainer" },
    { id: "slots", label: "Slots", icon: Calendar, path: "/slots-booking" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "session", label: "Session", icon: Calendar, path: "/sessions" },
    {
      id: "session-history",
      label: "Session History",
      icon: Calendar,
      path: "/session-history",
    },
    
        {
      id: "change-password",
      label: "Change Password",
      icon: Lock, // Standard icon for security
      path: "/change-password",
    },
  ];
  const activePath = location.pathname;

  const handleNavigation = (item: any) => {
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  const handleBackToHome = () => {
    setIsMobileMenuOpen(false);
    navigate("/home");
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed position for mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-64 bg-gradient-to-b from-blue-900 to-blue-950 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } lg:h-screen overflow-y-auto`}
      >
        {/* Back to Home Button */}
        <div className="sticky top-0 z-10 flex items-center h-16 lg:h-16 bg-blue-800 border-b border-blue-700 px-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors py-2"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-6 px-3 pb-24 lg:pb-28">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 lg:py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-700 text-white shadow-lg"
                        : "text-blue-200 hover:bg-blue-800 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="font-medium text-left">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User Info */}
        <div className="fixed bottom-0 lg:absolute w-72 lg:w-64 p-4 bg-blue-950 border-t border-blue-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userData.name || 'User Name'}
              </p>
              <p className="text-xs text-blue-300 truncate">
                {userData.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;