import React from "react";


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === 1
          ? "text-[var(--text-muted)] cursor-not-allowed"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          }`}
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        <span className="w-3 h-3 font-bold">&lt;</span>
        Previous
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-[var(--text-muted)]">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-300 ${currentPage === page
                ? "text-white shadow-lg"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              style={{
                background: currentPage === page
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                  : undefined,
                border: currentPage === page ? 'none' : '1px solid var(--border-subtle)',
                boxShadow: currentPage === page ? '0 4px 15px rgba(239, 68, 68, 0.4)' : undefined,
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === totalPages
          ? "text-[var(--text-muted)] cursor-not-allowed"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          }`}
        style={{ border: '1px solid var(--border-subtle)' }}
      >
        Next
        <span className="w-3 h-3 font-bold">&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
