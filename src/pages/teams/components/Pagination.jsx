import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
                    pages.push("...");
                    pages.push(totalPages);
                }
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                if (totalPages > 5) {
                    pages.push("...");
                }
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
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${currentPage === 1
                    ? "border-transparent text-[var(--text-muted)] cursor-not-allowed"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
                    }`}
            >
                <FaChevronLeft className="w-3 h-3" />
                <span>Previous</span>
            </button>

            {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === "..." ? (
                        <span className="px-3 py-2 text-[var(--text-muted)]">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] h-10 rounded-lg font-bold transition-all duration-200 border ${currentPage === page
                                ? "bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white shadow-md"
                                : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${currentPage >= totalPages
                    ? "border-transparent text-[var(--text-muted)] cursor-not-allowed"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
                    }`}
            >
                <span>Next</span>
                <FaChevronRight className="w-3 h-3" />
            </button>
        </div>
    );
};

export default Pagination;
