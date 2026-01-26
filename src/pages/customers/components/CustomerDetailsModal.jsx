import React, { useState } from 'react'

import EditCustomerModal from './EditCustomerModal';

const CustomerDetailsModal = ({ customer, onClose, formatDate, onUpdate }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    if (!customer) return null;

    const handleUpdate = (updatedCustomer) => {
        onUpdate(updatedCustomer);
        setShowEditModal(false);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid':
                return {
                    bg: 'bg-[var(--success-bg)]',
                    text: 'text-[var(--success-light)]',
                    border: 'border-[var(--success)]/30',
                    icon: () => <span className="font-bold">✓</span>,
                    badgeBg: 'bg-[var(--success)]/20'
                };
            case 'pending':
                return {
                    bg: 'bg-[var(--warning-bg)]',
                    text: 'text-[var(--warning-light)]',
                    border: 'border-[var(--warning)]/30',
                    icon: () => <span className="font-bold">Clock</span>,
                    badgeBg: 'bg-[var(--warning)]/20'
                };
            default:
                return {
                    bg: 'bg-[var(--error-bg)]',
                    text: 'text-[var(--error-light)]',
                    border: 'border-[var(--error)]/30',
                    icon: () => <span className="font-bold">!</span>,
                    badgeBg: 'bg-[var(--error)]/20'
                };
        }
    };

    const statusConfig = getStatusConfig(customer.paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border my-8"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                >
                    {/* Modal Header */}
                    <div className="relative p-6 rounded-t-2xl"
                        style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center shadow-lg border border-white/10">
                                    <span className="text-2xl font-bold text-white">
                                        {customer.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-sm">
                                        {customer.customerName}
                                    </h3>
                                    <p className="text-blue-100 text-sm capitalize font-medium">
                                        {customer.orderFrom} Customer • {formatDate(customer.orderDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 border border-white/10"
                                    title="Edit Customer"
                                >
                                    <span className="w-5 h-5 text-white font-bold group-hover:scale-110 transition-transform">Edit</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 border border-white/10"
                                    title="Close"
                                >
                                    <span className="w-5 h-5 text-white font-bold group-hover:scale-110 transition-transform">X</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8">
                        {/* Status Card */}
                        <div className={`mb-8 p-6 rounded-xl border-2 ${statusConfig.bg} ${statusConfig.border}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-full ${statusConfig.badgeBg}`}>
                                        <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold ${statusConfig.text}`}>
                                            Payment {customer.paymentStatus}
                                        </h4>
                                        <p className="text-sm opacity-90" style={{ color: statusConfig.text }}>
                                            {customer.paidAmount ? `Amount: $${customer.paidAmount}` : 'No amount specified'}
                                        </p>
                                    </div>
                                </div>
                                {customer.paymentDate && (
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[var(--text-primary)]">
                                            {formatDate(customer.paymentDate)}
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)]">Payment Date</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Information Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="rounded-xl p-6 border"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center mb-4">
                                    <span className="w-5 h-5 text-[var(--accent-blue)] font-bold mr-2">U</span>
                                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Personal Information</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Full Name</label>
                                        <p className="text-[var(--text-primary)] font-medium text-lg">{customer.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Email Address</label>
                                        <p className="text-[var(--text-primary)] font-medium copy-all">{customer.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Contact ID</label>
                                        <p className="text-[var(--text-primary)] font-medium">{customer.waOrFbId || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Details */}
                            <div className="rounded-xl p-6 border"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center mb-4">
                                    <span className="w-5 h-5 text-[var(--success)] font-bold mr-2">D</span>
                                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Subscription Details</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">GPT Account</label>
                                        <p className="font-mono px-3 py-2 rounded-lg border text-sm font-medium"
                                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                                            {customer.gptAccount || 'Not assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Subscription End</label>
                                        <p className="text-[var(--text-primary)] font-medium">{formatDate(customer.subscriptionEnd)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Order Date</label>
                                        <p className="text-[var(--text-primary)] font-medium">{formatDate(customer.orderDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="rounded-xl p-6 border"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center mb-4">
                                    <span className="w-5 h-5 text-[var(--accent-purple)] font-bold mr-2">$</span>
                                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Payment Information</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Payment Method</label>
                                        <p className="text-[var(--text-primary)] font-medium capitalize">
                                            {customer.paymentMethod || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Amount Paid</label>
                                        <p className="text-[var(--text-primary)] font-medium text-lg">
                                            {customer.paidAmount ? `$${customer.paidAmount}` : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Payment Date</label>
                                        <p className="text-[var(--text-primary)] font-medium">
                                            {customer.paymentDate ? formatDate(customer.paymentDate) : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes & Reminders */}
                            <div className="rounded-xl p-6 border"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center mb-4">
                                    <span className="w-5 h-5 text-[var(--warning)] font-bold mr-2">N</span>
                                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Notes & Reminders</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Customer Notes</label>
                                        <div className="p-3 rounded-lg border min-h-[60px]"
                                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                                            <p className="text-[var(--text-primary)] text-sm whitespace-pre-wrap">
                                                {customer.note || 'No notes added'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Reminder Date</label>
                                        <p className="text-[var(--text-primary)] font-medium">
                                            {customer.reminderDate ? formatDate(customer.reminderDate) : 'No reminder set'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Reminder Notes</label>
                                        <div className="p-3 rounded-lg border min-h-[60px]"
                                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                                            <p className="text-[var(--text-primary)] text-sm whitespace-pre-wrap">
                                                {customer.reminderNote || 'No reminder notes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between p-6 rounded-b-2xl border-t bg-[var(--bg-elevated)]"
                        style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="text-xs text-[var(--text-tertiary)] font-mono">
                            Customer ID: {customer._id}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-white"
                                style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-dark) 100%)' }}
                            >
                                <span className="w-4 h-4 font-bold">✎</span>
                                Edit Customer
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 font-bold rounded-xl transition-all duration-200 border"
                                style={{
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    borderColor: 'var(--border-subtle)'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditCustomerModal
                    customer={customer}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default CustomerDetailsModal;