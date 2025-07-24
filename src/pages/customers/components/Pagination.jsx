import React from 'react';

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
        <div className="flex justify-center items-center space-x-2 mt-4 mb-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Previous
            </button>
            
            <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1">
                            {page}
                        </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination; 