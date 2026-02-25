import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ZoomIn, 
  FileText, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  RefreshCcw 
} from 'lucide-react';

// Components & Hooks
import TrainerSidebar from '../../components/trainer/Sidebar';
import TrainerHeader from '../../components/trainer/Header';
import { useGetTrainerVerification } from '../../hooks/Trainer/TrainerHooks';

// Define Interface for Type Safety
interface VerificationData {
  verificationStatus: string;
  rejectionReason?: string;
  idCard: string;
  educationCert: string;
  experienceCert: string;
}

const BRAND_COLOR = "#eb9334";

const TrainerGetVerification: React.FC = () => {
  const { data, isLoading, isError } = useGetTrainerVerification();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Animation Variants
  const containerVars: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: BRAND_COLOR }} />
          </div>
        </div>
      </div>
    );
  }

  // 2. Data Extraction & Normalization
  // Some APIs wrap data in a .data property, others don't. This handles both.
  const trainer = ((data as any)?.data || data) as VerificationData;

  if (isError || !trainer) {
    return (
      <div className="flex h-screen bg-white">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-lg font-medium text-slate-600">Failed to load verification data.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-slate-100 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Status Logic (Case-Insensitive lookup to prevent "bg of undefined" error)
  const rawStatus = String(trainer.verificationStatus || 'pending').toLowerCase();

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactElement; label: string }> = {
    pending: {
      color: "#eab308",
      bg: "#fefce8",
      icon: <Clock size={24} />,
      label: "Pending Review"
    },
    approved: {
      color: "#22c55e",
      bg: "#f0fdf4",
      icon: <CheckCircle2 size={24} />,
      label: "Verified Professional"
    },
    verified: { // Alias for approved
      color: "#22c55e",
      bg: "#f0fdf4",
      icon: <CheckCircle2 size={24} />,
      label: "Verified Professional"
    },
    rejected: {
      color: "#ef4444",
      bg: "#fef2f2",
      icon: <AlertCircle size={24} />,
      label: "Action Required"
    }
  };

  // Fallback to 'pending' if status is unknown to prevent crash
  const currentStatus = statusConfig[rawStatus] || statusConfig['pending'];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVars}
          >
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tight mb-2">
                Verification <span style={{ color: BRAND_COLOR }}>Status</span>
              </h1>
              <p className="text-slate-500 font-medium">Professional credentialing and identity verification</p>
            </div>

            {/* Main Status Banner */}
            <motion.div 
              variants={itemVars}
              className="mb-8 p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row items-center gap-8 shadow-sm"
              style={{ 
                backgroundColor: currentStatus.bg, 
                borderColor: `${currentStatus.color}20` 
              }}
            >
              <div 
                className="p-5 rounded-2xl bg-white shadow-md"
                style={{ color: currentStatus.color }}
              >
                {currentStatus.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black" style={{ color: currentStatus.color }}>
                  {currentStatus.label}
                </h2>
                <p className="text-slate-600 font-semibold mt-1">
                  {rawStatus === 'pending' && "We are currently reviewing your documents. This usually takes 2-3 business days."}
                  {rawStatus === 'approved' && "Congratulations! Your profile is verified and active."}
                  {rawStatus === 'rejected' && "Your application was not approved. Please review the reason below."}
                </p>
              </div>
            </motion.div>

            {/* Rejection Detail Card */}
            {rawStatus === 'rejected' && trainer.rejectionReason && (
              <motion.div 
                variants={itemVars}
                className="mb-8 bg-white p-8 rounded-[2.5rem] border border-red-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <h3 className="text-red-500 font-black uppercase tracking-widest text-xs">Reason for Rejection</h3>
                  <p className="text-slate-700 font-bold leading-relaxed italic text-lg">"{trainer.rejectionReason}"</p>
                </div>
                <button
                  onClick={() => navigate('/trainer/verification')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shrink-0"
                >
                  <RefreshCcw size={20} /> Fix Documents
                </button>
              </motion.div>
            )}

            {/* Document Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Identity Proof', src: trainer.idCard, iconColor: '#3b82f6' },
                { label: 'Education Certificate', src: trainer.educationCert, iconColor: '#a855f7' },
                { label: 'Experience Proof', src: trainer.experienceCert, iconColor: '#10b981' }
              ].map((doc, idx) => (
                <motion.div key={idx} variants={itemVars} className="group">
                  <div className="bg-white p-3 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${doc.iconColor}10`, color: doc.iconColor }}>
                        <FileText size={18} />
                      </div>
                      <span className="font-black text-xs uppercase tracking-tighter text-slate-500">{doc.label}</span>
                    </div>
                    
                    <div 
                      className="relative aspect-[3/4] rounded-[2.2rem] overflow-hidden bg-slate-100 cursor-zoom-in"
                      onClick={() => setZoomedImage(doc.src)}
                    >
                      <img 
                        src={doc.src} 
                        alt={doc.label} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <ZoomIn size={24} style={{ color: BRAND_COLOR }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Information Footer */}
            <div className="mt-12 p-8 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-sm">
              <p className="text-slate-400 text-sm font-medium">
                <span className="text-slate-900 font-bold uppercase tracking-widest text-[10px] block mb-2">Notice</span>
                All documents verified. You have full access to platform features.
              </p>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modern Full-Screen Image Viewer */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4 md:p-10"
            onClick={() => setZoomedImage(null)}
          >
            <button className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={zoomedImage}
              alt="Document view"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerGetVerification;