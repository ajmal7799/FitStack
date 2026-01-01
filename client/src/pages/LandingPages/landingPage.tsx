import { useNavigate } from 'react-router-dom';
import gymImage from '../../assets/gym.jpg';
import gymarea from '../../assets/gymarea.jpg';
// NOTE: I've removed the redundant duplicate code block at the end of your request.

// --- Icon Imports (Assuming you have 'react-icons' installed) ---
import {
  FiZap,
  FiTarget,
  FiVideo,
  FiMessageSquare,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserSignup = () => {
    navigate('/signup?role=user');
  };

  const handleTrainerSignup = () => {
    navigate('/signup?role=trainer');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* 🏋️ Navbar - Light Theme */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-blue-700">FitStack</h1>
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Home
          </li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Features
          </li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Trainers
          </li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Pricing
          </li>{' '}
          {/* Added Navigation */}
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Reviews
          </li>{' '}
          {/* Added Navigation */}
        </ul>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogin}
            className="text-sm font-medium text-blue-700 hover:text-blue-800 transition duration-300"
          >
            Log In
          </button>
          <button
            onClick={handleUserSignup}
            className="hidden sm:inline-block bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:bg-blue-800 transition duration-300"
          >
            Start Your Journey
          </button>
        </div>
      </nav>

      {/* 🌟 Hero Section - Professional & Focused */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-16 pb-24 px-6 md:px-12 bg-gray-50">
        {' '}
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          {' '}
          <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
           Your Personal Fitness Evolution {' '}
          </p>{' '}
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
            <span className="text-blue-700">AI-Powered</span> Fitness. <br />
            Coached by Experts.{' '}
          </h2>{' '}
          <p className="text-lg text-gray-600 max-w-lg mb-10">
             FitStack combines cutting-edge AI with elite human
            coaching to deliver truly personalized workout and diet plans.{' '}
          </p>
          {/* Landing Page Call-to-Action Buttons */}{' '}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            {' '}
            <button
              className="bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-[1.02]"
              onClick={handleUserSignup}
            >
            Start Your Free Trial{' '}
            </button>{' '}
            <button
              className="bg-green-500 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.02]"
              onClick={handleTrainerSignup}
            >
    Join as Trainer{' '}
            </button>{' '}
          </div>{' '}
        </div>
        {/* Hero Image - Using one of the imported images */}{' '}
        <div className="md:w-1/2 flex justify-center">
          {' '}
          <img
            src={gymImage}
            alt="Modern gym interior"
            className="rounded-3xl shadow-2xl object-cover max-h-[500px] w-full md:w-auto"
          />{' '}
        </div>{' '}
      </section>

      {/* 🚀 Feature Showcase: AI & Plans */}
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
          {/* Feature 1: AI Workout Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition duration-500 hover:shadow-2xl hover:border-blue-100">
            <div className="text-4xl text-blue-600 mb-4">
              <FiZap />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">
              AI-Powered Workout Plans
            </h4>
            <p className="text-gray-600">
              Receive dynamic workout routines tailored to your current fitness
              level, goals, and recovery rate, constantly adjusting for maximum
              efficiency.
            </p>
          </div>

          {/* Feature 2: AI Diet Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition duration-500 hover:shadow-2xl hover:border-blue-100">
            <div className="text-4xl text-green-600 mb-4">
              <FiTarget />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">
              Personalized Diet Coaching
            </h4>
            <p className="text-gray-600">
              No more guessing. Get a comprehensive meal plan based on your
              dietary restrictions, preferences, and fitness objectives, all
              managed by AI.
            </p>
          </div>

          {/* Feature 3: Expert Trainer Access */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition duration-500 hover:shadow-2xl hover:border-blue-100">
            <div className="text-4xl text-orange-600 mb-4">
              <FiUser />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">
              Access to Elite Trainers
            </h4>
            <p className="text-gray-600">
              Combine AI efficiency with human expertise. Connect with certified
              trainers for guidance, motivation, and accountability when you
              need it most.
            </p>
          </div>
        </div>
      </section>

      {/* 🗣️ Trainer Interaction Section */}
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
                <div className="text-green-400 mr-3 mt-1">
                  <FiVideo />
                </div>
                <p>
                  Live **Video Call Sessions** for form correction and
                  personalized workouts.
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-3 mt-1">
                  <FiMessageSquare />
                </div>
                <p>
                  **Instant Chat Feature** for quick questions and daily
                  check-ins with your trainer.
                </p>
              </li>
            </ul>
            <button
              className="mt-10 bg-green-500 text-gray-900 text-base font-semibold px-8 py-3 rounded-full hover:bg-green-400 transition duration-300 shadow-xl"
              onClick={() => navigate('/trainers')}
            >
              Meet Our Trainers <FiArrowRight className="inline ml-2" />
            </button>
          </div>

          {/* Trainer Interaction Image */}
          <div className="md:w-1/2">
            <img
              src={gymarea}
              alt="Trainer on a video call"
              className="rounded-2xl shadow-2xl object-cover w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* 💰 Pricing Section (NEW) */}
      <section className="py-24 px-6 md:px-12 bg-white" id="pricing">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            AFFORDABLE FITNESS
          </h3>
          <h2 className="text-4xl font-bold text-gray-900">
            Choose Your FitStack Plan
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plan 1: Basic AI */}
          <div className="flex flex-col bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">AI Core</h4>
            <p className="text-gray-500 mb-6">
              Start your smart fitness journey.
            </p>
            <p className="text-5xl font-extrabold text-blue-700 mb-6">
              $19<span className="text-lg font-medium text-gray-500">/mo</span>
            </p>
            <ul className="space-y-3 text-gray-700 flex-grow">
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> AI Workout
                Generator
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Basic AI Diet
                Plans
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Progress
                Tracking
              </li>
              <li className="flex items-center text-gray-400">
                <FiMessageSquare className="mr-2" /> Chat with Trainer (Add-on)
              </li>
            </ul>
            <button className="mt-8 w-full bg-blue-100 text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition">
              Get Started
            </button>
          </div>

          {/* Plan 2: Pro (Best Value) */}
          <div className="flex flex-col bg-blue-700 text-white p-8 rounded-2xl shadow-2xl scale-[1.05] border-4 border-blue-500">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-2">
              Most Popular
            </p>
            <h4 className="text-3xl font-bold mb-2">Pro Stack</h4>
            <p className="text-blue-200 mb-6">
              Full AI power with expert support.
            </p>
            <p className="text-6xl font-extrabold text-yellow-400 mb-6">
              $49<span className="text-xl font-medium text-blue-200">/mo</span>
            </p>
            <ul className="space-y-3 text-blue-100 flex-grow">
              <li className="flex items-center">
                <FiCheckCircle className="text-green-400 mr-2" /> **AI Workout
                Plan (Premium)**
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-400 mr-2" /> **AI Diet Plan
                (Advanced)**
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-400 mr-2" /> Unlimited Chat
                with Trainer
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-400 mr-2" /> 1 Video
                Session/mo
              </li>
            </ul>
            <button className="mt-8 w-full bg-yellow-400 text-blue-900 font-bold px-6 py-4 rounded-full hover:bg-yellow-300 transition shadow-xl">
              Choose Pro Stack
            </button>
          </div>

          {/* Plan 3: Premium */}
          <div className="flex flex-col bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Elite Coach
            </h4>
            <p className="text-gray-500 mb-6">
              Dedicated coaching and full customization.
            </p>
            <p className="text-5xl font-extrabold text-blue-700 mb-6">
              $99<span className="text-lg font-medium text-gray-500">/mo</span>
            </p>
            <ul className="space-y-3 text-gray-700 flex-grow">
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> All Pro Stack
                Features
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> **Weekly Video
                Sessions**
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Priority
                Trainer Access
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" /> Custom Macro
                Adjustments
              </li>
            </ul>
            <button className="mt-8 w-full bg-blue-100 text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition">
              Request Elite
            </button>
          </div>
        </div>
      </section>

      {/* ⭐ Testimonials Section (NEW) */}
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
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex text-yellow-500 mb-4">
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
            </div>
            <p className="text-gray-600 italic mb-4">
              "The AI plans kept me motivated, and the weekly video calls with
              my trainer were game-changing for my deadlift form. I've never
              felt stronger."
            </p>
            <p className="font-semibold text-gray-900">
              - Alex R., User since 2024
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex text-yellow-500 mb-4">
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
            </div>
            <p className="text-gray-600 italic mb-4">
              "FitStack helped me lose 20 lbs by providing a diet plan that
              actually fit my busy schedule. The nutritionist chat feature is
              priceless."
            </p>
            <p className="font-semibold text-gray-900">
              - Sarah L., Working Professional
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex text-yellow-500 mb-4">
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
            </div>
            <p className="text-gray-600 italic mb-4">
              "As a trainer, the platform is superb. The AI handles the initial
              programming, allowing me to focus on high-value coaching during
              video sessions."
            </p>
            <p className="font-semibold text-gray-900">
              - Coach Mark D., FitStack Trainer
            </p>
          </div>
        </div>
      </section>

      {/* 🏷️ Final Call-to-Action */}
      <section className="bg-blue-700 py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Stack Your Fitness?
        </h2>
        <p className="text-lg text-blue-200 mb-8">
          Stop waiting, start achieving. Join the FitStack community today.
        </p>
        <button
          className="bg-white text-blue-700 text-lg font-bold px-10 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          onClick={handleUserSignup}
        >
          Sign Up Now
        </button>
      </section>

      {/* 🦶 Footer */}
      <footer className="bg-gray-100 text-center py-8 text-gray-600 text-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <p className="mb-2">
            FitStack is dedicated to providing the best AI-driven and human-led
            fitness experience.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-blue-700 transition duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-700 transition duration-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-700 transition duration-300">
              Contact Us
            </a>
          </div>
          <p className="text-gray-500">
            © {new Date().getFullYear()} FitStack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
