import React, { useState, useCallback, useMemo } from 'react';
import Table from '../../components/table/Table';
import Pagination from '../../components/pagination/Pagination';
import { useGetAllTrainers, useUpdateTrainerStatus } from '../../hooks/Auth/AuthHooks';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import StatusChangeModal from '../../components/modals/StatusChangeModal';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types/AuthPayloads';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';
import { useNavigate } from 'react-router-dom';

interface TableUser extends User {
	_id: string;
	id: string;
	profileImage?: string;
	averageRating?: number;
}

const TrainersListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetAllTrainers(
    page,
    limit,
    statusFilter,
    debouncedSearch
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
		id: string;
		name: string;
		status: 'ACTIVE' | 'BLOCKED';
	} | null>(null);

  const updateUserStatusMutation: any = useUpdateTrainerStatus();
  const queryClient = useQueryClient();

  const users: User[] = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.users || [];
  }, [data]);

  const totalPages = useMemo(() => {
    const resp = data as any;
    return resp?.data?.data?.totalPages ?? 1;
  }, [data]);

  const formattedUsers: TableUser[] = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        id: u._id,
      })),
    [users]
  );

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

  const handleStatusToggle = useCallback(
    (userId: string, currentStatus: 'ACTIVE' | 'BLOCKED') => {
      const queryKey = ['users', page, limit, statusFilter, debouncedSearch];
      const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

      updateUserStatusMutation.mutate(
        { userId, currentStatus },
        {
          onMutate: async (variables: { userId: string; currentStatus: string }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            if (previousData) {
              const newData = structuredClone(previousData as any);
              const usersArr: any[] = newData.data.data.users || [];
              const updatedUsers = usersArr.map((u: any) =>
                u._id === variables.userId ? { ...u, isActive: newStatus } : u
              );
              const filteredUsers = statusFilter
                ? updatedUsers.filter((u: any) => u.isActive === statusFilter)
                : updatedUsers;
              newData.data.data.users = filteredUsers;
              newData.data.data.totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));
              newData.data.data.totalUsers = filteredUsers.length;
              queryClient.setQueryData(queryKey, newData);
            }
            return { previousData };
          },
          onError: (_err: any, _vars: any, context: any) => {
            if (context?.previousData) {
              queryClient.setQueryData(queryKey, context.previousData);
            }
            toast.error('Failed to update trainer status');
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
          },
          onSuccess: () => {
            toast.success(`Trainer ${newStatus} successfully`);
          },
        }
      );
    },
    [updateUserStatusMutation, queryClient, page, limit, statusFilter, debouncedSearch]
  );

  const headers = useMemo(
    () => [
      {
        id: 'index',
        label: '#',
        render: (row: TableUser) => {
          const pos = users.findIndex((u) => u._id === row._id);
          const idx = pos >= 0 ? (page - 1) * limit + pos + 1 : '-';
          return String(idx);
        },
      },
      {
        id: 'name',
        label: 'Name',
        render: (row: TableUser) => (
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            {row.profileImage ? (
              <img
                src={row.profileImage}
                alt={row.name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-semibold text-sm">
                {row.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate">{row.name}</span>
          </div>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (row: TableUser) => (
          <span className="truncate block max-w-[160px]">{row.email}</span>
        ),
      },
      {
        id: 'phone',
        label: 'Phone',
        render: (row: TableUser) => row.phone || '-',
      },
      {
        id: 'averageRating',
        label: 'Rating',
        render: (row: TableUser) => (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-medium text-gray-700">
              {(row.averageRating ?? 0) > 0 ? row.averageRating!.toFixed(1) : 'N/A'}
            </span>
          </div>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row: TableUser) => (
          <button
            onClick={() => {
              setSelectedUser({ id: row._id, name: row.name, status: row.isActive });
              setModalOpen(true);
            }}
            disabled={updateUserStatusMutation?.isLoading}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition duration-200 disabled:opacity-50 ${
              row.isActive === 'ACTIVE'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {row.isActive}
          </button>
        ),
      },
      {
        id: 'action',
        label: 'Action',
        render: (row: TableUser) => (
          <button
            onClick={() => navigate(`/admin/trainers/${row._id}`)}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            View
          </button>
        ),
      },
    ],
    [updateUserStatusMutation, page, limit, users]
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md m-2 sm:m-4">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
            Trainers Management
          </h1>

          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
            <div className="flex gap-2 w-full sm:w-1/3 relative">
              <input
                type="text"
                placeholder="Search by name or email"
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
                disabled={updateUserStatusMutation?.isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm whitespace-nowrap"
              >
                Search
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              disabled={updateUserStatusMutation?.isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 text-sm w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {/* States */}
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">Loading trainers...</div>
          ) : isError ? (
            <div className="py-10 text-center text-gray-500">No trainers found.</div>
          ) : formattedUsers.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No trainers found.</div>
          ) : (
            <>
              <Table<TableUser> headers={headers} data={formattedUsers} />

              {selectedUser && (
                <StatusChangeModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  name={selectedUser.name}
                  currentStatus={selectedUser.status}
                  onConfirm={() => {
                    handleStatusToggle(selectedUser.id, selectedUser.status);
                    setModalOpen(false);
                  }}
                />
              )}

              {formattedUsers.length > 0 && (
                <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainersListing;