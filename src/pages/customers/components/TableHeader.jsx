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
            <FaSortUp className="ml-2 w-3 h-3 text-blue" /> : 
            <FaSortDown className="ml-2 w-3 h-3 text-blue" />;
    };

    return (
        <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        scope="col"
                        className={`group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            !header.showOnMobile ? 'hidden md:table-cell' : ''
                        } ${
                            header.sortable 
                                ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 select-none' 
                                : ''
                        }`}
                        onClick={() => header.sortable && onSort(header.key)}
                    >
                        <div className="flex items-center">
                            <span>{header.label}</span>
                            {header.sortable && getSortIcon(header.key)}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader; 