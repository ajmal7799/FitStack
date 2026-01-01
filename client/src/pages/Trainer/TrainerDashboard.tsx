import TrainerSidebar from '../../components/trainer/Sidebar';
import TrainerHeader from '../../components/trainer/Header';
import { Calendar, DollarSign, MessageCircle, Users, TrendingUp, Clock } from 'lucide-react';

const TrainerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <TrainerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TrainerHeader />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, Trainer!
              </h1>
              <p className="text-gray-400">
                Here's an overview of your training activity
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {/* Total Clients */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-purple-500" size={28} />
                  <span className="text-2xl font-bold">48</span>
                </div>
                <p className="text-gray-400 text-sm">Total Clients</p>
              </div>

              {/* Today's Sessions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="text-blue-500" size={28} />
                  <span className="text-2xl font-bold">6</span>
                </div>
                <p className="text-gray-400 text-sm">Today's Sessions</p>
              </div>

              {/* Pending Messages */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="text-green-500" size={28} />
                  <span className="text-2xl font-bold text-green-400">12</span>
                </div>
                <p className="text-gray-400 text-sm">Pending Chats</p>
              </div>

              {/* This Month Earnings */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-yellow-500" size={28} />
                  <span className="text-2xl font-bold">$8,450</span>
                </div>
                <p className="text-gray-400 text-sm">Earnings This Month</p>
              </div>
            </div>

            {/* Recent Activity & Upcoming Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Sessions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-purple-500" />
                  Upcoming Sessions
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                          JD
                        </div>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-xs text-gray-500">Strength Training</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {i === 1 ? '10:00 AM' : i === 2 ? '02:30 PM' : '05:00 PM'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  This Week Overview
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Sessions Completed</span>
                      <span>28 / 35</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Client Satisfaction</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboard;