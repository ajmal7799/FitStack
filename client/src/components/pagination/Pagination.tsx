interface PropType {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

function Pagination({ totalPages, currentPage, setPage }: PropType) {
  if (totalPages <= 1) return null;

  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded-lg border font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition text-sm"
      >
        ← Prev
      </button>

      {Array.from({ length: safeTotalPages }, (_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`px-4 py-2 rounded-lg border font-medium transition text-sm
              ${isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage >= safeTotalPages}
        className="px-4 py-2 rounded-lg border font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition text-sm"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;