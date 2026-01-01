import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { XCircleIcon } from '@heroicons/react/24/solid';

const PlansPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  useEffect(() => {
    // Check if the user was redirected from the Stripe cancel URL
    if (location.pathname === '/plans') {
            
      // Assuming the simple /plans path means a cancellation redirect
      if (location.search === '') { 
        setShowCancelAlert(true);
                
        // 1. Show the alert immediately
        // 2. Set a timer to close the alert and redirect after a few seconds
        const redirectTimer = setTimeout(() => {
          setShowCancelAlert(false);
          // 🔥 THE NEW REDIRECT: Go to the subscription details page
          navigate('/subscription'); 
        }, 4000); // 4 seconds delay to read the message

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [location.pathname, location.search, navigate]); // Added navigate to dependency array


  // Your main pricing content function
  const renderPricingContent = () => {
    // ... all your plan cards, features, etc.
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    Choose the Perfect Plan
        </h2>
        {/* ... existing pricing content ... */}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {showCancelAlert && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sticky top-0 z-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                                Your payment was not completed. Redirecting you to the subscription page...
              </p>
            </div>
          </div>
        </div>
      )}
            
      {renderPricingContent()}
    </div>
  );
};

export default PlansPage;