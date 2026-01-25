import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        // Always show first page
        pageNumbers.push(1);

        if (totalPages <= maxVisiblePages) {
            // If total pages are less than max visible, show all pages
            for (let i = 2; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Complex pagination with ellipsis
            if (currentPage <= halfVisible + 1) {
                // Near the start
                for (let i = 2; i <= maxVisiblePages - 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - halfVisible) {
                // Near the end
                pageNumbers.push('...');
                for (let i = totalPages - (maxVisiblePages - 2); i < totalPages; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(totalPages);
            } else {
                // Middle
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${currentPage === 1
                    ? 'border-transparent text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] hover:bg-[var(--bg-hover)]'
                    }`}
            >
                <FaChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-[var(--text-muted)]"
                        >
                            {page}
                        </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${currentPage === page
                                ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white shadow-md'
                                : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)]'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${currentPage === totalPages
                    ? 'border-transparent text-[var(--text-muted)] cursor-not-allowed'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-blue)] hover:bg-[var(--bg-hover)]'
                    }`}
            >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="w-3 h-3" />
            </button>
        </div>
    );
};

export default Pagination;