import React, { useState } from 'react'
import { FaTimes, FaEdit } from 'react-icons/fa';
import EditCustomerModal from './EditCustomerModal';

const CustomerDetailsModal = ({ customer, onClose, formatDate, onUpdate }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    if (!customer) return null;

    const handleUpdate = (updatedCustomer) => {
        onUpdate(updatedCustomer);
        setShowEditModal(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Customer Details
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <FaEdit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.customerName}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Order From</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400 capitalize">{customer.orderFrom}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">WA/FB ID</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.waOrFbId}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.email}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Subscription End</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{formatDate(customer.subscriptionEnd)}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">GPT Account</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.gptAccount}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{formatDate(customer.orderDate)}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
                                <p className={`mt-1 capitalize ${customer.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                    {customer.paymentStatus}
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Paid Amount</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    {customer.paidAmount ? `$${customer.paidAmount}` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Payment Date</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    {customer.paymentDate ? formatDate(customer.paymentDate) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400 capitalize">
                                    {customer.paymentMethod || 'N/A'}
                                </p>
                            </div>
                            <div className="col-span-full">
                                <label className="font-medium text-gray-700 dark:text-gray-300">Note</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.note || 'No note added'}</p>
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">Reminder Date</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    {customer.reminderDate ? formatDate(customer.reminderDate) : 'No reminder set'}
                                </p>
                            </div>
                            <div className="col-span-full">
                                <label className="font-medium text-gray-700 dark:text-gray-300">Reminder Note</label>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{customer.reminderNote || 'No reminder note'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Close
                        </button>
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