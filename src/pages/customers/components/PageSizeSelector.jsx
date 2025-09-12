import React from 'react';

const PageSizeSelector = ({ pageSize, onPageSizeChange }) => {
    const pageSizeOptions = [5, 10, 25, 50, 100];

    return (
        <div className="flex items-center space-x-2 text-sm">
            <label htmlFor="pageSize" className="text-gray-600">
                Show
            </label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white focus:border-blue focus:ring-1 focus:ring-blue outline-none"
            >
                {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            <span className="text-gray-600">entries</span>
        </div>
    );
};

export default PageSizeSelector;