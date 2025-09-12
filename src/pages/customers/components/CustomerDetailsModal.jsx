import React, { useState } from 'react'
import { FaTimes, FaEdit, FaUser, FaEnvelope, FaCalendarAlt, FaDollarSign, FaCreditCard, FaStickyNote, FaBell, FaCheckCircle, FaClock, FaExclamationTriangle, FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import EditCustomerModal from './EditCustomerModal';

const CustomerDetailsModal = ({ customer, onClose, formatDate, onUpdate }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

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

    const handleExportPDF = () => {
        setIsExporting(true);
        
        try {
            const doc = new jsPDF('p', 'mm', 'a4'); // Portrait orientation
            
            // Colors
            const primaryColor = [59, 130, 246]; // Blue
            const darkColor = [31, 41, 55]; // Dark gray
            const lightColor = [107, 114, 128]; // Light gray
            
            // Header with customer name
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('Customer Report', 20, 25);
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(customer.customerName || 'Unknown Customer', 20, 33);
            
            // Generation date
            doc.setTextColor(...lightColor);
            doc.setFontSize(10);
            const now = new Date();
            doc.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 130, 33);
            
            let currentY = 60;
            
            // Customer Basic Info Section
            doc.setTextColor(...darkColor);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Personal Information', 20, currentY);
            currentY += 10;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            // Personal details
            const personalData = [
                ['Full Name:', customer.customerName || 'Not provided'],
                ['Email Address:', customer.email || 'Not provided'],
                ['Contact ID:', customer.waOrFbId || 'Not provided'],
                ['Order From:', customer.orderFrom || 'Not provided']
            ];
            
            personalData.forEach(([label, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 25, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(value, 70, currentY);
                currentY += 8;
            });
            
            currentY += 10;
            
            // Subscription Details Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Subscription Details', 20, currentY);
            currentY += 10;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            const subscriptionData = [
                ['GPT Account:', customer.gptAccount || 'Not assigned'],
                ['Order Date:', formatDate(customer.orderDate) || 'Not provided'],
                ['Subscription End:', formatDate(customer.subscriptionEnd) || 'Not provided'],
                ['Status:', new Date(customer.subscriptionEnd) < new Date() ? 'Expired' : 'Active']
            ];
            
            subscriptionData.forEach(([label, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 25, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(value, 70, currentY);
                currentY += 8;
            });
            
            currentY += 10;
            
            // Payment Information Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Payment Information', 20, currentY);
            currentY += 10;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            
            const paymentData = [
                ['Payment Status:', customer.paymentStatus || 'Not specified'],
                ['Payment Method:', customer.paymentMethod || 'Not specified'],
                ['Amount Paid:', customer.paidAmount ? `$${customer.paidAmount}` : 'Not specified'],
                ['Payment Date:', customer.paymentDate ? formatDate(customer.paymentDate) : 'Not specified']
            ];
            
            paymentData.forEach(([label, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 25, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(value, 70, currentY);
                currentY += 8;
            });
            
            currentY += 20;
            
            // Customer Summary Box
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.rect(20, currentY, 170, 30);
            
            doc.setFillColor(248, 250, 252);
            doc.rect(20, currentY, 170, 30, 'F');
            
            doc.setTextColor(...primaryColor);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Customer Summary', 25, currentY + 8);
            
            doc.setTextColor(...darkColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            
            const summaryText = `Customer ${customer.customerName} is a ${customer.orderFrom || 'unknown'} customer with ${customer.paymentStatus || 'unknown'} payment status. ` +
                               `Subscription ${new Date(customer.subscriptionEnd) < new Date() ? 'has expired' : 'is active'} ` +
                               `${customer.gptAccount ? `and assigned to GPT account: ${customer.gptAccount}` : 'with no GPT account assigned'}.`;
            
            const splitText = doc.splitTextToSize(summaryText, 160);
            doc.text(splitText, 25, currentY + 18);
            
            currentY += 50;
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(...lightColor);
            doc.text(`Customer ID: ${customer._id}`, 20, doc.internal.pageSize.height - 15);
            doc.text(`Report generated on ${now.toLocaleDateString()}`, 130, doc.internal.pageSize.height - 15);
            
            // Save the PDF
            const filename = `customer-${customer.customerName?.replace(/[^a-zA-Z0-9]/g, '-') || 'unknown'}-${now.toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            toast.success('Customer details exported to PDF successfully!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
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
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                    className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Export to PDF"
                                >
                                    {isExporting ? (
                                        <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <FaFilePdf className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                    )}
                                </button>
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
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-6 py-3 bg-red text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
                            >
                                {isExporting ? (
                                    <>
                                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaFilePdf className="w-4 h-4" />
                                        Export PDF
                                    </>
                                )}
                            </button>
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