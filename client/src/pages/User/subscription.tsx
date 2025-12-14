import { useState, useMemo } from "react";
import { useGetSubscriptionPlans, useCheckoutSession } from "../../hooks/User/SubscriptionHooks";
import Pagination from "../../components/pagination/Pagination";
import Header from "../../components/user/Header";
import Footer from "../../components/user/footer";
import type React from "react";
import { 
  FiCheckCircle, 
  FiClock, 
  FiPackage,
  FiZap,
  FiStar,
  FiVideo,
  FiMessageCircle,
  FiTrendingUp,
  FiActivity
} from "react-icons/fi";
import toast from "react-hot-toast";

interface SubscriptionPlan {
  _id: string;
  planName: string;
  price: number;
  durationMonths: number;
  description: string;
  isActive: string;
}

const SubscriptionPlans: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 3;
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetSubscriptionPlans(page, limit);
  const { mutate: createCheckoutSession } = useCheckoutSession();

  // Normalize data structure
  const plans: SubscriptionPlan[] = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.subscriptions || [];
  }, [data]);

  const totalPages = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.totalPages || 1;
  }, [data]);

  // Handle plan selection and checkout
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    
    if (processingPlanId === plan._id) return;
    
    setProcessingPlanId(plan._id);

    createCheckoutSession(plan._id, {
      onSuccess: (response:any) => {
        // Extract session URL from response
        const sessionUrl = response?.data?.data?.sessionUrl || response?.sessionUrl;
        
        if (sessionUrl) {
          window.location.href = sessionUrl;
        } else {
          console.error("Session URL missing from response");
          alert("Failed to initialize payment. Please try again.");
          setProcessingPlanId(null);
        }
      },
      onError: (error: any) => {
        console.error("Checkout failed:", error);
        const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Failed to create checkout session. Please try again.";
        toast.error(errorMessage);
        setProcessingPlanId(null);
      }
    });
  };

  // Common features for all plans
  const getPlanFeatures = () => {
    return [
      'Advanced AI Workout Programs',
      'Everyday Video Call Sessions (Except Sunday)',
      '24/7 Chat with Certified Trainers',
      'Custom Meal Planning'
    ];
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toUpperCase();
    if (name.includes('PREMIUM') || name.includes('ANNUAL')) return <FiStar className="text-3xl" />;
    if (name.includes('ELITE') || name.includes('PRO')) return <FiZap className="text-3xl" />;
    return <FiActivity className="text-3xl" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toUpperCase();
    if (name.includes('PREMIUM') || name.includes('ANNUAL')) return 'from-purple-600 to-pink-600';
    if (name.includes('ELITE') || name.includes('PRO')) return 'from-blue-600 to-indigo-600';
    return 'from-green-600 to-teal-600';
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Determine most popular plan (usually the middle-priced one)
  const mostPopularPlan = useMemo(() => {
    if (plans.length === 0) return null;
    const sorted = [...plans].sort((a, b) => a.price - b.price);
    return sorted[Math.floor(sorted.length / 2)]?._id;
  }, [plans]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-5 py-2 rounded-full mb-4 uppercase tracking-wider shadow-lg">
            ✨ Transform Your Fitness Journey
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Choose Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Subscription Plan
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get AI-powered workout plans, personalized diet coaching, and direct access to certified trainers. 
            Start your transformation today!
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium text-lg">Loading subscription plans...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center shadow-xl">
            <div className="text-7xl mb-4">⚠️</div>
            <p className="text-red-600 font-bold text-xl mb-4">
              Oops! Failed to load subscription plans.
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 font-semibold shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Subscription Plans - Card Grid Layout */}
        {!isLoading && !isError && plans.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => {
                const isPopular = plan._id === mostPopularPlan;
                const isActive = plan.isActive === "active";
                const isPlanProcessing = processingPlanId === plan._id;
                const features = getPlanFeatures();
                const icon = getPlanIcon(plan.planName);
                const colorGradient = getPlanColor(plan.planName);

                return (
                  <div
                    key={plan._id}
                    className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                      isPopular ? "ring-4 ring-blue-500 scale-105" : ""
                    } ${!isActive ? "opacity-60 grayscale" : ""}`}
                  >
                    {/* Popular Badge */}
                    {isPopular && isActive && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`bg-gradient-to-r ${colorGradient} text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center`}>
                          <FiStar className="mr-1" /> MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* Gradient Header */}
                    <div className={`h-24 bg-gradient-to-r ${colorGradient} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}>
                      <div className="relative text-white">
                        {icon}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Plan Name */}
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
                        {plan.planName}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-center mb-4 text-sm">
                        {plan.description}
                      </p>

                      {/* Price Section */}
                      <div className="text-center mb-5 bg-gray-50 py-4 rounded-xl">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-gray-500 text-lg">₹</span>
                          <span className="text-5xl font-extrabold text-gray-900">
                            {(plan.price).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center mt-2 text-gray-600 text-sm">
                          <FiClock className="mr-1" />
                          <span className="font-semibold">
                            {plan.durationMonths} Month
                          </span>
                        </div>
                      </div>

                      {/* Features Section */}
                      <div className="space-y-2 mb-5">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                          What's Included:
                        </p>
                        {features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start">
                            <FiCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Purchase Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        disabled={!isActive || isPlanProcessing}
                        className={`w-full py-3 rounded-full font-bold text-base transition-all duration-300 shadow-lg ${
                          isActive && !isPlanProcessing
                            ? `bg-gradient-to-r ${colorGradient} text-white hover:shadow-xl hover:scale-105`
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isPlanProcessing ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : isActive ? (
                          "Get Started Now"
                        ) : (
                          "Unavailable"
                        )}
                      </button>

                      {/* Trust Badge */}
                      {isActive && (
                        <p className="text-center text-xs text-gray-500 mt-3">
                          💳 Secure Payment • Cancel Anytime
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Always show */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                setPage={handlePageChange}
              />
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && plans.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <FiPackage className="text-gray-300 text-8xl mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No Plans Available Right Now
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              We're preparing amazing subscription plans for you. Check back soon!
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-2xl transition duration-300 font-bold text-lg"
            >
              Refresh Plans
            </button>
          </div>
        )}

        {/* Trust & Support Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Subscription Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Amazing Benefits</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Transform your fitness journey with personalized AI workouts, daily trainer support, and custom meal plans. 
              Every subscription is designed to help you achieve your goals faster and stay motivated every step of the way.
            </p>
          </div>

          {/* Need Help */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <FiMessageCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Need Help Choosing?</h3>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our fitness experts are ready to help you select the perfect plan for your goals.
            </p>
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg">
              Chat with Expert
            </button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Why FitStack Members <span className="text-blue-600">Love Us</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="text-blue-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-gray-600 text-sm">Smart workouts that adapt to you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiVideo className="text-green-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Expert Trainers</h4>
              <p className="text-gray-600 text-sm">Certified professionals at your service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-purple-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-gray-600 text-sm">See your transformation unfold</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="text-orange-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Always here when you need us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SubscriptionPlans;