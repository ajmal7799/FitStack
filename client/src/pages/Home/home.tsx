import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type Rootstate } from "../../redux/store";
import { clearData } from "../../redux/slice/userSlice/authDataSlice";
import toast from "react-hot-toast";
import { useLogout } from "../../hooks/Auth/AuthHooks";
import gymImage from "../../assets/gym.jpg";
import gymarea from "../../assets/gymarea.jpg";
import gymImage2 from "../../assets/gymImage2.jpg";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

// Icon Imports
import {
  FiZap,
  FiTarget,
  FiVideo,
  FiMessageSquare,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiLogOut,
} from "react-icons/fi";

const Home = () => {
  const userData = useSelector((state: Rootstate) => state.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearData());
        toast.success("User logged out successfully");
        window.location.reload();
        navigate("/admin/login");
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar with Logout */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-blue-700">FitStack</h1>
        <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Home
          </li>
          <li
            className="hover:text-blue-700 cursor-pointer transition duration-300"
            onClick={() => navigate(FRONTEND_ROUTES.USER.AI_WORKOUT)}
          >
            AI Diet & Work Out
          </li>
          <li
            className="hover:text-blue-700 cursor-pointer transition duration-300"
            onClick={() => navigate("/subscription")} // Add this onClick
          >
            Subscription
          </li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Trainers
          </li>
          <li className="hover:text-blue-700 cursor-pointer transition duration-300">
            Reviews
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          {/* User Info & Logout */}
          <div className="flex items-center space-x-3">
            {/* Profile Icon */}
            <div
              className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {userData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {userData.name}
              </p>
              {/* <p className="text-xs text-gray-500">{userData.email}</p> */}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:bg-red-700 transition duration-300"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-16 pb-24 px-6 md:px-12 bg-gray-50">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
            Welcome Back, {userData.name?.split(" ")[0]}!
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
            <span className="text-blue-700">AI-Powered</span> Fitness. <br />
            Coached by Experts.
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mb-10">
            FitStack combines cutting-edge AI with elite human coaching to
            deliver truly personalized workout and diet plans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 transform hover:scale-[1.02]"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
            <button
              className="bg-green-500 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.02]"
              onClick={() => navigate("/trainers")}
            >
              View Trainers
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={gymImage}
            alt="Modern gym interior"
            className="rounded-3xl shadow-2xl object-cover max-h-[500px] w-full md:w-auto"
          />
        </div>
      </section>

      {/* Feature Showcase */}
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

      {/* Trainer Interaction Section */}
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
                  Live Video Call Sessions for form correction and personalized
                  workouts.
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-3 mt-1">
                  <FiMessageSquare />
                </div>
                <p>
                  Instant Chat Feature for quick questions and daily check-ins
                  with your trainer.
                </p>
              </li>
            </ul>
            <button
              className="mt-10 bg-green-500 text-gray-900 text-base font-semibold px-8 py-3 rounded-full hover:bg-green-400 transition duration-300 shadow-xl"
              onClick={() => navigate("/trainers")}
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

      {/* Premium Upgrade Section with Image */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Image Side */}
          <div className="md:w-1/2">
            <img
              src={gymImage2}
              alt="Premium fitness experience"
              className="rounded-3xl shadow-2xl object-cover w-full h-auto"
            />
          </div>

          {/* Content Side */}
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
              🌟 Limited Time Offer
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Ready to Unlock Your{" "}
              <span className="text-blue-700">Full Potential?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upgrade to Premium and get access to advanced AI workout plans,
              personalized nutrition coaching, unlimited trainer chat, and
              exclusive video sessions. Take your fitness journey to the next
              level!
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">
                  Advanced AI-powered workout programs tailored to your goals
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">
                  Personalized meal plans and macro tracking
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">
                  Weekly video sessions with certified trainers
                </span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">
                  Priority support and unlimited messaging
                </span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/subscription")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => navigate("/subscription")}
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

      {/* Testimonials Section */}
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

      {/* Footer */}
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

export default Home;
