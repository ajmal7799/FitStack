import { useState } from "react";
import {
  Users,
  UserCheck,
  Video,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useGetDashboardStats,
  useGetDashboardCharts,
} from "../../../hooks/Admin/useDashboard";
import AdminSidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/Header";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const AdminDashboard = () => {
  const [period, setPeriod] = useState<Period>("monthly");
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: charts, isLoading: chartsLoading } =
    useGetDashboardCharts(period);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Trainers",
      value: stats?.totalTrainers || 0,
      icon: UserCheck,
      color: "bg-purple-500",
    },
    {
      label: "Total Sessions",
      value: stats?.totalSessions || 0,
      icon: Video,
      color: "bg-green-500",
    },
    {
      label: "Total Memberships",
      value: stats?.totalMemberships || 0,
      icon: CreditCard,
      color: "bg-orange-500",
    },
    {
      label: "Active Memberships",
      value: stats?.activeMemberships || 0,
      icon: CheckCircle,
      color: "bg-teal-500",
    },
    {
      label: "Completed Sessions",
      value: stats?.completedSessions || 0,
      icon: Activity,
      color: "bg-indigo-500",
    },
    {
      label: "Cancelled Sessions",
      value: stats?.cancelledSessions || 0,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      label: "Platform Revenue",
      value: `₹${(stats?.platformRevenue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
  ];

  const periods: { label: string; value: Period }[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back! Here's what's happening.
            </p>
          </div>

          {/* Stat Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-5 shadow-sm animate-pulse h-24"
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Period Filter */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit mb-6">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.value
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Charts */}
          {chartsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-72"
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Line Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Platform Revenue
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={charts?.revenueChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
    dataKey="label"
    tick={{ fontSize: 10 }}
    angle={-35}           // ← angle labels
    textAnchor="end"
    height={60}           // ← give more space for angled labels
    interval={0}          // ← show all labels
/>
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#111827"
                      strokeWidth={2}
                      dot={{ fill: "#111827", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth Bar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  User & Trainer Growth
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={(charts?.userGrowthChart || []).map(
                      (item: any, index: number) => ({
                        label: item.label,
                        Users: item.value,
                        Trainers:
                          charts?.trainerGrowthChart?.[index]?.value || 0,
                      }),
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
    dataKey="label"
    tick={{ fontSize: 10 }}
    angle={-35}           // ← angle labels
    textAnchor="end"
    height={60}           // ← give more space for angled labels
    interval={0}          // ← show all labels
/>
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Users" fill="#374151" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="Trainers"
                      fill="#6b7280"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Session Status Donut Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Session Status
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={charts?.sessionStatusChart || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="label"
                      paddingAngle={3}
                    >
                      {(charts?.sessionStatusChart || []).map(
                        (_: any, index: number) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Membership Bar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  New Memberships
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={charts?.membershipChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
    dataKey="label"
    tick={{ fontSize: 10 }}
    angle={-35}           // ← angle labels
    textAnchor="end"
    height={60}           // ← give more space for angled labels
    interval={0}          // ← show all labels
/>
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [value, "Memberships"]} />
                    <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
