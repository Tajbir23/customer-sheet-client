import React from 'react';

const TableHeader = () => {
    const headers = [
        { label: 'Customer Name', showOnMobile: true },
        { label: 'Email', showOnMobile: false },
        { label: 'Subscription End', showOnMobile: false },
        { label: 'GPT Account', showOnMobile: false },
        { label: 'Order Date', showOnMobile: false },
        { label: 'Payment Status', showOnMobile: false },
        { label: 'Actions', showOnMobile: true }
    ];

    return (
        <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.label}
                        scope="col"
                        className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${!header.showOnMobile ? 'hidden md:table-cell' : ''}`}
                    >
                        {header.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader; 