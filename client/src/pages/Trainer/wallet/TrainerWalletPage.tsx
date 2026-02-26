import { Wallet, TrendingUp, ArrowDownCircle, RefreshCw, Loader2, Trophy, Activity } from 'lucide-react';
import { useGetWallet } from '../../../hooks/User/userServiceHooks'; 
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';

const transactionConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; sign: string }> = {
    SESSION_COMMISSION: {
        label: 'Session Commission',
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
        sign: '+',
    },
    PLATFORM_FEE: {
        label: 'Platform Fee',
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        icon: <ArrowDownCircle className="w-5 h-5 text-gray-400" />,
        sign: '-',
    },
};

const TrainerWalletPage = () => {
    const { data, isLoading, isError, refetch } = useGetWallet();

    const wallet = data;
    const transactions = wallet?.transactions || [];

    const totalEarned = transactions
        .filter((tx: any) => tx.type === 'SESSION_COMMISSION')
        .reduce((sum: number, tx: any) => sum + tx.amount, 0);

    const totalSessions = transactions.filter((tx: any) => tx.type === 'SESSION_COMMISSION').length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <TrainerSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TrainerHeader />
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Wallet className="w-7 h-7" style={{ color: '#f58d42' }} />
                                My Wallet
                            </h1>
                            <button
                                onClick={() => refetch()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#f58d42' }} />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-20 text-red-500">
                                Failed to load wallet. Please try again.
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Available Balance */}
                                    <div
                                        className="sm:col-span-1 rounded-2xl p-6 text-white shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #f58d42, #f5a742)' }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wallet className="w-5 h-5 text-orange-100" />
                                            <p className="text-orange-100 text-sm font-medium">Available Balance</p>
                                        </div>
                                        <p className="text-4xl font-bold">
                                            ₹{wallet?.balance?.toFixed(2) || '0.00'}
                                        </p>
                                        <p className="text-orange-100 text-xs mt-2">Ready to use</p>
                                    </div>

                                    {/* Total Earned */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff3e8' }}>
                                                <Trophy className="w-4 h-4" style={{ color: '#f58d42' }} />
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium">Total Earned</p>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">₹{totalEarned.toFixed(2)}</p>
                                        <p className="text-gray-400 text-xs mt-1">All time earnings</p>
                                    </div>

                                    {/* Sessions */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff3e8' }}>
                                                <Activity className="w-4 h-4" style={{ color: '#f58d42' }} />
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium">Sessions Done</p>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
                                        <p className="text-gray-400 text-xs mt-1">Completed sessions</p>
                                    </div>
                                </div>

                                {/* Transaction History */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="font-semibold text-gray-900">Transaction History</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transactions</p>
                                        </div>
                                        {/* Orange accent line */}
                                        <div className="w-8 h-1 rounded-full" style={{ backgroundColor: '#f58d42' }} />
                                    </div>

                                    {transactions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#fff3e8' }}>
                                                <Wallet className="w-8 h-8" style={{ color: '#f58d42' }} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">No transactions yet</p>
                                            <p className="text-xs mt-1">Complete sessions to start earning</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {[...transactions].reverse().map((tx: any) => {
                                                const config = transactionConfig[tx.type] || {
                                                    label: tx.type,
                                                    color: 'text-gray-600',
                                                    bg: 'bg-gray-50',
                                                    icon: <TrendingUp className="w-5 h-5" style={{ color: '#f58d42' }} />,
                                                    sign: '+',
                                                };
                                                return (
                                                    <div key={tx._id} className="flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition-colors">
                                                        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                                            {config.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900">{config.label}</p>
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">{tx.description}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                                                        </div>
                                                        <div className={`text-sm font-bold flex-shrink-0 ${config.color}`}>
                                                            {config.sign}₹{tx.amount.toFixed(2)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerWalletPage;