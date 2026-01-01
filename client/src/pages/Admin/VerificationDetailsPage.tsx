// src/pages/admin/VerificationDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import { useGetVerificationDetail } from '../../hooks/Admin/AdminHooks';
import { toast } from 'react-hot-toast';
import {
  useApproveVerification,
  useRejectVerification,
} from '../../hooks/Admin/AdminHooks';

const VerificationDetail = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetVerificationDetail(trainerId!);
  const { mutate: approveVerification, isPending: isApproving, } =
    useApproveVerification();
  const { mutate: rejectVerification, isPending: isRejecting } =
    useRejectVerification();

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-xl text-red-600">Failed to load details</div>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    about,
    experience,
    qualification,
    specialisation,
    idCard,
    educationCert,
    experienceCert,
    verificationStatus,
    rejectionReason,
  }: any = data;

  // Normalize approved => verified
  let status = verificationStatus?.toLowerCase();
  if (status === 'approved') {
    status = 'verified';
  }

  const handleApprove = async () => {
    approveVerification(trainerId!, {
      onSuccess: () => {
        toast.success('Trainer approved successfully!');
        navigate(-1);
      },
      onError: (error) => {
        console.error('Error approving trainer:', error);
        toast.error('Failed to approve trainer. Please try again.');
      },
    });
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    rejectVerification(
      { id: trainerId!, reason: rejectionNote },
      {
        onSuccess: () => {
          toast.success('Trainer rejected successfully!');
          setShowRejectModal(false);
          setRejectionNote('');
          navigate(-1);
        },
        onError: (error) => {
          console.error('Error rejecting trainer:', error);
          toast.error('Failed to reject trainer. Please try again.');
        },
      }
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(-1)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-base flex items-center gap-2"
              >
                ← Back to Verifications
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Trainer Verification Review
              </h1>
              <div className="w-32"></div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Personal Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-24">
                        Name:
                      </span>
                      <p className="flex-1 text-gray-900">{name}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-24">
                        Email:
                      </span>
                      <p className="flex-1 break-all text-gray-900">{email}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-24">
                        Phone:
                      </span>
                      <p className="flex-1 text-gray-900">
                        {phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Professional Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Qualification:
                      </span>
                      <p className="flex-1 text-gray-900">
                        {qualification || '—'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Specialisation:
                      </span>
                      <p className="flex-1 text-gray-900">{specialisation || '—'}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-semibold text-gray-700 w-32">
                        Experience:
                      </span>
                      <p className="flex-1 text-gray-900">
                        {experience
                          ? `${experience} year${experience > 1 ? 's' : ''}`
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">About:</span>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {about || 'No description provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Verification Status
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-semibold text-gray-700">Current Status:</span>
                    <span
                      className={`px-6 py-2 rounded-full text-white font-bold shadow-md ${
                        status === 'verified'
                          ? 'bg-green-600'
                          : status === 'rejected'
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                      }`}
                    >
                      {status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>

                  {/* Show rejection reason only if rejected */}
                  {status === 'rejected' && rejectionReason && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                      <p className="font-bold text-red-800">Rejection Reason:</p>
                      <p className="text-red-700 mt-2">{rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {status === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleApprove}
                      disabled={isApproving || isRejecting}
                      className="flex-1 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isApproving ? 'Processing...' : 'Approve Verification'}
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isApproving || isRejecting}
                      className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Reject with Reason
                    </button>
                  </div>
                )}

                {status === 'verified' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isRejecting}
                      className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isRejecting ? 'Processing...' : 'Reject Verification'}
                    </button>
                  </div>
                )}

                {status === 'rejected' && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isApproving ? 'Processing...' : 'Approve Verification'}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Documents */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Uploaded Documents
                </h2>
                <div className="space-y-5">
                  {/* ID Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold mb-3 text-indigo-800">ID Card</h3>
                    {idCard ? (
                      idCard.endsWith('.pdf') ? (
                        <a
                          href={idCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-12 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition text-center shadow-md"
                        >
                          Open PDF Document
                        </a>
                      ) : (
                        <img
                          src={idCard}
                          alt="ID Card"
                          onClick={() => setZoomedImage(idCard)}
                          className="w-full h-56 object-contain rounded-lg bg-white border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                        />
                      )
                    ) : (
                      <p className="text-gray-500 text-center py-12">Not uploaded</p>
                    )}
                  </div>

                  {/* Education Certificate */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold mb-3 text-green-800">
                      Education Certificate
                    </h3>
                    {educationCert ? (
                      educationCert.endsWith('.pdf') ? (
                        <a
                          href={educationCert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold py-12 rounded-lg hover:from-green-700 hover:to-emerald-800 transition text-center shadow-md"
                        >
                          Open PDF Document
                        </a>
                      ) : (
                        <img
                          src={educationCert}
                          alt="Education Certificate"
                          onClick={() => setZoomedImage(educationCert)}
                          className="w-full h-56 object-contain rounded-lg bg-white border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                        />
                      )
                    ) : (
                      <p className="text-gray-500 text-center py-12">Not uploaded</p>
                    )}
                  </div>

                  {/* Experience Certificate */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold mb-3 text-purple-800">
                      Experience Certificate
                    </h3>
                    {experienceCert ? (
                      experienceCert.endsWith('.pdf') ? (
                        <a
                          href={experienceCert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold py-12 rounded-lg hover:from-purple-700 hover:to-pink-800 transition text-center shadow-md"
                        >
                          Open PDF Document
                        </a>
                      ) : (
                        <img
                          src={experienceCert}
                          alt="Experience Certificate"
                          onClick={() => setZoomedImage(experienceCert)}
                          className="w-full h-56 object-contain rounded-lg bg-white border border-gray-200 shadow-sm cursor-pointer hover:opacity-90 transition"
                        />
                      )
                    ) : (
                      <p className="text-gray-500 text-center py-12">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 transition"
          >
            ×
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed Document"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reject Verification</h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNote('');
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={6}
                disabled={isRejecting}
              />
              <p className="text-sm text-gray-500 mt-2">
                This reason will be sent to the trainer.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNote('');
                }}
                disabled={isRejecting}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectionNote.trim()}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationDetail;
