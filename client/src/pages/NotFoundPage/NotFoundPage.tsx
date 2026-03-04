import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { Rootstate } from '../../redux/store';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const authData = useSelector((state: Rootstate) => state.authData);
  const { accessToken, role } = authData;

  const handleGoBack = () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'trainer') navigate('/trainer/profile');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 overflow-hidden relative">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#faac05 1px, transparent 1px), linear-gradient(90deg, #faac05 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#faac05]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full">

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1
            className="text-[160px] sm:text-[200px] font-black leading-none select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px #faac05',
              textShadow: '0 0 80px rgba(250,172,5,0.15)',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Page not found
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* URL display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-xs text-gray-400 font-mono truncate max-w-[260px]">
            {window.location.pathname}
          </span>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#faac05] hover:bg-[#e09b00] text-black font-bold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#faac05]/20 active:scale-95"
          >
            ← Go back home
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default NotFoundPage;