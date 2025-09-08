import React, { useState } from 'react'
import { FaTimes, FaEdit, FaUser, FaEnvelope, FaCalendarAlt, FaDollarSign, FaCreditCard, FaStickyNote, FaBell, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
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
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    icon: FaCheckCircle,
                    badgeBg: 'bg-green-100'
                };
            case 'pending':
                return {
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    border: 'border-yellow-200',
                    icon: FaClock,
                    badgeBg: 'bg-yellow-100'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    icon: FaExclamationTriangle,
                    badgeBg: 'bg-gray-100'
                };
        }
    };

    const statusConfig = getStatusConfig(customer.paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100 my-8">
                    {/* Modal Header */}
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
                                        {customer.customerName}
                                    </h3>
                                    <p className="text-blue-100 text-sm capitalize">
                                        {customer.orderFrom} Customer • {formatDate(customer.orderDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
                                    title="Edit Customer"
                                >
                                    <FaEdit className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
                                    title="Close"
                                >
                                    <FaTimes className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
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
                                        <h4 className={`text-lg font-semibold ${statusConfig.text}`}>
                                            Payment {customer.paymentStatus}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {customer.paidAmount ? `Amount: $${customer.paidAmount}` : 'No amount specified'}
                                        </p>
                                    </div>
                                </div>
                                {customer.paymentDate && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(customer.paymentDate)}
                                        </p>
                                        <p className="text-xs text-gray-500">Payment Date</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Information Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <FaUser className="w-5 h-5 text-blue-600 mr-2" />
                                    <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                        <p className="text-gray-900 font-medium">{customer.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                        <p className="text-gray-900 font-medium">{customer.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Contact ID</label>
                                        <p className="text-gray-900 font-medium">{customer.waOrFbId || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <FaCalendarAlt className="w-5 h-5 text-green-600 mr-2" />
                                    <h4 className="text-lg font-semibold text-gray-900">Subscription Details</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">GPT Account</label>
                                        <p className="text-gray-900 font-mono bg-white px-3 py-2 rounded-lg border text-sm">
                                            {customer.gptAccount || 'Not assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Subscription End</label>
                                        <p className="text-gray-900 font-medium">{formatDate(customer.subscriptionEnd)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Order Date</label>
                                        <p className="text-gray-900 font-medium">{formatDate(customer.orderDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <FaDollarSign className="w-5 h-5 text-purple-600 mr-2" />
                                    <h4 className="text-lg font-semibold text-gray-900">Payment Information</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                                        <p className="text-gray-900 font-medium capitalize">
                                            {customer.paymentMethod || 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Amount Paid</label>
                                        <p className="text-gray-900 font-medium">
                                            {customer.paidAmount ? `$${customer.paidAmount}` : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Payment Date</label>
                                        <p className="text-gray-900 font-medium">
                                            {customer.paymentDate ? formatDate(customer.paymentDate) : 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes & Reminders */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <FaStickyNote className="w-5 h-5 text-orange-600 mr-2" />
                                    <h4 className="text-lg font-semibold text-gray-900">Notes & Reminders</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Customer Notes</label>
                                        <div className="bg-white p-3 rounded-lg border min-h-[60px]">
                                            <p className="text-gray-900 text-sm">
                                                {customer.note || 'No notes added'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Reminder Date</label>
                                        <p className="text-gray-900 font-medium">
                                            {customer.reminderDate ? formatDate(customer.reminderDate) : 'No reminder set'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Reminder Notes</label>
                                        <div className="bg-white p-3 rounded-lg border min-h-[60px]">
                                            <p className="text-gray-900 text-sm">
                                                {customer.reminderNote || 'No reminder notes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                            Customer ID: {customer._id}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Customer
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-200"
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