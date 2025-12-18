import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  MessageCircle,
  Calendar,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

const UserSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User, path: "/profile" },
    { id: "personal-info", label: "Personal Info", icon: FileText, path: "/profile/personal-info" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "session", label: "Session", icon: Calendar, path: "/session" },
    { id: "history", label: "History", icon: Calendar, path: "/history" },
  ];

  const activePath = location.pathname;

  const handleNavigation = (item:any) => {
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  const handleBackToHome = () => {
    setIsMobileMenuOpen(false);
    navigate("/home");
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
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
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-950 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Back to Home Button */}
        <div className="flex items-center h-16 bg-blue-800 border-b border-blue-700 px-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
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
                        ? "bg-blue-700 text-white shadow-lg"
                        : "text-blue-200 hover:bg-blue-800 hover:text-white"
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

        {/* Footer - User Info */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-blue-300">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UserSidebar;