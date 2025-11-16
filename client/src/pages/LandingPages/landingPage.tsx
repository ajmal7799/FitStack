import { useNavigate } from "react-router-dom"


const LandingPage = () => {

  const navigate = useNavigate();

  const handleUserSignup = () => {
    navigate('/signup?role=user')
  }

  const handleTrainerSignup = () => {
    navigate("/signup?role=trainer")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-400">FitStack Gym</h1>
        <ul className="flex space-x-6 text-sm">
          <li className="hover:text-yellow-400 cursor-pointer">Home</li>
          <li className="hover:text-yellow-400 cursor-pointer">Trainers</li>
          <li className="hover:text-yellow-400 cursor-pointer">Plans</li>
          <li className="hover:text-yellow-400 cursor-pointer">Login</li>
        </ul>
      </nav>

      {/* Hero Section with Landing Buttons */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          Transform Your Body, <span className="text-yellow-400">Transform Your Life</span>
        </h2>
        <p className="text-gray-300 max-w-xl mb-8">
          Join our gym today and start your fitness journey with expert trainers,
          personalized plans, and modern equipment.
        </p>

        {/* Landing Page Buttons */}
        <div>
          <h1 className="text-2xl font-semibold mb-4">Landing Page</h1>
          <div className="flex justify-center">
            <button
              className="bg-amber-300 text-gray-900 h-16 w-28 rounded-2xl mr-3 font-semibold hover:bg-amber-400 transition"
              onClick={handleUserSignup}
            >
              Join as User
            </button>
            <button className="bg-green-600 h-16 w-32 rounded-2xl font-semibold hover:bg-green-500 transition" onClick={handleTrainerSignup}>
              Join as Trainer
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-8 pb-16">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">Personal Training</h3>
          <p className="text-gray-400 text-sm">
            Get one-on-one guidance from certified trainers to achieve your fitness goals faster.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">Modern Equipment</h3>
          <p className="text-gray-400 text-sm">
            Train with the best equipment designed for strength, endurance, and performance.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">Group Classes</h3>
          <p className="text-gray-400 text-sm">
            Stay motivated by joining group sessions led by experienced fitness instructors.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} FitStack Gym. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage