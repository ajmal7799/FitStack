import React from "react";
import { useNavigate } from "react-router-dom";
import { type Rootstate } from "../../redux/store";
import { clearData } from '../../redux/slice/userSlice/authDataSlice';
import toast from 'react-hot-toast';
import { useDispatch,useSelector } from "react-redux";
import { useLogout } from '../../hooks/AuthHooks';

const TrainerHome: React.FC = () => {
   const userData = useSelector((state: Rootstate) => state.authData)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout()


  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData())
        toast.success("Trainer logged out successfully");
        navigate("/login")
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      }
    })
  }
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Trainer Dashboard</h1>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* 🔹 Main Content */}
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <p className="text-gray-600 mb-8 text-lg">Welcome back, Trainer 👋</p>
    <p>Name:{userData.name}</p><br /><br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Today's Overview</h2>
            <p className="text-gray-600">Check your scheduled workouts and client progress.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Upcoming Sessions</h2>
            <p className="text-gray-600">No sessions scheduled yet.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Client Progress</h2>
            <p className="text-gray-600">View and track your clients' fitness improvements.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p className="text-gray-600">Stay in touch with your clients and team members.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHome;
