import Header from "../../../components/user/Header";
import Footer from "../../../components/user/footer";
import { useGetTrainerDetails } from "../../../hooks/User/TrainerHooks";
import { useSelectTrainer } from "../../../hooks/User/TrainerHooks"; // Import the hook
import { useParams, useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";
import { ArrowLeft, Check, Video, MessageCircle, Target, Award, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { TrainerApiResponse } from "../../../types/userTrainerDetails";
import toast from "react-hot-toast";
import type { Rootstate } from "../../../redux/store";
import {useSelector} from "react-redux";

const TrainerDetails = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();
  const authData = useSelector((state: Rootstate) => state.authData);
 

  const { data, isLoading, error } = useGetTrainerDetails(trainerId || "");
  const selectTrainerMutation = useSelectTrainer();

  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check if user has active subscription (replace with your actual logic)
  // You can use Redux selector or context to get this
  const {hasActiveSubscription} = authData// TODO: Replace with actual subscription check

  const trainer = (data as TrainerApiResponse)?.data?.result;

  const handleChooseTrainer = () => {
    if (!hasActiveSubscription) {
      // Redirect to subscription page
      navigate(FRONTEND_ROUTES.USER.SUBSCRIPTION);
    } else {
      // Show confirmation modal
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSelection = () => {
    if (trainerId) {
      selectTrainerMutation.mutate(
         trainerId ,
        {
          onSuccess: () => {
            toast.success(`${trainer?.name} selected as your trainer!`);
            setShowConfirmModal(false);
            // Redirect to home or dashboard after successful selection
            navigate(FRONTEND_ROUTES.USER.SELECTED_TRAINER);
          },
          onError: (error: any) => {
            toast.error(error?.response?.data.message || 'Failed to select trainer. Please try again.');
          }
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading trainer details...</div>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-600">Failed to load trainer details</div>
        <button
          onClick={() => navigate(FRONTEND_ROUTES.USER.TRAINERS)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Back to Trainers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(FRONTEND_ROUTES.USER.TRAINERS || "/trainers")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Trainers</span>
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 md:p-10 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              {/* Profile Image with Zoom */}
              <div className="relative flex-shrink-0">
                {trainer.profileImage ? (
                  <>
                    <img
                      src={trainer.profileImage}
                      alt={`${trainer.name}'s profile`}
                      className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-2xl border-4 border-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setIsImageZoomed(true)}
                    />

                    {/* Zoom Modal */}
                    {isImageZoomed && (
                      <div
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsImageZoomed(false)}
                      >
                        <div className="relative max-w-4xl max-h-[90vh]">
                          <img
                            src={trainer.profileImage}
                            alt={`${trainer.name}'s profile enlarged`}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                          />
                          <button
                            className="absolute top-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsImageZoomed(false);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-gray-500 text-5xl font-bold">
                      {trainer.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize">
                  {trainer.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{trainer.specialisation || "Personal Trainer"}</p>

                <div className="mt-4 flex flex-wrap gap-6 justify-center md:justify-start">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {trainer.experience} {trainer.experience === 1 ? "year" : "years"}
                    </p>
                  </div>

                  {trainer.qualification && (
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="text-xl font-semibold text-gray-800">{trainer.qualification}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {trainer.about || "No detailed information provided yet."}
            </p>

            {/* Email */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">Contact</p>
              <p className="text-gray-700 mt-1">{trainer.email}</p>
            </div>
          </div>

          {/* What You'll Get Section */}
          <div className="px-6 md:px-10 pb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                What You'll Get with {trainer.name.split(' ')[0]}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                {/* Daily Video Sessions */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Daily Video Sessions</h4>
                    <p className="text-sm text-gray-600">Personalized video calls every day (except Sunday) to keep you on track</p>
                  </div>
                </div>

                {/* 24/7 Chat Support */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">24/7 Chat Support</h4>
                    <p className="text-sm text-gray-600">Message your trainer anytime for guidance and support</p>
                  </div>
                </div>

                {/* Goal Tracking */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Fitness Goal Tracking</h4>
                    <p className="text-sm text-gray-600">Learn how to track your progress and achieve your fitness goals</p>
                  </div>
                </div>

                {/* Personalized Training */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Personalized Training</h4>
                    <p className="text-sm text-gray-600">Custom workout and diet plans tailored to your unique needs</p>
                  </div>
                </div>
              </div>

              {/* Choose Trainer Button */}
              <div className="text-center">
                <button
                  onClick={handleChooseTrainer}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
                >
                  <Check className="w-5 h-5" />
                  {hasActiveSubscription ? "Choose This Trainer" : "Get Subscription to Choose Trainer"}
                </button>

                {!hasActiveSubscription && (
                  <p className="mt-4 text-sm text-gray-600">
                    🔒 You need an active subscription to select a trainer.{" "}
                    <button
                      onClick={() => navigate(FRONTEND_ROUTES.USER.SUBSCRIPTION)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View plans
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Confirm Trainer Selection</h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  disabled={selectTrainerMutation.isPending}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to select{" "}
                  <span className="font-semibold text-gray-900">{trainer?.name}</span>{" "}
                  as your personal trainer?
                </p>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>You will get:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Daily personalized video sessions</li>
                    <li>✓ 24/7 chat support</li>
                    <li>✓ Custom workout & diet plans</li>
                    <li>✓ Goal tracking guidance</li>
                  </ul>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Note: You can change your trainer later if needed.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                  disabled={selectTrainerMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={selectTrainerMutation.isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {selectTrainerMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Selecting...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Yes, Select Trainer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrainerDetails;