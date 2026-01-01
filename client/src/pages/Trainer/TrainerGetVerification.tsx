import { useState } from 'react';
import TrainerSidebar from '../../components/trainer/Sidebar';
import TrainerHeader from '../../components/trainer/Header';
import { useGetTrainerVerification } from '../../hooks/Trainer/TrainerHooks';
import { X, ZoomIn, FileText, AlertCircle } from 'lucide-react';
// import type{ GetTrainerVerification } from "../../types/TrainerVerificationPayload";
import { useNavigate } from 'react-router-dom';

const TrainerGetVerification = () => {
  const { data: trainer, isLoading, isError } = useGetTrainerVerification();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-950">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-lg">
              Loading verification details...
            </p>
          </main>
        </div>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="flex h-screen bg-gray-950">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-red-400 text-lg">
              Failed to load verification data.
            </p>
          </main>
        </div>
      </div>
    );
  }

  const {
    verificationStatus,
    rejectionReason,
    idCard,
    educationCert,
    experienceCert,
  }: any = trainer;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800',
    approved: 'bg-green-900/30 text-green-300 border border-green-800',
    rejected: 'bg-red-900/30 text-red-300 border border-red-800',
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <TrainerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TrainerHeader />

        <main className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3">
                Trainer Verification Status
              </h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-6 py-3 rounded-full text-lg font-semibold ${statusColors[verificationStatus]}`}
                >
                  {verificationStatus.charAt(0).toUpperCase() +
                    verificationStatus.slice(1)}
                </span>
                {verificationStatus === 'pending' && (
                  <p className="text-gray-400">
                    Your application is under review. We'll notify you soon.
                  </p>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {verificationStatus === 'rejected' && rejectionReason && (
              <>
                <div className="mb-8 p-6 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-4">
                  <AlertCircle
                    size={24}
                    className="text-red-400 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">
                      Reason for Rejection
                    </h3>
                    <p className="text-red-200 leading-relaxed">
                      {rejectionReason}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => {
                      navigate('/trainer/verification');
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    Update Your Details
                  </button>
                </div>
              </>
            )}

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ID Card */}
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText size={22} className="text-blue-400" />
                    <h3 className="font-semibold text-lg">
                      Identity Proof (Aadhar/PAN)
                    </h3>
                  </div>
                </div>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setZoomedImage(idCard)}
                >
                  <img
                    src={idCard}
                    alt="ID Card"
                    className="w-full h-64 object-contain bg-black p-4 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn size={40} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Education Certificate */}
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText size={22} className="text-purple-400" />
                    <h3 className="font-semibold text-lg">
                      Education Certificate
                    </h3>
                  </div>
                </div>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setZoomedImage(educationCert)}
                >
                  <img
                    src={educationCert}
                    alt="Education Certificate"
                    className="w-full h-64 object-contain bg-black p-4 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn size={40} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Experience Certificate */}
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText size={22} className="text-green-400" />
                    <h3 className="font-semibold text-lg">
                      Experience Certificate
                    </h3>
                  </div>
                </div>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setZoomedImage(experienceCert)}
                >
                  <img
                    src={experienceCert}
                    alt="Experience Certificate"
                    className="w-full h-64 object-contain bg-black p-4 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn size={40} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-10 p-5 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm">
                <strong>Note:</strong> Verification usually takes 2–5 business
                days. You will receive an email notification once your
                application is approved or if any additional documents are
                required.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
          >
            <X size={36} />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed document"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default TrainerGetVerification;
