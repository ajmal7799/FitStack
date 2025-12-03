import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearData } from '../../redux/slice/userSlice/authDataSlice'; // Adjust path if needed
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLogout } from '../../hooks/Auth/AuthHooks'; // Same hook works for both admin & trainer

const TrainerHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData());
        toast.success("Trainer logged out successfully");
        navigate("/login"); // or "/trainer/login" if you have a separate login page
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
  };

  return (
    <header className="bg-black border-b border-gray-800 h-16 flex items-center justify-end px-6">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </header>
  );
};

export default TrainerHeader;