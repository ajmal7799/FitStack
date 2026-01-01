// src/components/modals/ConfirmationModal.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  currentStatus: 'active' | 'inactive';
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  name,
  currentStatus,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isCurrentlyActive = currentStatus === 'active';
  const actionVerb = isCurrentlyActive ? 'deactivate' : 'activate';
  const newStatusText = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE';
  const primaryColor = isCurrentlyActive ? 'red' : 'green';

  return (
    // Backdrop: Using classes from your reference for a darker, cleaner overlay
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      {/* Increased max-width slightly for better presentation, used shadow-2xl for consistency */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header/Content Area */}
        <div className="p-6">
          <div className="flex items-start">
            {/* Status Icon */}
            <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${primaryColor === 'red' ? 'bg-red-100' : 'bg-green-100'}`}>
              <svg 
                className={`h-6 w-6 text-${primaryColor}-600`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isCurrentlyActive ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z' : 'M5 13l4 4L19 7'} />
              </svg>
            </div>
            
            <div className="ml-4 text-left w-full">
              <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                Confirm {isCurrentlyActive ? 'Deactivation' : 'Activation'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to **{actionVerb}** the plan **{name}**?
                </p>
                <p className="mt-2 text-sm text-gray-700 font-medium">
                  The plan will become: 
                  <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold text-white bg-${primaryColor}-500`}>
                    {newStatusText}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer/Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            className="rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-150"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 text-sm font-medium text-white 
              bg-${primaryColor}-600 hover:bg-${primaryColor}-700 
              disabled:opacity-50 transition duration-150`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              `Yes, ${actionVerb}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;