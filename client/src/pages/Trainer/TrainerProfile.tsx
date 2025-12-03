import TrainerSidebar from "../../components/trainer/Sidebar";
import TrainerHeader from "../../components/trainer/Header";
import { Mail, Phone, Clock, Award, UserCheck, AlertCircle, Edit2 } from "lucide-react";
import { useGetTrainerProfile } from "../../hooks/Trainer/TrainerHooks";

const TrainerProfile = () => {
  const { data: trainer, isLoading, isError,} = useGetTrainerProfile();

  // Loading State
    if (isLoading) {
      return (
        <div className="flex h-screen bg-gray-950">
          <TrainerSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-gray-400">Loading your profile...</div>
          </div>
        </div>
      );
    }

  // Error State
  if (isError || !trainer) {
    return (
      <div className="flex h-screen bg-gray-950">
        <TrainerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-400">
            Failed to load profile. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const {
    name = "Trainer",
    email = "Not provided",
    phone = "Not provided",
    about = "No description added yet.",
    experience = 0,
    qualification = "Not specified",
    specialisation = "", // ← can be string, null, or undefined
    verificationStatus = "pending",
  }:any = trainer;

  const isVerified = verificationStatus === "verified";
  const isPending = verificationStatus === "pending";

  // Safe initials
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Safely split specialisations (handles null, undefined, empty string)
  const specialisationList = specialisation
    ? specialisation
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [];

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-gray-400 mt-1">Your trainer information and verification status</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all">
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Avatar & Info */}
              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                  <div className="relative inline-block">
                    <div className="w-36 h-36 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl font-bold shadow-xl">
                      {initials}
                    </div>
                    {isVerified && (
                      <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                        <UserCheck size={20} className="text-white" />
                      </div>
                    )}
                  </div> 
                  

                  <h2 className="text-2xl font-bold mt-6">{name}</h2>
                  <p className="text-purple-400 text-lg">Fitness Trainer</p>

                  {/* Verification Badge */}
                  <div className="mt-4">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/50 text-green-400 rounded-full text-sm font-medium">
                        <UserCheck size={16} />
                        Verified Trainer
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/50 text-yellow-400 rounded-full text-sm font-medium">
                        <AlertCircle size={16} />
                        Verification Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-400 rounded-full text-sm font-medium">
                        <AlertCircle size={16} />
                        Verification Required
                      </span>
                    )}
                  </div>

                  <div className="mt-8 space-y-4 text-left text-gray-300">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-purple-400" />
                      <span>{email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-purple-400" />
                      <span>{phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-3">About Me</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {about || "Add a description to let clients know more about your training style!"}
                  </p>
                </div>

                {/* Experience & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="text-blue-400" size={22} />
                      <h4 className="text-lg font-semibold">Experience</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">
                      {experience} {experience === 1 ? "Year" : "Years"}
                    </p>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="text-yellow-400" size={22} />
                      <h4 className="text-lg font-semibold">Qualification</h4>
                    </div>
                    <p className="text-xl font-medium text-yellow-400">
                      {qualification}
                    </p>
                  </div>
                </div>

                {/* Specializations */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Specializations</h3>
                  {specialisationList.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {specialisationList.map((spec: string, i: number) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-purple-900/40 border border-purple-700 text-purple-300 rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No specializations added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerProfile;