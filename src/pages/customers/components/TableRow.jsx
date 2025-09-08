import React, { useState } from 'react';
import { FaEye, FaTrash, FaClock, FaCheckCircle, FaExclamationTriangle, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TableRow = ({ item, index, formatDate, onViewDetails, onDelete }) => {
    const [copiedEmail, setCopiedEmail] = useState(false);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    icon: FaCheckCircle
                };
            case 'pending':
                return {
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    border: 'border-yellow-200',
                    icon: FaClock
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    icon: FaExclamationTriangle
                };
        }
    };

    const handleCopyEmail = async (email) => {
        if (!email) {
            toast.warning('No email to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(email);
            setCopiedEmail(true);
            toast.success(`Email copied: ${email}`);
            
            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopiedEmail(false);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy email:', error);
            toast.error('Failed to copy email');
        }
    };

    const statusConfig = getStatusConfig(item.paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <tr className={`group hover:bg-blue-50/50 transition-all duration-200 ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
        }`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-sm font-semibold text-white">
                                {item.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                            {item.customerName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                            {item.orderFrom} Customer
                        </div>
                    </div>
                </div>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <div className="text-sm text-gray-900 font-medium truncate max-w-[200px]">
                            {item.email}
                        </div>
                        <div className="text-xs text-gray-500">
                            {item.waOrFbId ? `ID: ${item.waOrFbId}` : 'No ID provided'}
                        </div>
                    </div>
                    {item.email && (
                        <button
                            onClick={() => handleCopyEmail(item.email)}
                            className={`group/copy p-2 rounded-lg transition-all duration-200 ${
                                copiedEmail 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600'
                            }`}
                            title={copiedEmail ? 'Email copied!' : 'Copy email address'}
                        >
                            {copiedEmail ? (
                                <FaCheck className="w-3 h-3" />
                            ) : (
                                <FaCopy className="w-3 h-3 group-hover/copy:scale-110 transition-transform duration-200" />
                            )}
                        </button>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                        {formatDate(item.subscriptionEnd)}
                    </span>
                    <span className="text-xs text-gray-500">
                        Subscription End
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {item.gptAccount || 'Not assigned'}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        {formatDate(item.orderDate)}
                    </span>
                    <span className="text-xs text-gray-500">
                        Order Date
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    <StatusIcon className="w-3 h-3 mr-1.5" />
                    <span className="capitalize">{item.paymentStatus}</span>
                </div>
                {item.paidAmount && (
                    <div className="text-xs text-gray-500 mt-1">
                        ${item.paidAmount}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onViewDetails(item)}
                        className="group/btn inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                        title="View Details"
                    >
                        <FaEye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                        <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="group/btn inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                        title="Delete Customer"
                    >
                        <FaTrash className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow; 