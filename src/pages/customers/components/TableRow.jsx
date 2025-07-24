import React from 'react';

const TableRow = ({ item, formatDate, onViewDetails, onDelete }) => {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.customerName}
                </div>
            </td>
            
            <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {item.email}
                </div>
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {formatDate(item.subscriptionEnd)}
                </div>
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {item.gptAccount}
                </div>
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(item.orderDate)}
                </div>
            </td>                      
            <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                    {item.paymentStatus}
                </span>
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap">
                <button
                    onClick={() => onViewDetails(item)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                >
                    View Details
                </button>
                <button
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default TableRow; 