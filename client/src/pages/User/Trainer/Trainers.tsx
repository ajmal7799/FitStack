import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/footer";
import Pagination from "../../../components/pagination/Pagination";
import { useGetAllVerifiedTrainers } from "../../../hooks/User/TrainerHooks";
import { Link } from "react-router-dom";
// import { FRONTEND_ROUTES } from "../../../constants/frontendRoutes";

import type React from "react";
import {
  FiStar,
  FiMapPin,
  FiAward,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { X } from "lucide-react";

interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  specialisation?: string;
  experience?: number;
  rating?: number;
  location?: string;
  bio?: string;
  qualification?: string;
  certifications?: string[];
  isVerified?: boolean;
}

const TrainersPageListing: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 9; // 9 trainers per page (3x3 grid)

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllVerifiedTrainers(
    page,
    limit,
    debouncedSearch // Pass search parameter
  );

  // Normalize data structure
  const trainers: Trainer[] = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.verifications || [];
  }, [data]);
  console.log("Trainers Data:", trainers);

  const totalPages = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.totalPages || 1;
  }, [data]);

  const totalTrainers = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data.totalVerifications || 0;
  }, [data]);

  // Search handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    []
  );

  const handleSearchClick = useCallback(() => {
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  }, []);

  const handleViewProfile = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-5 py-2 rounded-full mb-4 uppercase tracking-wider shadow-lg">
            🏆 Meet Our Expert Trainers
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Fitness Coach
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse our certified trainers and discover the perfect coach for
            your fitness journey. Subscribe to unlock access and connect with
            your ideal trainer!
          </p>
          {totalTrainers > 0 && (
            <p className="text-lg text-blue-600 font-semibold mt-4">
              {totalTrainers} Verified Trainers Available
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Search trainers by name or email"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              className="px-6 py-4 border-2 border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-lg"
            />

            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-32 top-5 text-gray-500 hover:text-red-500 transition"
                title="Clear search"
              >
                <X size={20} />
              </button>
            )}

            <button
              onClick={handleSearchClick}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-xl transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium text-lg">
                Loading trainers...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center shadow-xl">
            <div className="text-7xl mb-4">⚠️</div>
            <p className="text-red-600 font-bold text-xl mb-4">
              Oops! Failed to load trainers.
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 font-semibold shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Trainers Grid */}
        {!isLoading && !isError && trainers.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {trainers.map((trainer) => (
                 console.log('Trainer ID:', trainer.trainerId),
                <div
                  key={trainer.trainerId}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Trainer Image/Avatar */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {trainer.profileImage ? (
                      <img
                        src={trainer.profileImage}
                        alt={trainer.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="text-white text-6xl font-bold">
                        {trainer.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Verified Badge */}
                    {trainer.isVerified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <FiCheckCircle className="mr-1" /> Verified
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Trainer Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {trainer.name}
                    </h3>

                    {/* Specialization */}
                    {/* {trainer.specialisation && (
                      <p className="text-blue-600 font-semibold text-sm mb-3 flex items-center">
                        <FiAward className="mr-1" />
                        {trainer.specialisation}
                      </p>
                    )} */}

                    {/* Specialisation */}
                    {trainer.specialisation && (
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-3">
                        <p className="text-xs text-purple-600 font-semibold mb-1 uppercase">
                          Specialization
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          {trainer.specialisation}
                        </p>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      {/* Email */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiMail className="text-blue-600 mr-2 flex-shrink-0" />
                        <span className="truncate">{trainer.email}</span>
                      </div>

                      {/* Phone */}
                      {trainer.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <FiPhone className="text-green-600 mr-2 flex-shrink-0" />
                          <span>{trainer.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Trainer Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Experience */}
                      {trainer.experience && (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <FiClock className="text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Experience</p>
                          <p className="font-bold text-gray-900">
                            {trainer.experience} Years
                          </p>
                        </div>
                      )}

                      {/* Rating */}
                      {trainer.rating && (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <FiStar className="text-yellow-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="font-bold text-gray-900">
                            {trainer.rating}/5.0
                          </p>
                        </div>
                      )}

                      {/* Location */}
                      {trainer.location && (
                        <div className="bg-gray-50 rounded-lg p-3 text-center col-span-2">
                          <div className="flex items-center justify-center text-gray-700">
                            <FiMapPin className="text-blue-600 mr-1" />
                            <p className="text-sm font-semibold">
                              {trainer.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Subscription Required Notice */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 text-center shadow-sm">
                      <p className="text-base font-semibold text-gray-900 mb-3">
                        🔒 Want to train with {trainer.name?.split(" ")[0]}?
                      </p>

                      <p className="text-sm text-gray-600 mb-4">
                        Click to see full profile and choose this trainer if
                        it's the right fit for you.
                      </p>

   <Link
  to={`/trainers/details/${trainer.trainerId}`}
  className="w-full max-w-xs mx-auto py-2.5 px-6 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 hover:shadow-md transition duration-300 inline-block text-center"
>
  View Details & Choose Trainer
</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && trainers.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <FiUser className="text-gray-300 text-8xl mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {debouncedSearch ? "No Trainers Found" : "No Trainers Available"}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {debouncedSearch
                ? `No trainers match your search "${debouncedSearch}". Try a different search term.`
                : "We're currently onboarding amazing trainers. Check back soon!"}
            </p>
            <button
              onClick={() =>
                debouncedSearch ? handleClearSearch() : refetch()
              }
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-2xl transition duration-300 font-bold text-lg"
            >
              {debouncedSearch ? "Clear Search" : "Refresh Trainers"}
            </button>
          </div>
        )}

        {/* Why Choose Our Trainers Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Why Choose Our{" "}
            <span className="text-blue-600">Certified Trainers</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Verified Experts</h4>
              <p className="text-gray-600 text-sm">
                All trainers are certified and verified
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <FiVideo className="text-blue-600 text-3xl" /> */}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Video Sessions</h4>
              <p className="text-gray-600 text-sm">
                Daily video calls except Sunday
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <FiMessageCircle className="text-purple-600 text-3xl" /> */}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">
                Chat anytime with your trainer
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-orange-600 text-3xl" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Specialized</h4>
              <p className="text-gray-600 text-sm">
                Experts in various fitness domains
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Choose Your Trainer?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe now to unlock access to all trainers and start your
            personalized fitness journey!
          </p>
          <button
            onClick={() => handleViewProfile("/subscription")}
            className="bg-white text-blue-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition duration-300 shadow-xl text-lg"
          >
            View Subscription Plans
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TrainersPageListing;
