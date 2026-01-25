import React from 'react';

const PageSizeSelector = ({ pageSize, onPageSizeChange }) => {
    const pageSizeOptions = [5, 10, 25, 50, 100];

    return (
        <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-300">
            <label
                htmlFor="pageSize"
                className="text-sm font-medium text-[var(--text-tertiary)]"
            >
                Display
            </label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="
                    min-w-[70px] 
                    bg-[var(--bg-elevated)] 
                    text-[var(--text-primary)]
                    text-sm font-semibold 
                    rounded-lg px-3 py-1.5 
                    outline-none cursor-pointer 
                    border border-[var(--border-subtle)]
                    focus:border-[var(--accent-purple)]
                    focus:ring-1 focus:ring-[var(--accent-purple)]
                    transition-all duration-200
                "
            >
                {pageSizeOptions.map(size => (
                    <option
                        key={size}
                        value={size}
                        className="bg-[var(--bg-card)] text-[var(--text-primary)] font-medium"
                    >
                        {size}
                    </option>
                ))}
            </select>
            <span className="text-sm font-medium text-[var(--text-tertiary)]">
                per page
            </span>
        </div>
    );
};

export default PageSizeSelector;