import { useGetPersonalInfo } from "../../hooks/User/userServiceHooks";
import UserSidebar from "../../components/user/Sidebar";
import Header from "../../components/user/Header";
// import { useState } from "react";

// Type definitions
interface PersonalInfoData {
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  profileImage: string;
  fitnessGoal: string;
  targetWeight: number;
  dietPreference: string;
  experienceLevel: string;
  workoutLocation: string;
  preferredWorkoutTypes: string[];
  medicalConditions: string[];
  profileCompleted: boolean;
}

interface PersonalInfoResponse {
  success: boolean;
  message: string;
  data: {
    result: PersonalInfoData;
  };
}

const PersonalInfo: React.FC = () => {
  const { data, isLoading, isError, error } = useGetPersonalInfo();
//   const [isEditing, setIsEditing] = useState(false);

//   const handleUpdateClick = () => {
//     setIsEditing(true);
//     // Navigate to update/edit page or open modal
//     // Example: navigate("/user/personal-info/edit");
//     console.log("Update button clicked");
//   };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">Loading personal info...</div>
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
                Error loading personal info: {(error as Error)?.message || "Something went wrong"}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const personalInfo: PersonalInfoData | undefined = (data as PersonalInfoResponse)?.data?.result;

  if (!personalInfo) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">No personal info available</div>
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
              {/* Header with Update Button */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h1>
                <button
                //   onClick={}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Update Profile
                </button>
              </div>

              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={personalInfo.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Age
                    </label>
                    <p className="text-lg text-gray-900">{personalInfo.age} years</p>
                  </div>

                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Gender
                    </label>
                    <p className="text-lg text-gray-900 capitalize">{personalInfo.gender}</p>
                  </div>
                </div>

                {/* Physical Measurements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Height
                    </label>
                    <p className="text-lg text-gray-900">{personalInfo.height} cm</p>
                  </div>

                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Weight
                    </label>
                    <p className="text-lg text-gray-900">{personalInfo.weight} kg</p>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Fitness Goal
                    </label>
                    <p className="text-lg text-gray-900 capitalize">{personalInfo.fitnessGoal}</p>
                  </div>

                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Target Weight
                    </label>
                    <p className="text-lg text-gray-900">{personalInfo.targetWeight} kg</p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Diet Preference
                    </label>
                    <p className="text-lg text-gray-900 capitalize">{personalInfo.dietPreference}</p>
                  </div>

                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Experience Level
                    </label>
                    <p className="text-lg text-gray-900 capitalize">{personalInfo.experienceLevel}</p>
                  </div>
                </div>

                {/* Workout Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Workout Location
                    </label>
                    <p className="text-lg text-gray-900 capitalize">{personalInfo.workoutLocation}</p>
                  </div>

                  <div className="border-b pb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Preferred Workout Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.preferredWorkoutTypes.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Medical Conditions
                  </label>
                  {personalInfo.medicalConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.medicalConditions.map((condition, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm capitalize"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg text-gray-900">None</p>
                  )}
                </div>

                {/* Profile Status */}
                <div className="pb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Profile Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        personalInfo.profileCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {personalInfo.profileCompleted
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

export default PersonalInfo;