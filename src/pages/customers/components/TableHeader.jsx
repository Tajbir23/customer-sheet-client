import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const TableHeader = ({ sortConfig, onSort }) => {
    const headers = [
        { label: 'Customer', key: 'customerName', showOnMobile: true, sortable: true },
        { label: 'Contact Information', key: 'email', showOnMobile: false, sortable: true },
        { label: 'Subscription End', key: 'subscriptionEnd', showOnMobile: false, sortable: true },
        { label: 'GPT Account', key: 'gptAccount', showOnMobile: false, sortable: false },
        { label: 'Order Date', key: 'orderDate', showOnMobile: false, sortable: true },
        { label: 'Payment Status', key: 'paymentStatus', showOnMobile: false, sortable: true },
        { label: 'Actions', key: 'actions', showOnMobile: true, sortable: false }
    ];

    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="ml-2 w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />;
        }
        return sortConfig.direction === 'asc' ? 
            <FaSortUp className="ml-2 w-3 h-3 text-blue-600" /> : 
            <FaSortDown className="ml-2 w-3 h-3 text-blue-600" />;
    };

    return (
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        scope="col"
                        className={`group px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                            !header.showOnMobile ? 'hidden md:table-cell' : ''
                        } ${
                            header.sortable 
                                ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 select-none' 
                                : ''
                        }`}
                        onClick={() => header.sortable && onSort(header.key)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="font-semibold">{header.label}</span>
                                {header.sortable && getSortIcon(header.key)}
                            </div>
                            {header.sortable && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200"></div>
                                </div>
                            )}
                        </div>
                        
                        {/* Sort indicator badge */}
                        {header.sortable && sortConfig?.key === header.key && (
                            <div className="absolute -top-1 -right-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader; 