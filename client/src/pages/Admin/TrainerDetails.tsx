import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Wallet, Phone, Mail, Award, Briefcase, ShieldCheck, ShieldX } from 'lucide-react';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import { useGetTrainerDetails } from '../../hooks/Admin/AdminHooks';

const TrainerAdminDetailsPage = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetTrainerDetails(trainerId!);

  const trainer = data?.data?.result;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading trainer details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !trainer) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-red-400">Failed to load trainer details.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render stars ─────────────────────────────────────────────────────────
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
      />
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 mb-5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to Trainers</span>
          </button>

          {/* ── Profile Card ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-4">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">

              {/* Avatar */}
              {trainer.profileImage ? (
                <img
                  src={trainer.profileImage}
                  alt={trainer.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-100 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-indigo-500">
                    {trainer.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                    {trainer.name}
                  </h1>
                  {/* Active status */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit mx-auto sm:mx-0 ${
                    trainer.isActive === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {trainer.isActive}
                  </span>
                  {/* Verified badge */}
                  {trainer.isVerified ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 w-fit mx-auto sm:mx-0">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-500 w-fit mx-auto sm:mx-0">
                      <ShieldX className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>

                <p className="text-indigo-500 text-sm font-medium mb-3 capitalize">
                  {trainer.specialisation}
                </p>

                {/* Contact */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 items-center sm:items-start">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {trainer.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {trainer.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats Row ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

            {/* Rating */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Average Rating</p>
                <p className="text-xl font-bold text-gray-800 leading-none mb-1">
                  {trainer.averageRating > 0 ? trainer.averageRating.toFixed(1) : 'N/A'}
                </p>
                <div className="flex items-center gap-1">
                  {renderStars(trainer.averageRating)}
                  <span className="text-[11px] text-gray-400 ml-1">({trainer.ratingCount})</span>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Total Earnings</p>
                <p className="text-xl font-bold text-gray-800">
                                    ₹{trainer.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Clients */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Total Clients</p>
                <p className="text-xl font-bold text-gray-800">{trainer.totalClients}</p>
              </div>
            </div>
          </div>

          {/* ── Profile Details Card ────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                            Profile Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

              {/* Qualification */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Qualification</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{trainer.qualification}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Experience</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{trainer.experience} years</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1.5">About</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {trainer.about || 'No description provided.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrainerAdminDetailsPage;