import React from "react";

const AdminFilter = ({ admins, onFilterChange }) => {
    return (
        <div className="relative inline-block mb-8 animate-fade-in">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <span className="text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-purple)] transition-colors font-bold text-lg">≡</span>
                </div>

                <select
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="
                        appearance-none 
                        bg-[var(--bg-card)] 
                        hover:bg-[var(--bg-elevated)]
                        border border-[var(--border-subtle)] 
                        hover:border-[var(--border-default)]
                        text-[var(--text-primary)] 
                        py-2.5 pl-10 pr-10 
                        rounded-xl 
                        font-medium 
                        cursor-pointer 
                        transition-all duration-200 
                        outline-none 
                        focus:border-[var(--accent-purple)] 
                        focus:ring-1 focus:ring-[var(--accent-purple)]
                        shadow-sm
                        min-w-[200px]
                    "
                >
                    <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                        All Admins
                    </option>
                    {admins?.map((admin) => (
                        <option
                            key={admin._id}
                            value={admin._id}
                            className="bg-[var(--bg-card)] text-[var(--text-primary)]"
                        >
                            {admin.username}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-tertiary)]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default AdminFilter;
