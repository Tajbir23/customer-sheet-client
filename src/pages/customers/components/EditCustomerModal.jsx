import React, { useState, useEffect, useRef } from 'react';

import handleApi from '../../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCustomerModal = ({ customer, onClose, onUpdate }) => {
    const navigate = useNavigate();
    const isMountedRef = useRef(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subscriptionEnd: customer.subscriptionEnd?.split('T')[0] || '',
        gptAccount: customer.gptAccount || '',
        email: customer.email || '',
        orderDate: customer.orderDate?.split('T')[0] || '',
        note: customer.note || '',
        reminderDate: customer.reminderDate?.split('T')[0] || '',
        reminderNote: customer.reminderNote || '',
        paymentStatus: customer.paymentStatus || 'pending',
        paidAmount: customer.paidAmount || '',
        paymentDate: customer.paymentDate?.split('T')[0] || '',
        paymentMethod: customer.paymentMethod || ''
    });

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await handleApi(`/customers/edit/${customer?._id}`, 'PUT', formData, navigate);
            if (isMountedRef.current && response.success) {
                onUpdate(response.data);
                toast.success('Customer updated successfully');
                onClose();
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            if (isMountedRef.current) {
                toast.error('Failed to update customer');
            }
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border my-8 animate-scale-in"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
                {/* Header */}
                <div className="p-6 rounded-t-2xl"
                    style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                <span className="text-lg font-bold text-white">
                                    {customer.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Edit Customer
                                </h3>
                                <p className="text-blue-100 text-sm font-medium">
                                    Updating information for {customer.customerName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border border-white/10"
                            title="Close"
                        >
                            <span className="w-4 h-4 text-white font-bold">X</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ background: 'var(--accent-blue)/20' }}>
                                <span className="w-4 h-4 text-[var(--accent-blue)] font-bold text-center">U</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Customer Information</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Basic customer details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">GPT Account</label>
                                <input
                                    type="text"
                                    name="gptAccount"
                                    value={formData.gptAccount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors font-mono"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="GPT account identifier"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ background: 'var(--success)/20' }}>
                                <span className="w-4 h-4 text-[var(--success)] font-bold text-center">D</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Subscription & Dates</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Manage subscription and important dates</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Order Date</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors appearance-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Subscription End</label>
                                <input
                                    type="date"
                                    name="subscriptionEnd"
                                    value={formData.subscriptionEnd}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors appearance-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Reminder Date</label>
                                <input
                                    type="date"
                                    name="reminderDate"
                                    value={formData.reminderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors appearance-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ background: 'var(--accent-purple)/20' }}>
                                <span className="w-4 h-4 text-[var(--accent-purple)] font-bold text-center">$</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Payment Information</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Update payment details and status</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Payment Status</label>
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Amount Paid</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">Select method</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="card">Credit Card</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Payment Date</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors appearance-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                                style={{ background: 'var(--text-tertiary)/20' }}>
                                <span className="w-4 h-4 text-[var(--text-secondary)] font-bold text-center">N</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Notes & Reminders</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Additional information and reminders</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Customer Notes</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors resize-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="Add any additional notes about the customer..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-secondary)]">Reminder Notes</label>
                                <textarea
                                    name="reminderNote"
                                    value={formData.reminderNote}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-colors resize-none"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-subtle)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="What to remember about this customer..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg ${isSubmitting
                                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                                : 'text-white hover:scale-[1.02] hover:shadow-xl'
                                }`}
                            style={!isSubmitting ? { background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-dark) 100%)' } : {}}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 animate-spin font-bold">...</span>
                                    Updating Customer...
                                </>
                            ) : (
                                <>
                                    <span className="w-4 h-4 font-bold">✓</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 font-bold rounded-xl transition-all duration-200 border hover:bg-[var(--bg-hover)]"
                            style={{
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-subtle)'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal; 