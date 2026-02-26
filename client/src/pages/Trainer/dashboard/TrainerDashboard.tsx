// pages/trainer/dashboard/TrainerDashboard.tsx
import { useState } from 'react';
import { TrendingUp, Video, Users, Star, ArrowUp, ArrowDown, Activity,  } from 'lucide-react';
import { useGetTrainerDashboardStats, useGetTrainerDashboardCharts } from '../../../hooks/Trainer/useTrainerDashboard';
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const TrainerDashboard = () => {
    const [period, setPeriod] = useState<Period>('monthly');
    const { data: stats, isLoading: statsLoading } = useGetTrainerDashboardStats();
    const { data: charts, isLoading: chartsLoading } = useGetTrainerDashboardCharts(period);

    const earningsChange = stats
        ? stats.lastMonthEarnings > 0
            ? (((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100).toFixed(1)
            : null
        : null;

    const isPositive = earningsChange !== null && parseFloat(earningsChange) >= 0;

    const statCards = [
        {
            label: 'Total Earnings',
            value: `₹${(stats?.totalEarnings || 0).toFixed(2)}`,
            icon: TrendingUp,
            color: '#f58d42',
            bg: '#fff3e8',
            sub: stats ? `₹${stats.thisMonthEarnings.toFixed(2)} this month` : '',
        },
        {
            label: 'Total Sessions',
            value: stats?.totalSessions || 0,
            icon: Video,
            color: '#3b82f6',
            bg: '#eff6ff',
            sub: `${stats?.completedSessions || 0} completed`,
        },
        {
            label: 'Total Clients',
            value: stats?.totalClients || 0,
            icon: Users,
            color: '#8b5cf6',
            bg: '#f5f3ff',
            sub: 'All time clients',
        },
        {
            label: 'Average Rating',
            value: stats?.averageRating || '0.0',
            icon: Star,
            color: '#f59e0b',
            bg: '#fffbeb',
            sub: `${stats?.totalRatings || 0} total ratings`,
        },
    ];

    const periods: { label: string; value: Period }[] = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TrainerHeader />
                <div className="flex-1 overflow-y-auto p-4 md:p-6">

                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Track your performance and earnings</p>
                    </div>

                    {/* Monthly Summary Banner */}
                    {!statsLoading && stats && (
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500">This Month Earnings</p>
                                <p className="text-3xl font-bold text-gray-900">₹{stats.thisMonthEarnings.toFixed(2)}</p>
                            </div>
                            {earningsChange !== null && (
                                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                    isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                }`}>
                                    {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    {Math.abs(parseFloat(earningsChange))}% vs last month
                                </div>
                            )}
                            <div className="flex gap-6 text-center">
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats.completedSessions}</p>
                                    <p className="text-xs text-gray-500">Completed</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats.missedSessions}</p>
                                    <p className="text-xs text-gray-500">Missed</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">{stats.cancelledSessions}</p>
                                    <p className="text-xs text-gray-500">Cancelled</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stat Cards */}
                    {statsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-28" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {statCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.bg }}>
                                                <Icon className="w-5 h-5" style={{ color: card.color }} />
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                                        <p className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</p>
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
                                        ? 'text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                style={period === p.value ? { backgroundColor: '#f58d42' } : {}}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Charts */}
                    {chartsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-72" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Earnings Line Chart */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" style={{ color: '#f58d42' }} />
                                        Earnings Over Time
                                    </h2>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={charts?.earningsChart || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={60} interval={0} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                                            <Line type="monotone" dataKey="value" stroke="#f58d42" strokeWidth={2} dot={{ fill: '#f58d42', r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Session Status Donut */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-500" />
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
                                                {(charts?.sessionStatusChart || []).map((_: any, index: number) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Client Growth Bar Chart */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 md:col-span-2">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-500" />
                                        Client Growth
                                    </h2>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={charts?.clientGrowthChart || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={60} interval={0} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip formatter={(value) => [value, 'New Clients']} />
                                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Rated Sessions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <h2 className="font-semibold text-gray-900">Top Rated Sessions</h2>
                                </div>
                                {!charts?.topRatedSessions?.length ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                        <Star className="w-10 h-10 mb-2 opacity-30" />
                                        <p className="text-sm">No ratings yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {charts.topRatedSessions.map((session: any, index: number) => (
                                            <div key={index} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: '#f58d42' }}>
                                                    {session.userAvatar}
                                                </div>
                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900">{session.userName}</p>
                                                    {session.review && (
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{session.review}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">{session.date}</p>
                                                </div>
                                                {/* Stars */}
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4"
                                                            fill={i < session.rating ? '#f59e0b' : 'none'}
                                                            stroke={i < session.rating ? '#f59e0b' : '#d1d5db'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;