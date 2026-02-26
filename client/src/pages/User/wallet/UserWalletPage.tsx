// pages/user/wallet/UserWalletPage.tsx
import { Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useGetWallet } from '../../../hooks/User/userServiceHooks';
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';

const transactionConfig: Record<string, { label: string; color: string; icon: React.ReactNode; sign: string }> = {
    REFUND: {
        label: 'Refund',
        color: 'text-green-600',
        icon: <ArrowDownCircle className="w-5 h-5 text-green-500" />,
        sign: '+',
    },
    SUBSCRIPTION_PAYMENT: {
        label: 'Subscription Payment',
        color: 'text-red-500',
        icon: <ArrowUpCircle className="w-5 h-5 text-red-500" />,
        sign: '-',
    },
};

const UserWalletPage = () => {
    const { data, isLoading, isError, refetch } = useGetWallet();

    const wallet = data;
    const transactions = wallet?.transactions || [];

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
            <UserSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Wallet className="w-7 h-7 text-blue-600" />
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
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-20 text-red-500">
                                Failed to load wallet. Please try again.
                            </div>
                        ) : (
                            <>
                                {/* Balance Card */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                                    <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                                    <p className="text-4xl font-bold">
                                        ₹{wallet?.balance?.toFixed(2) || '0.00'}
                                    </p>
                                    <p className="text-blue-200 text-xs mt-3">
                                        Use your balance to purchase subscriptions
                                    </p>
                                </div>

                                {/* Transaction History */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">Transaction History</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transactions</p>
                                    </div>

                                    {transactions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                            <Wallet className="w-12 h-12 mb-3 opacity-30" />
                                            <p className="text-sm font-medium">No transactions yet</p>
                                            <p className="text-xs mt-1">Your transaction history will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {[...transactions].reverse().map((tx: any) => {
                                                const config = transactionConfig[tx.type] || {
                                                    label: tx.type,
                                                    color: 'text-gray-600',
                                                    icon: <ArrowDownCircle className="w-5 h-5 text-gray-400" />,
                                                    sign: '+',
                                                };
                                                return (
                                                    <div key={tx._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                                        {/* Icon */}
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                            {config.icon}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900">{config.label}</p>
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">{tx.description}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                                                        </div>

                                                        {/* Amount */}
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

export default UserWalletPage;