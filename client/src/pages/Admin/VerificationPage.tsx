import React, { useState, useCallback, useMemo } from 'react';
import Table from '../../components/table/Table';
import Pagination from '../../components/pagination/Pagination';
import { useGetAllVerifications } from '../../hooks/Admin/AdminHooks';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/Header'; 

// Define the type properly at the top
export type GetAllVerification = {
  id: string;
  trainerId: string;
  name: string;
  email: string;
  qualification: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
};

// Use the type directly — no need to extend
type VerificationRow = GetAllVerification;

const VerificationListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
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
        render: (_row: VerificationRow, index: number) => (page - 1) * limit + index + 1,
      },
      //  { id: "id", label: "ID", render: (row: GetAllVerification,) => <span>{row.id}</span> },
      { id: 'name',      label: 'Name',          render: (row: VerificationRow) => row.name || '-' },
      { id: 'email',     label: 'Email',         render: (row: VerificationRow) => row.email },
      // { id: "phone",     label: "Phone",         render: (row: VerificationRow) => row.phone || "-" },
      { id: 'qualification', label: 'Qualification', render: (row: VerificationRow) => row.qualification || '-' },
      // { id: "specialisation", label: "Specialisation", render: (row: VerificationRow) => row.specialisation || "-" },
      {
        id: 'status',
        label: 'Status',
        render: (row: VerificationRow) => (
          <span
            className={`px-4 py-2 rounded-full text-xs font-bold ${
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
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition"
          >
            View
          </Link>
        ),
      },
    ],
    [page, limit]
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Trainer Verifications
            </h1>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                  className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500"
                />
                {searchInput && (
                  <button onClick={handleClearSearch} className="px-3 text-gray-500 hover:text-red-600">
                    X
                  </button>
                )}
                <button
                  onClick={handleSearchClick}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Search
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Loading / Error / Empty */}
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