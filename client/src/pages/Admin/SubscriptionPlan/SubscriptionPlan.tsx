// src/pages/admin/SubscriptionPlans.tsx
import React, { useState, useCallback, useMemo } from 'react';
import Table from '../../../components/table/Table';
import Pagination from '../../../components/pagination/Pagination';
import toast from 'react-hot-toast';
import AdminSidebar from '../../../components/admin/Sidebar';
import AdminHeader from '../../../components/admin/Header';
import CreateSubscriptionModal from '../../../components/modals/AddSubscriptionModal';
import EditSubscriptionModal from '../../../components/modals/EditSubscriptionModal';
import ConfirmationModal from '../../../components/confirmModal/ConfirmationModal';
import { X, Edit2 } from 'lucide-react';
import {
  useGetSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlanStatus,
  useGetSubscriptionEditPage,
  useUpdateSubscriptionPlan,
} from '../../../hooks/Admin/SubscriptionHooks';
import type { SubscriptionPlan } from '../../../types/subscriptionPlan';

interface TablePlan extends SubscriptionPlan {
  id: string;
}

interface SelectedPlan {
  id: string;
  planName: string;
  isActive: 'active' | 'inactive';
}

const SubscriptionPlans: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

  const { data, isLoading, isError, refetch } = useGetSubscriptionPlans(
    page,
    limit,
    statusFilter,
    debouncedSearch
  );

  const createMutation = useCreateSubscriptionPlan();
  const updateStatusMutation = useUpdateSubscriptionPlanStatus();
  const updatePlanMutation = useUpdateSubscriptionPlan();

  const {
    data: editData,
    isLoading: isEditLoading,
  } = useGetSubscriptionEditPage(editingPlanId || '');

  const plans: SubscriptionPlan[] = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.subscriptions || [];
  }, [data]);

  const totalPages = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.totalPages || 1;
  }, [data]);

  const formattedPlans: TablePlan[] = useMemo(
    () => plans.map((plan: any) => ({ ...plan, id: plan._id })),
    [plans]
  );

  const editPlanData = useMemo(() => {
    if (!editData) return null;
    return (editData as any)?.data || null;
  }, [editData]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSearchClick = useCallback(() => {
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  const handleEditClick = useCallback((plan: TablePlan) => {
    setEditingPlanId(plan.id);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingPlanId(null);
  }, []);

  const handleUpdatePlan = useCallback(
    (formData: { planName: string; price: number; durationMonths: number; description: string }) => {
      if (!editingPlanId) return;
      updatePlanMutation.mutate(
        { id: editingPlanId, ...formData },
        {
          onSuccess: (res: any) => {
            toast.success(res?.message || 'Plan updated successfully');
            handleCloseEditModal();
            refetch();
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update plan');
          },
        }
      );
    },
    [editingPlanId, updatePlanMutation, refetch, handleCloseEditModal]
  );

  const handleStatusToggle = useCallback((plan: TablePlan) => {
    setSelectedPlan({ id: plan.id, planName: plan.planName, isActive: plan.isActive as 'active' | 'inactive' });
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmStatusChange = useCallback(
    (plan: SelectedPlan) => {
      const newStatus = plan.isActive === 'active' ? 'inactive' : 'active';
      updateStatusMutation.mutate(
        { id: plan.id, status: newStatus },
        {
          onSuccess: () => {
            toast.success(`Plan ${plan.planName} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            refetch();
            setIsConfirmModalOpen(false);
            setSelectedPlan(null);
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update status');
          },
        }
      );
    },
    [updateStatusMutation, refetch]
  );

  const handleCreatePlan = useCallback(
    (formData: { planName: string; price: number; durationMonths: number; description: string }) => {
      createMutation.mutate(formData, {
        onSuccess: (res: any) => {
          toast.success(res.message || 'Plan created successfully');
          setIsCreateModalOpen(false);
          setPage(1);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.response.data?.message || 'Failed to create plan');
        },
      });
    },
    [createMutation, refetch]
  );

  const headers = useMemo(
    () => [
      {
        id: 'index',
        label: '#',
        render: (_: any, index: number) => (page - 1) * limit + index + 1,
      },
      {
        id: 'planName',
        label: 'Plan Name',
        render: (row: TablePlan) => (
          <span className="font-semibold text-gray-800">{row.planName}</span>
        ),
      },
      {
        id: 'price',
        label: 'Price',
        render: (row: TablePlan) => (
          <span className="font-medium text-green-600">₹{row.price.toFixed(2)}</span>
        ),
      },
      {
        id: 'duration',
        label: 'Duration',
        render: (row: TablePlan) => `${row.durationMonths} Month`,
      },
      {
        id: 'description',
        label: 'Description',
        render: (row: TablePlan) => (
          <span className="text-gray-600 text-sm truncate block max-w-[160px]">
            {row.description || '-'}
          </span>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row: TablePlan) => {
          const isActive = row.isActive === 'active';
          return (
            <button
              onClick={() => handleStatusToggle(row)}
              disabled={updateStatusMutation.isPending}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </button>
          );
        },
      },
      {
        id: 'actions',
        label: 'Actions',
        render: (row: TablePlan) => (
          <button
            onClick={() => handleEditClick(row)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Edit Plan"
          >
            <Edit2 size={18} />
          </button>
        ),
      },
    ],
    [page, limit, handleStatusToggle, handleEditClick, updateStatusMutation.isPending]
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
                    Subscription Plans
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your subscription tiers and pricing
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-500/30 text-sm w-full sm:w-auto"
                >
                  + Add Plan
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex gap-2 w-full sm:w-2/3 relative">
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                  {searchInput && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-20 top-2.5 text-gray-500 hover:text-red-500"
                      title="Clear"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button
                    onClick={handleSearchClick}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>

                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 text-sm w-full sm:w-auto"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading plans...</p>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-gray-800 font-medium text-lg">No subscription plans found.</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : formattedPlans.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-600 font-medium text-lg mb-2">
                      No subscription plans found
                      {debouncedSearch && ` for "${debouncedSearch}"`}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Create your first plan or try a different search.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Table headers={headers} data={formattedPlans} />
                  <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                    <Pagination currentPage={page} totalPages={totalPages} setPage={setPage} />
                  </div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateSubscriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
        isLoading={createMutation.isPending}
      />

      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdatePlan}
        isLoading={updatePlanMutation.isPending}
        initialData={editPlanData}
        isLoadingData={isEditLoading}
      />

      {selectedPlan && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          name={selectedPlan.planName}
          currentStatus={selectedPlan.isActive}
          onConfirm={() => handleConfirmStatusChange(selectedPlan)}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;