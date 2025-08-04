import React from 'react';

const PageSizeSelector = ({ pageSize, onPageSizeChange }) => {
    const pageSizeOptions = [5, 10, 25, 50, 100];

    return (
        <div className="flex items-center space-x-3 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <label 
                htmlFor="pageSize" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                Display
            </label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="min-w-[70px] text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
            >
                {pageSizeOptions.map(size => (
                    <option 
                        key={size} 
                        value={size}
                        className="font-medium"
                    >
                        {size}
                    </option>
                ))}
            </select>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                items per page
            </span>
        </div>
    );
};

export default PageSizeSelector;