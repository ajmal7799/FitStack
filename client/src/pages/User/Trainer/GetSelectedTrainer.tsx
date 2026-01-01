// pages/user/GetSelectedTrainer.tsx  (or wherever this component lives)

import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetSelectedTrainer } from "../../../hooks/User/TrainerHooks";
import { useNavigate } from "react-router-dom";

// Optional: define a type for better type-safety (strongly recommended)
interface Trainer {
  name: string;
  email: string;
  profileImage: string;
  qualification: string;
  specialisation: string;
  experience: number;
  about: string;
}

interface selectedTrainerResponse {
  success: boolean;
  message: string;
  data: {
    result: Trainer;
  };
}

const GetSelectedTrainer = () => {
  const { data, isLoading, isError,  } = useGetSelectedTrainer();

  const navigate = useNavigate();

  // Extract the trainer data (based on your response structure)
  const trainer = (data as selectedTrainerResponse)?.data?.result;
  const trainerData = (data as selectedTrainerResponse)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Your Selected Trainer
            </h1>

            {isLoading && (
              <div className="text-center py-10">
                <p className="text-gray-600">Loading trainer information...</p>
              </div>
            )}

            {isError && (
              <div className="bg-white rounded-xl shadow-md p-8 md:p-10 text-center max-w-2xl mx-auto mt-8 border border-gray-200">
  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
    <svg
      className="w-8 h-8 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM6 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  </div>

  <h2 className="text-2xl font-bold text-gray-800 mb-3">
    No Trainer Selected Yet
  </h2>

  <p className="text-gray-600 mb-8 leading-relaxed">
    You haven't chosen your personal trainer.
    <br />
    Select one now to unlock these exclusive features:
  </p>

  {/* What You'll Get Section */}
  <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-dashed border-gray-300">
    <h3 className="text-gray-800 font-bold mb-4 flex items-center justify-center">
      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded mr-2">PERKS</span>
      What You'll Get
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Daily Video Sessions</p>
          <p className="text-xs text-gray-500">Personalized calls every day (except Sun)</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">24/7 Chat Support</p>
          <p className="text-xs text-gray-500">Message your trainer anytime</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Fitness Goal Tracking</p>
          <p className="text-xs text-gray-500">Achieve your goals with expert guidance</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">Personalized Training</p>
          <p className="text-xs text-gray-500">Custom workout and diet plans</p>
        </div>
      </div>
    </div>
  </div>

  <button
    onClick={() => navigate("/trainers")}
    className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
  >
    Choose Your Trainer Now
    <svg
      className="ml-3 w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </button>
</div>
            )}

            {!isLoading &&
              !isError &&
              (!trainerData?.success || trainerData?.data === null) && (
                <div className="bg-white rounded-xl shadow-md p-8 md:p-10 text-center max-w-2xl mx-auto mt-8 border border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM6 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    No Trainer Selected Yet
                  </h2>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    You haven't chosen your personal trainer.
                    <br />
                    Select one now to get your custom training plan, workouts,
                    and progress tracking!
                  </p>

                  <button
                    onClick={() => navigate("/trainers")}
                    className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
                  >
                    Choose Your Trainer Now
                    <svg
                      className="ml-3 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              )}
            {trainer && (
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Profile header with image */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                      <img
                        src={trainer.profileImage}
                        alt={`${trainer.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/160?text=No+Image";
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold">{trainer.name}</h2>
                      <p className="text-blue-100 mt-1">{trainer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Details section */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Qualification
                      </h3>
                      <p className="text-gray-800">
                        {trainer.qualification || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Specialisation
                      </h3>
                      <p className="text-gray-800">
                        {trainer.specialisation || "—"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Experience
                      </h3>
                      <p className="text-gray-800">
                        {trainer.experience}{" "}
                        {trainer.experience === 1 ? "year" : "years"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {trainer.about || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GetSelectedTrainer;
