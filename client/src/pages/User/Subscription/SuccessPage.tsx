// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid'; 
import { FRONTEND_ROUTES } from '../../../constants/frontendRoutes';

const SuccessPage = () => {
  const navigate = useNavigate();
    
  // We remove all state, useEffect, polling, and timers. 
  // This is now purely a presentation component.
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center p-12 bg-white rounded-2xl shadow-2xl border-t-8 border-green-500 max-w-md w-full">
                
        {/* Success Icon */}
        <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6 animate-pulse" />
                
        {/* Title and Message */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
                    Payment Successful! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-6">
                    Thank you for subscribing. Your account is being upgraded right now.
        </p>

        {/* Status Note */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-8">
          <p className="text-sm text-green-700 font-medium">
                        Access should be granted automatically within a few seconds.
          </p>
        </div>
                
        {/* Navigation Button */}
        <button 
          onClick={() => navigate(FRONTEND_ROUTES.USER.ACTIVE_SUBSCRIPTION)}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
                    Go to Active Subscription plan page
        </button>
                
      </div>
            
      {/* Footer Note */}
      <p className="text-sm text-gray-400 mt-4">
                If your access is not granted immediately, please refresh your dashboard in one minute.
      </p>
    </div>
  );
};

export default SuccessPage;