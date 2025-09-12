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
                    text: 'text-green',
                    border: 'border-green-200',
                    icon: FaCheckCircle
                };
            case 'pending':
                return {
                    bg: 'bg-orange-50',
                    text: 'text-orange',
                    border: 'border-orange-200',
                    icon: FaClock
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-600',
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
        <tr className={`hover:bg-gray-50 transition-colors duration-200 ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        }`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                                {item.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.customerName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                            {item.orderFrom} Customer
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                        <span className="truncate max-w-xs">{item.email}</span>
                        {item.email && (
                            <button
                                onClick={() => handleCopyEmail(item.email)}
                                className="p-1 text-gray-400 hover:text-blue transition-colors duration-200"
                                title="Copy email"
                            >
                                {copiedEmail ? (
                                    <FaCheck className="w-3 h-3 text-green" />
                                ) : (
                                    <FaCopy className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {item.waOrFbId && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            ID: {item.waOrFbId}
                        </span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900">
                    {formatDate(item.subscriptionEnd)}
                </div>
                {item.subscriptionEnd && (
                    <div className="text-xs text-gray-500">
                        {new Date(item.subscriptionEnd) < new Date() ? (
                            <span className="text-red font-medium">Expired</span>
                        ) : (
                            <span className="text-green font-medium">Active</span>
                        )}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900">
                    {item.gptAccount ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue border border-blue-200">
                            {item.gptAccount}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-xs">Not assigned</span>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900">
                    {formatDate(item.orderDate)}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {item.paymentStatus || 'Unknown'}
                </span>
                {item.paidAmount && (
                    <div className="text-xs text-gray-500 mt-1">
                        Amount: ${item.paidAmount}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onViewDetails(item)}
                        className="text-blue hover:text-blue-600 p-2 rounded border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
                        title="View details"
                    >
                        <FaEye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="text-red hover:text-red-600 p-2 rounded border border-red-200 hover:bg-red-50 transition-colors duration-200"
                        title="Delete customer"
                    >
                        <FaTrash className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow; 