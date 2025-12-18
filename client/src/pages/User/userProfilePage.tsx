import { useGetUserProfile } from "../../hooks/User/userServiceHooks";
import UserSidebar from "../../components/user/Sidebar";
import Header from "../../components/user/Header";

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

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">Loading profile...</div>
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
              <div className="text-lg text-red-600">
                Error loading profile: {(error as Error)?.message || "Something went wrong"}
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
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                User Profile
              </h1>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <p className="text-lg text-gray-900">{userProfile.name}</p>
                </div>

                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-lg text-gray-900">{userProfile.email}</p>
                </div>

                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <p className="text-lg text-gray-900">{userProfile.phone}</p>
                </div>

                <div className="pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Profile Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userProfile.userProfileCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {userProfile.userProfileCompleted
                        ? "Profile Completed"
                        : "Profile Incomplete"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;