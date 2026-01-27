import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import handleApi from '../../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import removeDataFromCheckList from './removeDataFromChecklist';

const UpdateMember = ({ member, gptAccount, setIsOpen, memberData, setData }) => {
    console.log(member)
    const navigate = useNavigate();
    const isMountedRef = useRef(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subscriptionEnd: member.subscriptionEnd?.split('T')[0] || '',
        gptAccount: gptAccount || '',
        email: member.email || '',
        orderDate: member.orderDate?.split('T')[0] || '',
        note: member.note || '',
        reminderDate: member.reminderDate?.split('T')[0] || '',
        reminderNote: member.reminderNote || '',
        paymentStatus: member.paymentStatus || 'pending',
        paidAmount: member.paidAmount || '',
        paymentDate: member.paymentDate?.split('T')[0] || '',
        paymentMethod: member.paymentMethod || ''
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
            const response = await handleApi(`/customers/edit/${member?.customerId}`, 'PUT', formData, navigate);
            if (isMountedRef.current && response.success) {
                toast.success('Customer updated successfully');
                await removeDataFromCheckList(gptAccount, member.email, memberData, setData)
                setIsOpen(false)
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

    return createPortal(
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-[var(--border-subtle)] my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
                                <span className="text-xl font-bold text-white">
                                    {member.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Edit Member
                                </h3>
                                <p className="text-white/80 text-sm font-medium">
                                    Updating information for <span className="text-white">{member.customerName}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-bold"
                            title="Close"
                        >
                            <span className="font-bold">X</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[var(--accent-blue)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-blue)]/20">
                                <span className="text-[var(--accent-blue)] font-bold text-lg">U</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Member Information</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Basic member details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={member?.email}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] cursor-not-allowed opacity-70 font-mono text-sm"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">GPT Account</label>
                                <input
                                    type="text"
                                    name="gptAccount"
                                    value={gptAccount}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] cursor-not-allowed opacity-70 text-sm"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-green)]/20">
                                <span className="text-[var(--accent-green)] font-bold text-lg">C</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Subscription & Dates</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Manage subscription and important dates</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Order Date</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Subscription End</label>
                                <input
                                    type="date"
                                    name="subscriptionEnd"
                                    value={formData.subscriptionEnd}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Reminder Date</label>
                                <input
                                    type="date"
                                    name="reminderDate"
                                    value={formData.reminderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[var(--accent-orange)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-orange)]/20">
                                <span className="text-[var(--accent-orange)] font-bold text-lg">$</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Payment Information</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Update payment details and status</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Status</label>
                                <div className="relative">
                                    <select
                                        name="paymentStatus"
                                        value={formData.paymentStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Amount Paid</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-muted)]"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Method</label>
                                <div className="relative">
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                                    >
                                        <option value="">Select method</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="card">Credit Card</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Date</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[var(--bg-surface)] rounded-xl flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                                <span className="text-[var(--text-tertiary)] font-bold text-lg">N</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Notes & Reminders</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Additional information and reminders</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Customer Notes</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all resize-none placeholder-[var(--text-muted)]"
                                    placeholder="Add any additional notes about the customer..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Reminder Notes</label>
                                <textarea
                                    name="reminderNote"
                                    value={formData.reminderNote}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all resize-none placeholder-[var(--text-muted)]"
                                    placeholder="What to remember about this customer..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--border-subtle)]">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all shadow-lg ${isSubmitting
                                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                                : 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span>Updating Customer...</span>
                                </>
                            ) : (
                                <>
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 px-6 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white font-bold rounded-xl transition-all border border-[var(--border-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >,
        document.body
    );
};

export default UpdateMember; 