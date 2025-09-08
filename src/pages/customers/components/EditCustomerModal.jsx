import React, { useState } from 'react';
import { FaTimes, FaUser, FaCalendarAlt, FaCreditCard, FaStickyNote, FaCheck, FaSpinner } from 'react-icons/fa';
import handleApi from '../../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCustomerModal = ({ customer, onClose, onUpdate }) => {
    const navigate = useNavigate();
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
            if (response.success) {
                onUpdate(response.data);
                toast.success('Customer updated successfully');
                onClose();
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Failed to update customer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100 my-8">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">
                                    {customer.customerName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    Edit Customer
                                </h3>
                                <p className="text-blue-100">
                                    Updating information for {customer.customerName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
                            title="Close"
                        >
                            <FaTimes className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <FaUser className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900">Customer Information</h4>
                                <p className="text-gray-600">Basic customer details</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">GPT Account</label>
                                <input
                                    type="text"
                                    name="gptAccount"
                                    value={formData.gptAccount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                    placeholder="GPT account identifier"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="space-y-6 pt-8 border-t border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                <FaCalendarAlt className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900">Subscription & Dates</h4>
                                <p className="text-gray-600">Manage subscription and important dates</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Order Date</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Subscription End</label>
                                <input
                                    type="date"
                                    name="subscriptionEnd"
                                    value={formData.subscriptionEnd}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Reminder Date</label>
                                <input
                                    type="date"
                                    name="reminderDate"
                                    value={formData.reminderDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-6 pt-8 border-t border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                <FaCreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900">Payment Information</h4>
                                <p className="text-gray-600">Update payment details and status</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Payment Status</label>
                                <select
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Amount Paid</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                >
                                    <option value="">Select method</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="card">Credit Card</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Payment Date</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-6 pt-8 border-t border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                                <FaStickyNote className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900">Notes & Reminders</h4>
                                <p className="text-gray-600">Additional information and reminders</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Customer Notes</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none"
                                    placeholder="Add any additional notes about the customer..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Reminder Notes</label>
                                <textarea
                                    name="reminderNote"
                                    value={formData.reminderNote}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none"
                                    placeholder="What to remember about this customer..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="w-5 h-5 animate-spin" />
                                    Updating Customer...
                                </>
                            ) : (
                                <>
                                    <FaCheck className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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