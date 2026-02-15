import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerHeader from "../../../components/trainer/Header";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import { useGetBookedSlotDetails } from "../../../hooks/Trainer/TrainerHooks";

// Interface for type safety without strict external files
interface SlotDetails {
  _id: string;
  profileImage: string;
  userName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  slotStatus: string;
  cancellationReason?: string | null;
}

const UpcomingSlotDetails = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBookedSlotDetails(slotId || "");
  const details: SlotDetails | undefined = data?.data?.result;

  return (
    <div className="flex min-h-screen bg-white text-black">
      <TrainerSidebar />
      <div className="flex-1 flex flex-col">
        <TrainerHeader />

        <main className="p-10 max-w-5xl mx-auto w-full">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="group mb-8 flex items-center font-bold text-xs uppercase tracking-widest hover:text-gray-500 transition-colors"
          >
            <span className="mr-2 text-lg group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Schedule
          </button>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl shadow-gray-100">
            {/* Top Banner / Status */}
            <div className="bg-black p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                  Slot Overview
                </h2>
                <p className="text-gray-400 text-sm mt-2 font-medium">
                  Session ID: {details?._id}
                </p>
              </div>
              <div
                className={`px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border-2 ${
                  details?.slotStatus === "cancelled"
                    ? "bg-transparent border-red-500 text-red-500"
                    : "bg-white border-white text-black"
                }`}
              >
                {details?.slotStatus || "Loading..."}
              </div>
            </div>

            <div className="p-10 lg:p-14">
              {isLoading ? (
                <div className="py-20 text-center font-bold animate-pulse uppercase tracking-widest">
                  Fetching Data...
                </div>
              ) : isError ? (
                <div className="py-20 text-center text-red-500 font-bold">
                  Error loading slot details.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* User Profile Section */}
                  <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                    <img
                      src={details?.profileImage}
                      alt="User"
                      className="w-44 h-44 rounded-full object-cover transition-all duration-500 border-8 border-gray-50"
                    />
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">
                        {details?.userName}
                      </h3>
                      <p className="text-gray-500 font-bold text-sm tracking-wide">
                        {details?.userEmail}
                      </p>
                    </div>
                    <button
                      className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all rounded-xl shadow-lg"
                      onClick={() => navigate("/trainer/chat")}
                    >
                      Send Message
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">
                          Scheduled Start
                        </label>
                        <p className="text-xl font-black border-l-4 border-black pl-4">
                          {new Date(
                            details?.startTime || "",
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-gray-500 font-bold mt-1 pl-5">
                          {new Date(
                            details?.startTime || "",
                          ).toLocaleDateString([], { dateStyle: "full" })}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">
                          Scheduled End
                        </label>
                        <p className="text-xl font-black border-l-4 border-gray-200 pl-4">
                          {new Date(details?.endTime || "").toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                        <p className="text-gray-500 font-bold mt-1 pl-5">
                          {new Date(details?.endTime || "").toLocaleDateString(
                            [],
                            { dateStyle: "full" },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Conditional Cancellation Reason */}
                    {details?.slotStatus === "cancelled" &&
                      details?.cancellationReason && (
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                          <label className="block text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-4">
                            Reason for Cancellation
                          </label>
                          <p className="text-red-900 font-bold italic">
                            "{details.cancellationReason}"
                          </p>
                        </div>
                      )}

                    {/* Help Note */}
                    <div className="pt-8 border-t border-gray-100">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        If you need to dispute this cancellation or adjust the
                        time, please contact support or reach out to the client
                        directly via the message portal.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpcomingSlotDetails;
