import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Calendar, CreditCard, ArrowRight } from "lucide-react";
import UserSidebar from "../../../components/user/Sidebar";
import Header from "../../../components/user/Header";
import { useGetActiveSubscription } from "../../../hooks/User/SubscriptionHooks";

import type { SubscriptionResult } from "../../../types/AcitveSubscriptionPlan";

const ActiveSubscription = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetActiveSubscription();

  const subscription: SubscriptionResult | null = data?.success ? data.data.result : null;

  const formatCurrency = (price: number) => (price / 100).toFixed(2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate remaining days
  const getRemainingDays = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    if (expiry < now) return 0;

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = subscription ? getRemainingDays(subscription.expiresAt) : 0;

  // Helper to determine badge style based on remaining days
  const getRemainingDaysBadge = () => {
    if (remainingDays === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
          <AlertCircle size={16} className="mr-1.5" />
          Expired
        </span>
      );
    }

    let colorClasses = "";
    if (remainingDays > 30) {
      colorClasses = "bg-green-100 text-green-800 border-green-200";
    } else if (remainingDays > 14) {
      colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (remainingDays > 7) {
      colorClasses = "bg-orange-100 text-orange-800 border-orange-200";
    } else {
      colorClasses = "bg-red-100 text-red-800 border-red-200 animate-pulse";
    }

    return (
      <span
        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-base font-bold ${colorClasses}`}
      >
        {remainingDays === 1 ? "Tomorrow" : `${remainingDays} days`}
        <span className="ml-1.5 text-xs font-normal opacity-80">remaining</span>
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - fixed position */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200">
        <UserSidebar />
      </div>

      {/* Main content area with left padding */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - sticky */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <Header />
        </div>

        <main className="p-8 bg-white flex-1">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                My Subscription
              </h1>
              <p className="text-gray-500 mt-2">Manage your plan and billing details.</p>
            </header>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-gray-400 text-sm animate-pulse">Loading your plan...</p>
              </div>
            ) : subscription ? (
              /* ACTIVE SUBSCRIPTION */
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-500 text-[10px] font-bold uppercase rounded">
                          Current Plan
                        </span>
                      </div>
                      <h2 className="text-4xl font-black">{subscription.planName}</h2>
                    </div>
                    <div className="flex items-center bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                      <span className="text-green-400 text-sm font-bold capitalize">
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      {/* Pricing */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 border border-gray-100">
                          <CreditCard size={22} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Pricing
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            ${formatCurrency(subscription.price)}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              / {subscription.durationMonths} months
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Next Billing + Remaining Days */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 border border-gray-100">
                          <Calendar size={22} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Next Billing Date
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatDate(subscription.expiresAt)}
                          </p>

                          {/* Improved remaining days display */}
                          <div className="mt-2">{getRemainingDaysBadge()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Features / Upgrade */}
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                      <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                        <CheckCircle size={16} className="mr-2" /> Plan Features
                      </h4>
                      <p className="text-indigo-800/80 text-sm leading-relaxed">
                        {subscription.description}
                      </p>
                      <button
                        onClick={() => navigate("/subscription")}
                        className="mt-6 w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                      >
                        Upgrade Membership
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* NO SUBSCRIPTION */
              <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                  <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">No active plan found</h2>
                <p className="text-gray-500 mt-3 max-w-xs mx-auto text-sm leading-relaxed">
                  Join our community of professionals to unlock exclusive features and take your experience to the next level.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="mt-10 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-200 flex items-center mx-auto"
                >
                  Explore Plans <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActiveSubscription;