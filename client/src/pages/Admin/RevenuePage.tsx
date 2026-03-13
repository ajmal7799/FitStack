import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetRevenue } from '../../hooks/Admin/AdminHooks';
import useDebounce from '../../hooks/debouncing/useDebounce';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import {
    TrendingUp,
    IndianRupee,
    Calendar,
    BarChart2,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    Dumbbell,
    Clock,
    XCircle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
interface RevenueTransaction {
    sessionId:   string;
    userName:    string;
    trainerName: string;
    sessionDate: string;
    sessionRate: number;
    platformCut: number;
    trainerCut:  number;
}

interface RevenueStats {
    totalRevenue:     number;
    thisMonthRevenue: number;
    totalSessions:    number;
    avgPerSession:    number;
}

interface RevenueResponse {
    success: boolean;
    data: {
        transactions:      RevenueTransaction[];
        totalTransactions: number;
        totalPages:        number;
        currentPage:       number;
        stats:             RevenueStats;
    };
}

// ── Helpers ──────────────────────────────────────────────────
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ── Stat Card ────────────────────────────────────────────────
interface StatCardProps {
    label:     string;
    value:     string;
    icon:      React.ReactNode;
    delay:     number;
    highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, delay, highlight }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`rounded-xl p-5 flex items-center gap-4 shadow-sm border ${
            highlight
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-100 text-gray-800'
        }`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            highlight ? 'bg-white/20' : 'bg-indigo-600/10'
        }`}>
            <span className={highlight ? 'text-white' : 'text-indigo-600'}>{icon}</span>
        </div>
        <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${highlight ? 'text-white/80' : 'text-gray-500'}`}>
                {label}
            </p>
            <p className={`text-xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
    </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────
const RevenuePage: React.FC = () => {
    const [page, setPage]               = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch               = useDebounce(searchInput, 500);
    const [startDate, setStartDate]     = useState('');
    const [endDate, setEndDate]         = useState('');
    const LIMIT = 10;

    const { data, isLoading, isError, error } = useGetRevenue(
        page, LIMIT, debouncedSearch || undefined, startDate || undefined, endDate || undefined
    );

    const response   = data as RevenueResponse | undefined;
    const stats      = response?.data?.stats;
    const txns       = response?.data?.transactions ?? [];
    const totalPages = response?.data?.totalPages ?? 1;

    const handleClearFilters = () => {
        setSearchInput('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const hasFilters = debouncedSearch || startDate || endDate;

    // ── Loading ───────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <AdminHeader />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 text-sm">Loading revenue data...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="flex h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <AdminHeader />
                    <main className="flex-1 flex items-center justify-center p-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                            <XCircle className="text-red-500 mx-auto mb-3" size={32} />
                            <h3 className="text-red-700 font-semibold mb-1">Failed to load revenue</h3>
                            <p className="text-red-500 text-sm">{(error as Error)?.message || 'Something went wrong'}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* ── Page Title ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Platform earnings from completed sessions
                            </p>
                        </motion.div>

                        {/* ── Stats Cards ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total Revenue"
                                value={formatCurrency(stats?.totalRevenue ?? 0)}
                                icon={<IndianRupee size={22} />}
                                delay={0.1}
                                highlight
                            />
                            <StatCard
                                label="This Month"
                                value={formatCurrency(stats?.thisMonthRevenue ?? 0)}
                                icon={<Calendar size={22} />}
                                delay={0.15}
                            />
                            <StatCard
                                label="Total Sessions"
                                value={String(stats?.totalSessions ?? 0)}
                                icon={<BarChart2 size={22} />}
                                delay={0.2}
                            />
                            <StatCard
                                label="Avg Per Session"
                                value={formatCurrency(stats?.avgPerSession ?? 0)}
                                icon={<TrendingUp size={22} />}
                                delay={0.25}
                            />
                        </div>

                        {/* ── Filters ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                        >
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">

                                {/* Search */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by user or trainer name..."
                                            value={searchInput}
                                            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/40 focus:border-indigo-600"
                                        />
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="w-full sm:w-44">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        From
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/40 focus:border-indigo-600"
                                    />
                                </div>

                                {/* End Date */}
                                <div className="w-full sm:w-44">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        To
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/40 focus:border-indigo-600"
                                    />
                                </div>

                                {/* Clear button */}
                                {hasFilters && (
                                    <div className="flex gap-2 w-full sm:w-auto self-end">
                                        <button
                                            onClick={handleClearFilters}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* ── Table ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            {/* Table header */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-gray-800">Transaction History</h2>
                                <span className="text-xs text-gray-400 font-medium">
                                    {response?.data?.totalTransactions ?? 0} records
                                </span>
                            </div>

                            {txns.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <IndianRupee size={28} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-700 font-semibold mb-1">No revenue records found</p>
                                    <p className="text-gray-400 text-sm">
                                        {hasFilters ? 'Try adjusting your filters' : 'Revenue will appear after sessions are completed'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    <th className="px-5 py-3 text-left">#</th>
                                                    <th className="px-5 py-3 text-left">User</th>
                                                    <th className="px-5 py-3 text-left">Trainer</th>
                                                    <th className="px-5 py-3 text-left">Session Date</th>
                                                    <th className="px-5 py-3 text-right">Session Rate</th>
                                                    <th className="px-5 py-3 text-right">Trainer (80%)</th>
                                                    <th className="px-5 py-3 text-right">Platform (20%)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {txns.map((txn, index) => (
                                                    <motion.tr
                                                        key={txn.sessionId}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: index * 0.04 }}
                                                        className="hover:bg-gray-50/60 transition-colors"
                                                    >
                                                        <td className="px-5 py-3.5 text-gray-400 font-medium">
                                                            {(page - 1) * LIMIT + index + 1}
                                                        </td>

                                                        {/* User */}
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                    <User size={13} className="text-blue-600" />
                                                                </div>
                                                                <span className="font-medium text-gray-800">{txn.userName}</span>
                                                            </div>
                                                        </td>

                                                        {/* Trainer */}
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-indigo-600/10 flex items-center justify-center flex-shrink-0">
                                                                    <Dumbbell size={13} className="text-indigo-600" />
                                                                </div>
                                                                <span className="font-medium text-gray-800">{txn.trainerName}</span>
                                                            </div>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                                <Clock size={13} className="text-gray-400 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-medium text-gray-700">{formatDate(txn.sessionDate)}</p>
                                                                    <p className="text-xs text-gray-400">{formatTime(txn.sessionDate)}</p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Session Rate */}
                                                        <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                                                            {formatCurrency(txn.sessionRate)}
                                                        </td>

                                                        {/* Trainer Cut */}
                                                        <td className="px-5 py-3.5 text-right">
                                                            <span className="text-blue-600 font-semibold">
                                                                {formatCurrency(txn.trainerCut)}
                                                            </span>
                                                        </td>

                                                        {/* Platform Cut */}
                                                        <td className="px-5 py-3.5 text-right">
                                                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-lg text-xs">
                                                                <IndianRupee size={11} />
                                                                {txn.platformCut.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden divide-y divide-gray-100">
                                        {txns.map((txn, index) => (
                                            <motion.div
                                                key={txn.sessionId}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.04 }}
                                                className="p-4 space-y-3"
                                            >
                                                {/* Top row */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User size={13} className="text-blue-600" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800 text-sm">{txn.userName}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{formatDate(txn.sessionDate)}</span>
                                                </div>

                                                {/* Trainer */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-600/10 flex items-center justify-center">
                                                        <Dumbbell size={13} className="text-indigo-600" />
                                                    </div>
                                                    <span className="text-sm text-gray-600">{txn.trainerName}</span>
                                                </div>

                                                {/* Amounts */}
                                                <div className="grid grid-cols-3 gap-2 pt-1">
                                                    <div className="text-center bg-gray-50 rounded-lg p-2">
                                                        <p className="text-xs text-gray-400 mb-0.5">Session</p>
                                                        <p className="text-sm font-bold text-gray-800">₹{txn.sessionRate}</p>
                                                    </div>
                                                    <div className="text-center bg-blue-50 rounded-lg p-2">
                                                        <p className="text-xs text-blue-400 mb-0.5">Trainer 80%</p>
                                                        <p className="text-sm font-bold text-blue-700">₹{txn.trainerCut}</p>
                                                    </div>
                                                    <div className="text-center bg-green-50 rounded-lg p-2">
                                                        <p className="text-xs text-green-400 mb-0.5">Platform 20%</p>
                                                        <p className="text-sm font-bold text-green-700">₹{txn.platformCut}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* ── Pagination ── */}
                            {totalPages > 1 && (
                                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs text-gray-400">
                                        Page {page} of {totalPages}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft size={15} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                            .reduce<(number | string)[]>((acc, p, i, arr) => {
                                                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((p, i) =>
                                                p === '...' ? (
                                                    <span key={`ellipsis-${i}`} className="text-gray-400 text-xs px-1">...</span>
                                                ) : (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p as number)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                                                            page === p
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                )
                                            )}

                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default RevenuePage;