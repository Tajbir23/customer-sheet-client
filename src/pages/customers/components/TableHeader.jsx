import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const TableHeader = ({ sortConfig, onSort }) => {
    const headers = [
        { label: 'Customer Name', key: 'customerName', showOnMobile: true, sortable: false },
        { label: 'Email', key: 'email', showOnMobile: false, sortable: false },
        { label: 'Subscription End', key: 'subscriptionEnd', showOnMobile: false, sortable: true },
        { label: 'GPT Account', key: 'gptAccount', showOnMobile: false, sortable: false },
        { label: 'Order Date', key: 'orderDate', showOnMobile: false, sortable: true },
        { label: 'Payment Status', key: 'paymentStatus', showOnMobile: false, sortable: false },
        { label: 'Actions', key: 'actions', showOnMobile: true, sortable: false }
    ];

    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="ml-1 inline-block" />;
        }
        return sortConfig.direction === 'asc' ? 
            <FaSortUp className="ml-1 inline-block text-blue-600" /> : 
            <FaSortDown className="ml-1 inline-block text-blue-600" />;
    };

    return (
        <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        scope="col"
                        className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                            !header.showOnMobile ? 'hidden md:table-cell' : ''
                        } ${header.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                        onClick={() => header.sortable && onSort(header.key)}
                    >
                        <div className="flex items-center">
                            {header.label}
                            {header.sortable && getSortIcon(header.key)}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader; 