import React, { useState, useCallback, useMemo } from 'react';
import Table from '../../components/table/Table';
import Pagination from '../../components/pagination/Pagination';
import { useGetAllVerifications } from '../../hooks/Admin/AdminHooks';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header';

export type GetAllVerification = {
  id: string;
  trainerId: string;
  name: string;
  email: string;
  specialisation: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  profileImage?: string; // ✅ added
};

type VerificationRow = GetAllVerification;

const VerificationListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError } = useGetAllVerifications(
    page,
    limit,
    statusFilter,
    debouncedSearch
  );

  const verifications: VerificationRow[] = useMemo(() => {
    return (data as any)?.data?.data?.verifications || [];
  }, [data]);

  const totalPages = useMemo(() => {
    return (data as any)?.data?.data?.totalPages ?? 1;
  }, [data]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value),
    []
  );

  const handleSearchClick = useCallback(() => {
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setPage(1);
  }, []);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
      setPage(1);
    },
    []
  );

  const headers = useMemo(
    () => [
      {
        id: 'index',
        label: '#',
        render: (_row: VerificationRow, index: number) =>
          (page - 1) * limit + index + 1,
      },
      {
        id: 'name',
        label: 'Name',
        render: (row: VerificationRow) => (
          <div className="flex items-center gap-3">
            {/* ✅ Profile image with initial fallback */}
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
            <span className="truncate">{row.name || '-'}</span>
          </div>
        ),
      },
      {
        id: 'email',
        label: 'Email',
        render: (row: VerificationRow) => (
          <span className="truncate block max-w-[160px]">{row.email}</span>
        ),
      },
      {
        id: 'qualification',
        label: 'Specialisation',
        render: (row: VerificationRow) => row.specialisation || '-',
      },
      {
        id: 'status',
        label: 'Status',
        render: (row: VerificationRow) => (
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              row.verificationStatus === 'verified'
                ? 'bg-green-100 text-green-800'
                : row.verificationStatus === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {row.verificationStatus}
          </span>
        ),
      },
      {
        id: 'actions',
        label: 'Actions',
        render: (row: VerificationRow) => (
          <Link
            to={`/admin/verifications/${row.trainerId}`}
            className="px-4 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            View
          </Link>
        ),
      },
    ],
    [page, limit]
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <div className="bg-gray-50 min-h-screen p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              Trainer Verifications
            </h1>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
              <div className="flex gap-2 w-full sm:w-1/2 relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-sm"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm whitespace-nowrap"
                >
                  Search
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-auto"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* States */}
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading verifications...</div>
            ) : isError ? (
              <div className="text-center py-12 text-red-600">Failed to load data</div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No verification requests found</div>
            ) : (
              <>
                <Table<VerificationRow> headers={headers} data={verifications} />
                <div className="mt-6">
                  <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationListing; 