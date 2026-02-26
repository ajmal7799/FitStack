import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/footer';
import Pagination from '../../../components/pagination/Pagination';
import { useGetAllVerifiedTrainers } from '../../../hooks/User/TrainerHooks';
import { Link } from 'react-router-dom';
import { updateHasActiveSubscription } from '../../../redux/slice/userSlice/authDataSlice';
import { useDispatch } from 'react-redux';

import type React from 'react';
import {
  FiStar,
  FiAward,
  FiUser,
  FiCheckCircle,
  FiMail,
} from 'react-icons/fi';
import { X } from 'lucide-react';

interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  profileImage?: string;
  specialisation?: string;
  averageRating?: number;
  ratingCount?: number;
}

// ─── Star Rating Component ───────────────────────────────────────────────────
const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-2 mt-3 mb-4">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= fullStars;
          const half = !filled && star === fullStars + 1 && hasHalf;
          return (
            <span key={star} className="relative inline-block text-lg">
              {/* Background empty star */}
              <FiStar className="text-gray-200" style={{ fill: '#e5e7eb' }} />
              {/* Filled overlay */}
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? '50%' : '100%' }}
                >
                  <FiStar
                    className="text-amber-400"
                    style={{ fill: '#fbbf24' }}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Score badge */}
      <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
        {rating.toFixed(1)}
      </span>

      {/* Review count */}
      <span className="text-xs text-gray-400 font-medium">
        {count === 0
          ? 'No reviews yet'
          : `${count} ${count === 1 ? 'review' : 'reviews'}`}
      </span>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TrainersPageListing: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 3;
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError, refetch } = useGetAllVerifiedTrainers(
    page,
    limit,
    debouncedSearch
  );

  const trainers: Trainer[] = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.verifications || [];
  }, [data]);

  const totalPages = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.totalPages || 1;
  }, [data]);

  const totalTrainers = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data.totalVerifications || 0;
  }, [data]);

  const hasAcitveSubscription = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data.hasActiveSubscription || false;
  }, [data]);

  if (hasAcitveSubscription) {
    dispatch(updateHasActiveSubscription(true));
  }

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
    setSearchInput('');
    setDebouncedSearch('');
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
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
                <div
                  key={trainer.trainerId}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
                >
                  {/* Trainer Image */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
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
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FiCheckCircle size={12} /> Verified
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {trainer.name}
                    </h3>

                    {/* Email */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FiMail className="mr-1.5 text-blue-400" />
                      <span className="truncate">{trainer.email}</span>
                    </div>

                    {/* Specialisation */}
                    {trainer.specialisation && (
                      <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 w-fit">
                        <FiAward size={12} />
                        {trainer.specialisation}
                      </div>
                    )}

                    {/* ── Professional Star Rating ── */}
                    {trainer.averageRating !== undefined ? (
                      <StarRating
                        rating={trainer.averageRating}
                        count={trainer.ratingCount ?? 0}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 mt-3 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FiStar
                            key={s}
                            className="text-gray-200 text-lg"
                            style={{ fill: '#e5e7eb' }}
                          />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">
                          No reviews yet
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-2" />

                    {/* CTA */}
                    <div className="mt-auto pt-4">
                      <p className="text-sm text-gray-500 mb-3 text-center">
                        🔒 Subscribe to book a session with{' '}
                        <span className="font-semibold text-gray-700">
                          {trainer.name?.split(' ')[0]}
                        </span>
                      </p>
                      <Link
                        to={`/trainers/details/${trainer.trainerId}`}
                        className="block w-full text-center py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:opacity-90 transition duration-300"
                      >
                        View Profile & Choose
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
              {debouncedSearch ? 'No Trainers Found' : 'No Trainers Available'}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {debouncedSearch
                ? `No trainers match "${debouncedSearch}". Try a different search term.`
                : "We're currently onboarding amazing trainers. Check back soon!"}
            </p>
            <button
              onClick={() =>
                debouncedSearch ? handleClearSearch() : refetch()
              }
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-2xl transition duration-300 font-bold text-lg"
            >
              {debouncedSearch ? 'Clear Search' : 'Refresh Trainers'}
            </button>
          </div>
        )}

        {/* Why Choose Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Why Choose Our{' '}
            <span className="text-blue-600">Certified Trainers</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiCheckCircle className="text-green-600 text-3xl" />,
                bg: 'bg-green-100',
                title: 'Verified Experts',
                desc: 'All trainers are certified and verified',
              },
              {
                icon: <span className="text-3xl">🎥</span>,
                bg: 'bg-blue-100',
                title: 'Video Sessions',
                desc: 'Daily 1-on-1 video calls with your trainer',
              },
              {
                icon: <span className="text-3xl">💬</span>,
                bg: 'bg-purple-100',
                title: '24/7 Support',
                desc: 'Chat anytime with your trainer',
              },
              {
                icon: <FiAward className="text-orange-600 text-3xl" />,
                bg: 'bg-orange-100',
                title: 'Specialized',
                desc: 'Experts in various fitness domains',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
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
            onClick={() => handleViewProfile('/subscription')}
            className="bg-white text-blue-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition duration-300 shadow-xl text-lg"
          >
            View Subscription Plans
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrainersPageListing;