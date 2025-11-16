import AdminSidebar from "../../components/admin/Sidebar";
import AdminHeader from "../../components/admin/Header";

const AdminUserPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h1 className="text-2xl font-bold text-gray-700">
              Welcome to the User Management Page
            </h1>
            <p className="text-gray-500 mt-3">
              Here you can view, add, or manage users.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-500 mb-4">
          © 2025 Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminUserPage;
