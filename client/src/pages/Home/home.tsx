import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type Rootstate } from '../../redux/store';
import gymImage from '../../assets/gym.jpg';
import gymarea from '../../assets/gymarea.jpg';
import gymImage2 from '../../assets/gymImage2.jpg';
import { FRONTEND_ROUTES } from '../../constants/frontendRoutes';
import Header from '../../components/user/Header';
import {
  FiZap,
  FiTarget,
  FiVideo,
  FiMessageSquare,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiX,
  FiUsers,
  FiAward,
} from 'react-icons/fi';

// ── Join Modal ────────────────────────────────────────────────────────────────
const JoinModal = ({
  isOpen,
  onClose,
  onUserSignup,
  onTrainerSignup,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUserSignup: () => void;
  onTrainerSignup: () => void;
  onLogin: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,15,30,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: 'modalPop 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          <FiX size={16} />
        </button>

        <div className="px-8 pt-8 pb-10">
          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              🚀 Get Started Free
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              How would you like to join?
            </h2>
            <p className="text-gray-500 text-sm">
              Choose your path to fitness success
            </p>
          </div>

          {/* Two role cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* User card */}
            <button
              onClick={onUserSignup}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-50 bg-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                <FiUsers size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                Join as User
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Get AI workout plans & book sessions with elite trainers
              </p>
              <div className="mt-4 w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold group-hover:bg-blue-700 transition-colors">
                Sign Up Free
              </div>
            </button>

            {/* Trainer card */}
            <button
              onClick={onTrainerSignup}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-green-500 transition-all duration-200 hover:shadow-lg hover:shadow-green-50 bg-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
                <FiAward size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                Become a Trainer
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Grow your client base & manage sessions on one platform
              </p>
              <div className="mt-4 w-full py-2 rounded-xl bg-green-600 text-white text-xs font-bold group-hover:bg-green-700 transition-colors">
                Apply Now
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Login link */}
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
          >
            Log In to FitStack
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Main Home Component ────────────────────────────────────────────────────────
const Home = () => {
  const userData = useSelector((state: Rootstate) => state.authData);
  const navigate = useNavigate();
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // ── Guest check ──────────────────────────────────────────────────────────────
  const isLoggedIn = !!userData.email;
  const firstName = userData.name?.split(' ')[0];

  // ── CTA handler: logged-in → navigate directly, guest → show join modal ─────
  const handleCTA = (loggedInPath: string) => {
    if (isLoggedIn) {
      navigate(loggedInPath);
    } else {
      setJoinModalOpen(true);
    }
  };

  const handleUserSignup   = () => { setJoinModalOpen(false); navigate('/signup?role=user'); };
  const handleTrainerSignup = () => { setJoinModalOpen(false); navigate('/signup?role=trainer'); };
  const handleLogin        = () => { setJoinModalOpen(false); navigate('/login'); };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Join Modal */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onUserSignup={handleUserSignup}
        onTrainerSignup={handleTrainerSignup}
        onLogin={handleLogin}
      />

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-16 pb-24 px-6 md:px-12 bg-gray-50 overflow-hidden">
        {/* subtle bg decoration */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left relative z-10">
          {isLoggedIn ? (
            <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
              Welcome Back, {firstName}! 👋
            </p>
          ) : (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              🔥 Join 10,000+ members
            </div>
          )}

          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
            <span className="text-blue-700">AI-Powered</span> Fitness. <br />
            Coached by Experts.
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mb-10">
            FitStack combines cutting-edge AI with elite human coaching to
            deliver truly personalized workout and diet plans.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  className="bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-[1.02]"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
                <button
                  className="bg-green-500 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.02]"
                  onClick={() => navigate('/trainers')}
                >
                  View Trainers
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-[1.02]"
                  onClick={() => setJoinModalOpen(true)}
                >
                  Get Started Free
                </button>
                <button
                  className="bg-white border-2 border-gray-200 text-gray-700 text-base font-semibold px-8 py-3 rounded-xl hover:border-blue-400 hover:text-blue-700 transition duration-300"
                  onClick={() => navigate('/trainers')}
                >
                  Browse Trainers
                </button>
              </>
            )}
          </div>

          {/* Trust badges — only for guests */}
          {!isLoggedIn && (
            <div className="flex items-center gap-4 mt-8 justify-center md:justify-start flex-wrap">
              {['No credit card', 'Cancel anytime', 'Free AI plan'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <FiCheckCircle size={13} className="text-green-500" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex justify-center relative z-10">
          <img
            src={gymImage}
            alt="Modern gym interior"
            className="rounded-3xl shadow-2xl object-cover max-h-[500px] w-full md:w-auto"
          />
        </div>
      </section>

      {/* ── Feature Showcase ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            POWERED BY INTELLIGENCE
          </h3>
          <h2 className="text-4xl font-bold text-gray-900">
            Our Core FitStack Advantage
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FiZap />,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              title: 'AI-Powered Workout Plans',
              desc: 'Receive dynamic workout routines tailored to your current fitness level, goals, and recovery rate, constantly adjusting for maximum efficiency.'
            },
            {
              icon: <FiTarget />,
              color: 'text-green-600',
              bg: 'bg-green-50',
              title: 'Personalized Diet Coaching',
              desc: 'No more guessing. Get a comprehensive meal plan based on your dietary restrictions, preferences, and fitness objectives, all managed by AI.'
            },
            {
              icon: <FiUser />,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
              title: 'Access to Elite Trainers',
              desc: 'Combine AI efficiency with human expertise. Connect with certified trainers for guidance, motivation, and accountability when you need it most.'
            },
          ].map(f => (
            <div key={f.title} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-blue-100 group">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 text-2xl ${f.color} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">{f.title}</h4>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trainer Interaction Section ──────────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">
              HUMAN CONNECTION
            </h3>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Connect with Your Personal Trainer
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              FitStack ensures you never train alone. Our platform facilitates
              direct, seamless communication with your coach, integrating human
              insight with your AI plan.
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <div className="text-green-400 mr-3 mt-1 flex-shrink-0"><FiVideo /></div>
                <p>Live Video Call Sessions for form correction and personalized workouts.</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-3 mt-1 flex-shrink-0"><FiMessageSquare /></div>
                <p>Instant Chat Feature for quick questions and daily check-ins with your trainer.</p>
              </li>
            </ul>
            <button
              className="mt-10 bg-green-500 text-gray-900 text-base font-semibold px-8 py-3 rounded-full hover:bg-green-400 transition duration-300 shadow-xl"
              onClick={() => handleCTA('/trainers')}
            >
              Meet Our Trainers <FiArrowRight className="inline ml-2" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src={gymarea}
              alt="Trainer on a video call"
              className="rounded-2xl shadow-2xl object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── Premium Upgrade Section ──────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src={gymImage2}
              alt="Premium fitness experience"
              className="rounded-3xl shadow-2xl object-cover w-full h-auto"
            />
          </div>

          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
              🌟 Limited Time Offer
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Ready to Unlock Your{' '}
              <span className="text-blue-700">Full Potential?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upgrade to Premium and get access to advanced AI workout plans,
              personalized nutrition coaching, unlimited trainer chat, and
              exclusive video sessions.
            </p>

            <ul className="space-y-4 text-left mb-8">
              {[
                'Advanced AI-powered workout programs tailored to your goals',
                'Personalized meal plans and macro tracking',
                'Weekly video sessions with certified trainers',
                'Priority support and unlimited messaging',
              ].map(item => (
                <li key={item} className="flex items-start">
                  <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleCTA('/subscription')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105"
              >
                {isLoggedIn ? 'Upgrade to Premium' : 'Get Started Free'}
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="border-2 border-blue-700 text-blue-700 text-lg font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition duration-300"
              >
                Learn More
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              💳 Cancel anytime. No long-term commitment required.
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 px-6 md:px-12" id="reviews">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            SOCIAL PROOF
          </h3>
          <h2 className="text-4xl font-bold text-gray-900">
            Hear From Our Community
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              text: '"The AI plans kept me motivated, and the weekly video calls with my trainer were game-changing for my deadlift form. I\'ve never felt stronger."',
              author: 'Alex R., User since 2024',
            },
            {
              text: '"FitStack helped me lose 20 lbs by providing a diet plan that actually fit my busy schedule. The nutritionist chat feature is priceless."',
              author: 'Sarah L., Working Professional',
            },
            {
              text: '"As a trainer, the platform is superb. The AI handles the initial programming, allowing me to focus on high-value coaching during video sessions."',
              author: 'Coach Mark D., FitStack Trainer',
            },
          ].map((review, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300"
            >
              <div className="flex text-yellow-400 mb-4 gap-0.5">
                {[...Array(5)].map((_, s) => <FiStar key={s} className="fill-yellow-400" />)}
              </div>
              <p className="text-gray-600 italic mb-5 leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {review.author.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA Banner — only for guests ──────────────────────────────── */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-blue-700 to-indigo-700 py-16 px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to transform your fitness?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of users already hitting their goals with FitStack.
            </p>
            <button
              onClick={() => setJoinModalOpen(true)}
              className="bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start for Free Today
            </button>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-gray-800">
            <h2 className="text-2xl font-extrabold text-white">FitStack</h2>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition duration-300">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-sm">
            <p className="mb-1">FitStack is dedicated to providing the best AI-driven and human-led fitness experience.</p>
            <p className="text-gray-600">© {new Date().getFullYear()} FitStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;