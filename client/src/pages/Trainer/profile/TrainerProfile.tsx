import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  Award,
  UserCheck,
  AlertCircle,
  Edit2,
} from 'lucide-react';

// Components & Hooks
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import { useGetTrainerProfile } from '../../../hooks/Trainer/TrainerHooks';
import { FRONTEND_ROUTES } from '../../../constants/frontendRoutes';

// Define Interface for Type Safety
interface TrainerData {
  name?: string;
  email?: string;
  phone?: string;
  about?: string;
  experience?: number;
  qualification?: string;
  specialisation?: string | null;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  profileImage?: string | null;
}

const BRAND_COLOR = "#eb9334";

const TrainerProfile: React.FC = () => {
  const { data, isLoading, isError } = useGetTrainerProfile();
  const navigate = useNavigate();

  // Cast data to our interface safely
  const trainer = data as TrainerData;

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <TrainerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 rounded-full"
            style={{ borderColor: `${BRAND_COLOR}33`, borderTopColor: BRAND_COLOR }}
          />
        </div>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="flex h-screen bg-white">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <AlertCircle size={40} className="mb-4 text-red-500" />
          <p>Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  // Destructure with strict defaults
  const {
    name = 'Trainer',
    email = 'Not provided',
    phone = 'Not provided',
    about = 'No description added yet.',
    experience = 0,
    qualification = 'Not specified',
    specialisation = '',
    verificationStatus = 'pending',
  } = trainer;

  const isVerified = verificationStatus === 'verified';
  const isPending = verificationStatus === 'pending';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const specialisationList = specialisation
    ? specialisation.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
    : [];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <motion.h1 variants={cardVariants} className="text-4xl font-extrabold tracking-tight">
                  My <span style={{ color: BRAND_COLOR }}>Profile</span>
                </motion.h1>
                <p className="text-slate-500 mt-2 font-medium">Overview of your professional trainer account</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(235, 147, 52, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/trainer' + FRONTEND_ROUTES.TRAINER.TRAINER_PROFILE_EDIT)}
                className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl font-bold shadow-md transition-all"
                style={{ backgroundColor: BRAND_COLOR }}
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Profile Card */}
              <motion.div variants={cardVariants} className="lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-8 text-center relative">
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                        {trainer.profileImage ? (
                          <img src={trainer.profileImage} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300 bg-slate-50">
                            {initials}
                          </div>
                        )}
                      </div>
                      {isVerified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                          <UserCheck size={18} />
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
                    <p className="font-semibold text-sm uppercase tracking-widest mt-1" style={{ color: BRAND_COLOR }}>
                      Fitness Professional
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 group transition-colors hover:bg-white">
                        <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-orange-50">
                          <Mail size={16} style={{ color: BRAND_COLOR }} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 truncate">{email}</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 group transition-colors hover:bg-white">
                        <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-orange-50">
                          <Phone size={16} style={{ color: BRAND_COLOR }} />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{phone}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                      {isVerified ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-3 rounded-2xl">
                          <UserCheck size={18} /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-orange-500 font-bold bg-orange-50 py-3 rounded-2xl">
                          <AlertCircle size={18} /> {isPending ? 'Pending Approval' : 'Verification Needed'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Information Side */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div variants={cardVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Experience</p>
                        <h4 className="text-xl font-bold">{experience} {experience === 1 ? 'Year' : 'Years'}</h4>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-orange-50" style={{ color: BRAND_COLOR }}>
                        <Award size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Qualification</p>
                        <h4 className="text-xl font-bold truncate max-w-[180px]">{qualification}</h4>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bio */}
                <motion.div variants={cardVariants} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                    Biography <span className="h-px flex-1 bg-slate-100"></span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{about}"
                  </p>
                </motion.div>

                {/* Specializations */}
                <motion.div variants={cardVariants} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6">Area of Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {specialisationList.length > 0 ? (
                      specialisationList.map((spec, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ y: -2 }}
                          className="px-5 py-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold border border-slate-100"
                        >
                          {spec}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No specializations added yet.</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TrainerProfile;