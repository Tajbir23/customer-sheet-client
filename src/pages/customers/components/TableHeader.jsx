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
            return <FaSort className="ml-2 w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)] transition-colors" />;
        }
        return sortConfig.direction === 'asc' ?
            <FaSortUp className="ml-2 w-3 h-3 text-[var(--accent-purple)]" /> :
            <FaSortDown className="ml-2 w-3 h-3 text-[var(--accent-purple)]" />;
    };

    return (
        <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        scope="col"
                        className={`
                            group px-6 py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap text-[var(--text-tertiary)]
                            ${!header.showOnMobile ? 'hidden md:table-cell' : ''} 
                            ${header.sortable ? 'cursor-pointer hover:bg-[var(--bg-hover)] transition-all duration-200 select-none' : ''}
                        `}
                        onClick={() => header.sortable && onSort(header.key)}
                    >
                        <div className="flex items-center">
                            <span className={`font-semibold transition-colors duration-200 ${sortConfig?.key === header.key ? 'text-[var(--accent-purple-light)]' : ''}`}>
                                {header.label}
                            </span>
                            {header.sortable && getSortIcon(header.key)}

                            {/* Active Sort Indicator */}
                            {header.sortable && sortConfig?.key === header.key && (
                                <span className="ml-2 w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--accent-purple)]" />
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;