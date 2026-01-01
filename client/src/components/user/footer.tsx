// Footer.jsx
// import React from 'react';
// Assuming you have FiInstagram, FiTwitter, FiFacebook from 'react-icons/fi' 
// installed and imported for the social icons (or use your preferred icons).
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 🦶 Footer - Dark Theme (Adapted from StriveX to FitStack)
    <footer className="bg-gray-900 text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          
          {/* 1. Brand Info */}
          <div>
            <h3 className="text-3xl font-extrabold text-blue-500 mb-3">
              FitStack
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              AI-Powered fitness, connecting you with elite coaches and personalized plans for maximum results.
            </p>
          </div>

          {/* 2. Sitemap (Links from your Landing Page) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
              Sitemap
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Reviews
                </a>
              </li>
              <li>
                <a href="/trainers" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Meet the Coaches
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition duration-300">
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">
              Social Media
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition duration-300"
                aria-label="Instagram"
              >
                <FiInstagram className="text-white text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition duration-300"
                aria-label="Twitter"
              >
                <FiTwitter className="text-white text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition duration-300"
                aria-label="Facebook"
              >
                <FiFacebook className="text-white text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          © {currentYear} FitStack. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;