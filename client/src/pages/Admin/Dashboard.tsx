import AdminSidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/Header";



const AdminDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <p className="text-3xl font-bold mt-2">120</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Trainers</h2>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Active Users</h2>
            <p className="text-3xl font-bold mt-2">95</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-500 mt-10 mb-4">
          © 2025 Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;