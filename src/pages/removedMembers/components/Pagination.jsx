import React from 'react';

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
                if (totalPages > 5) {
                    pages.push('...');
                    pages.push(totalPages);
                }
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                if (totalPages > 5) {
                    pages.push('...');
                }
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                        ? 'text-[var(--text-muted)] cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-hover)]'
                    }`}
            >
                Previous
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-[var(--text-muted)]">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                    ? 'bg-[var(--accent-blue)] text-white'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-hover)]'
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage >= totalPages
                        ? 'text-[var(--text-muted)] cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-hover)]'
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;