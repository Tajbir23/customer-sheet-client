import React from "react";

const AdminFilter = ({ admins, onFilterChange }) => {
    return (
        <div className="relative inline-block">
            <select
                onChange={(e) => onFilterChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg font-medium hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
                <option value="">Filter by Admin</option>
                {admins.map((admin) => (
                    <option key={admin._id} value={admin._id}>
                        {admin.username}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};

export default AdminFilter;
