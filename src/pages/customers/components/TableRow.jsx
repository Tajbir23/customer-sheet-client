import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { FaEye, FaTrash, FaCheck, FaClock, FaExclamationCircle, FaCopy } from 'react-icons/fa';

const TableRow = ({ item, index, formatDate, onViewDetails, onDelete }) => {
    const [copiedEmail, setCopiedEmail] = useState(false);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return {
                    bg: 'rgba(16, 185, 129, 0.15)',
                    text: 'var(--success-light)',
                    border: 'rgba(16, 185, 129, 0.3)',
                    icon: () => <FaCheck className="w-3 h-3" />
                };
            case 'pending':
                return {
                    bg: 'rgba(245, 158, 11, 0.15)',
                    text: 'var(--warning-light)',
                    border: 'rgba(245, 158, 11, 0.3)',
                    icon: () => <FaClock className="w-3 h-3" />
                };
            default:
                return {
                    bg: 'var(--bg-surface)',
                    text: 'var(--text-tertiary)',
                    border: 'var(--border-subtle)',
                    icon: () => <FaExclamationCircle className="w-3 h-3" />
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

    // Get gradient colors based on index
    const avatarGradients = [
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    ];

    return (
        <tr
            className="group transition-all duration-200 border-b"
            style={{
                background: index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-surface)';
            }}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: avatarGradients[index % 4] }}
                        >
                            <span className="text-sm font-semibold text-white">
                                {item.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-white group-hover:text-[var(--accent-purple-light)] transition-colors">
                            {item.customerName}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] capitalize">
                            {item.orderFrom} Customer
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <div className="text-sm text-white font-medium truncate max-w-[200px]">
                            {item.email}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                            {item.waOrFbId ? `ID: ${item.waOrFbId}` : 'No ID provided'}
                        </div>
                    </div>
                    {item.email && (
                        <button
                            onClick={() => handleCopyEmail(item.email)}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{
                                background: copiedEmail ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                                color: copiedEmail ? 'var(--success)' : 'var(--text-muted)',
                            }}
                            onMouseEnter={(e) => {
                                if (!copiedEmail) {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                                    e.currentTarget.style.color = 'var(--accent-purple)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!copiedEmail) {
                                    e.currentTarget.style.background = 'var(--bg-surface)';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }
                            }}
                            title={copiedEmail ? 'Email copied!' : 'Copy email address'}
                        >
                            {copiedEmail ? (
                                <FaCheck className="w-3 h-3" />
                            ) : (
                                <FaCopy className="w-3 h-3" />
                            )}
                        </button>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                        {formatDate(item.subscriptionEnd)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                        Subscription End
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center">
                    <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                            background: 'var(--success)',
                            boxShadow: '0 0 6px var(--success)',
                        }}
                    />
                    <span
                        className="text-sm font-mono px-3 py-1.5 rounded-lg text-xs"
                        style={{
                            background: 'var(--bg-surface)',
                            color: 'var(--accent-cyan-light)',
                        }}
                    >
                        {item.gptAccount || 'Not assigned'}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                        {formatDate(item.orderDate)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                        Order Date
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                        background: statusConfig.bg,
                        color: statusConfig.text,
                        border: `1px solid ${statusConfig.border}`,
                    }}
                >
                    <StatusIcon className="w-3 h-3 mr-1.5" />
                    <span className="capitalize">{item.paymentStatus}</span>
                </div>
                {item.paidAmount && (
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                        ${item.paidAmount}
                    </div>
                )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onViewDetails(item)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: 'var(--accent-blue-light)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        title="View Details"
                    >
                        <FaEye className="w-3 h-3" />
                        <span className="font-bold">View</span>
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--error-light)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        title="Delete Customer"
                    >
                        <FaTrash className="w-3 h-3" />
                        <span className="font-bold">Delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow;