import { motion } from 'framer-motion';
import { useGetUserProfile } from '../../../hooks/User/userServiceHooks';
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';
import { User, Mail, Phone, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { Rootstate } from '../../../redux/store';
import defaultProfileImage from '../../../assets/defaultProfileImage.png';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../../../constants/frontendRoutes';

// Type definitions
interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: string;
  verificationCheck: boolean;
  userProfileCompleted: boolean;
  profileImage?: string;
}

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    result: UserProfileData;
  };
}

const UserProfile: React.FC = () => {
  const { data, isLoading, isError, error } = useGetUserProfile();
  const navigate = useNavigate();
  const authData = useSelector((state: Rootstate) => state.authData);

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-lg text-gray-600">Loading profile...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                  <XCircle size={24} />
                  <h3 className="text-lg font-semibold">Error Loading Profile</h3>
                </div>
                <p className="text-red-700">
                  {(error as Error)?.message || 'Something went wrong'}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const userProfile: UserProfileData | undefined = (data as UserProfileResponse)?.data?.result;

  if (!userProfile) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">No profile data available</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">

            {/* Profile Header Card */}
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {authData.profileImage ? (
                      <img
                        src={authData.profileImage || defaultProfileImage}
                        alt={'User profile picture'}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {userProfile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </motion.div>

                  <motion.div
                    className="flex-1 text-center sm:text-left sm:mt-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Profile Details Card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User size={24} className="text-blue-600" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <User size={16} />
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 font-medium">{userProfile.name}</p>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.42 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900 font-medium break-all">{userProfile.email}</p>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.49 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900 font-medium">{userProfile.phone}</p>
                  </motion.div>
                </div>
              </div>
              <br />
              <br />
              <motion.button
                className="absolute -bottom-4 right-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                onClick={() => navigate(FRONTEND_ROUTES.USER.PROFOILE_EDIT)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55 }}
              >
                Update Profile
              </motion.button>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;