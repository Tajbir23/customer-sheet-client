import React, { useState } from 'react';
import { FaTimes, FaUser, FaCalendarAlt, FaCreditCard, FaStickyNote, FaCheck, FaSpinner } from 'react-icons/fa';
import handleApi from '../../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import removeDataFromCheckList from './removeDataFromChecklist';

const UpdateMember = ({ member, gptAccount, setIsOpen, memberData, setData }) => {
    console.log(member)
    const navigate = useNavigate();
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
            if (response.success) {
                toast.success('Customer updated successfully');
                await removeDataFromCheckList(gptAccount, member.email, memberData, setData)
                setIsOpen(false)
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Failed to update customer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-lg border border-gray-200 my-8">
                {/* Header */}
                <div className="bg-blue text-white p-6 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                <span className="text-lg font-medium text-white">
                                    {member.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">
                                    Edit Member
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    Updating information for {member.customerName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                            title="Close"
                        >
                            <FaTimes className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                                <FaUser className="w-4 h-4 text-blue" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Member Information</h4>
                                <p className="text-sm text-gray-600">Basic member details</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={member?.email}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">GPT Account</label>
                                <input
                                    type="text"
                                    name="gptAccount"
                                    value={gptAccount}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                                <FaCalendarAlt className="w-4 h-4 text-green" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Subscription & Dates</h4>
                                <p className="text-sm text-gray-600">Manage subscription and important dates</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Subscription End</label>
                                <input
                                    type="date"
                                    name="subscriptionEnd"
                                    value={formData.subscriptionEnd}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Reminder Date</label>
                                <input
                                    type="date"
                                    name="reminderDate"
                                    value={formData.reminderDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                                <FaCreditCard className="w-4 h-4 text-orange" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Payment Information</h4>
                                <p className="text-sm text-gray-600">Update payment details and status</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                >
                                    <option value="">Select method</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="card">Credit Card</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <FaStickyNote className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">Notes & Reminders</h4>
                                <p className="text-sm text-gray-600">Additional information and reminders</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Customer Notes</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors resize-none"
                                    placeholder="Add any additional notes about the customer..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Reminder Notes</label>
                                <textarea
                                    name="reminderNote"
                                    value={formData.reminderNote}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors resize-none"
                                    placeholder="What to remember about this customer..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                                isSubmitting 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : 'bg-blue text-white hover:bg-blue-600'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                    Updating Customer...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMember; 