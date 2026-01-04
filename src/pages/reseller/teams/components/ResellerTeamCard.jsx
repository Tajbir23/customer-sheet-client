import React, { useState } from 'react';
import { FaUserFriends, FaEnvelope, FaTrash, FaCopy, FaCheck, FaChevronDown, FaChevronUp, FaUsers, FaUserPlus, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import handleApi from '../../../../libs/handleAPi';

const ResellerTeamCard = ({ team, onRemoveMember, onMemberAdded }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [removingMember, setRemovingMember] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        orderDate: new Date().toISOString().split('T')[0],
    });
    const [formErrors, setFormErrors] = useState({});

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(team.gptAccount);
            setCopied(true);
            toast.success('Email copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            toast.error('Failed to copy email');
        }
    };

    const handleRemoveMemberClick = async (member, index) => {
        setRemovingMember(index);
        try {
            await onRemoveMember(team.gptAccount, member);
            toast.success('Member removed successfully');
        } catch (err) {
            console.error('Failed to remove member:', err);
            toast.error('Failed to remove member');
        } finally {
            setRemovingMember(null);
        }
    };

    // Add Member Modal Handlers
    const handleOpenAddModal = () => {
        setShowAddModal(true);
        setFormData({
            email: '',
            orderDate: new Date().toISOString().split('T')[0],
        });
        setFormErrors({});
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setFormData({ email: '', orderDate: '' });
        setFormErrors({});
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddMember = async () => {
        // Validate form
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email.trim())) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.orderDate) {
            errors.orderDate = 'Order date is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsAdding(true);
        try {
            const response = await handleApi('/reseller/add-customer', 'POST', {
                email: formData.email.trim(),
                gptAccount: team.gptAccount,
                orderDate: formData.orderDate,
            });

            if (response.success) {
                toast.success('Customer added successfully!');
                handleCloseAddModal();
                // Callback to refresh the teams list
                if (onMemberAdded) {
                    onMemberAdded();
                }
            } else {
                toast.error(response.message || 'Failed to add customer');
            }
        } catch (err) {
            console.error('Failed to add customer:', err);
            toast.error('Failed to add customer');
        } finally {
            setIsAdding(false);
        }
    };

    // Generate avatar initials from email
    const getInitials = (email) => {
        const name = email.split('@')[0];
        return name.slice(0, 2).toUpperCase();
    };

    // Generate consistent color from email
    const getAvatarColor = (email) => {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-amber-500 to-amber-600',
            'from-rose-500 to-rose-600',
            'from-teal-500 to-teal-600',
        ];
        return colors[Math.abs(hash) % colors.length];
    };

    const hasMembers = team.members && team.members.length > 0;
    const totalSlots = 8; // Assuming max 8 members per team
    const usedSlots = team.totalMembers || 0;
    const availableSlots = totalSlots - usedSlots;

    return (
        <>
            <div className="group relative">
                {/* Main Card */}
                <div className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white shadow-xl border border-gray-100">

                    {/* Header Section */}
                    <div className="relative p-6 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                        </div>

                        <div className="relative z-10">
                            {/* Account Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm flex-shrink-0">
                                        <FaEnvelope className="text-white text-lg" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white truncate" title={team.gptAccount}>
                                                {team.gptAccount}
                                            </h3>
                                            <button
                                                onClick={handleCopyEmail}
                                                className="flex-shrink-0 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                                                title="Copy email"
                                            >
                                                {copied ? (
                                                    <FaCheck className="text-green-300 text-sm" />
                                                ) : (
                                                    <FaCopy className="text-white text-sm hover:scale-110 transition-transform" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-white/80 text-sm font-medium">GPT Account</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                {/* Total Members Stats */}
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <FaUserFriends className="text-white text-lg" />
                                            <div>
                                                <div className="text-2xl font-bold text-white">{usedSlots}</div>
                                                <div className="text-white/80 text-xs font-medium">Total Members</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Slots Badge */}
                                    <div className={`px-3 py-2 rounded-xl text-sm font-bold ${availableSlots > 0
                                        ? 'bg-green-400/20 text-green-100 border border-green-400/30'
                                        : 'bg-red-400/20 text-red-100 border border-red-400/30'
                                        }`}>
                                        {availableSlots > 0 ? `${availableSlots} slots available` : 'Full'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Add Member Button */}
                                    <button
                                        onClick={handleOpenAddModal}
                                        disabled={availableSlots <= 0}
                                        className={`flex items-center gap-1.5 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-200 font-medium ${availableSlots > 0
                                            ? 'bg-green-500/80 hover:bg-green-500 text-white shadow-lg shadow-green-500/25 hover:scale-105'
                                            : 'bg-gray-400/50 text-gray-200 cursor-not-allowed'
                                            }`}
                                    >
                                        <FaUserPlus className="text-sm" />
                                        <span className="text-sm">Add Member</span>
                                    </button>

                                    {/* Expand Button */}
                                    {hasMembers && (
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-200 text-white font-medium"
                                        >
                                            <FaUsers className="text-sm" />
                                            <span className="text-sm">My Members ({team.members.length})</span>
                                            {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members Section */}
                    {isExpanded && hasMembers && (
                        <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-gray-900">My Members</h4>
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                                </div>
                            </div>

                            {/* Members List */}
                            <div className="space-y-3">
                                {team.members.map((member, index) => (
                                    <div
                                        key={`${team.gptAccount}-${index}-${member}`}
                                        className="group/member relative p-4 rounded-2xl border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${getAvatarColor(member)} shadow-lg`}>
                                                {getInitials(member)}
                                            </div>

                                            {/* Member Info */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                                    <span className="text-sm truncate font-semibold text-gray-900" title={member}>
                                                        {member}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleRemoveMemberClick(member, index)}
                                                disabled={removingMember === index}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${removingMember === index
                                                    ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:scale-105 active:scale-95'
                                                    }`}
                                                title="Remove member"
                                            >
                                                {removingMember === index ? (
                                                    <>
                                                        <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                        <span className="hidden sm:inline">Removing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaTrash className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Remove</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Members Message */}
                    {!hasMembers && (
                        <div className="p-6 text-center border-t-2 border-gray-100">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-500 text-sm font-medium">
                                <FaUsers className="text-gray-400" />
                                No members assigned to you
                            </div>
                        </div>
                    )}
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20"></div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                            </div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                        <FaUserPlus className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Add Customer</h3>
                                        <p className="text-white/80 text-sm font-medium truncate max-w-[200px]" title={team.gptAccount}>
                                            To {team.gptAccount}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseAddModal}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
                                >
                                    <FaTimes className="text-lg text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* GPT Account Display */}
                            <div className="mb-5">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    GPT Account
                                </label>
                                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium border border-gray-200">
                                    {team.gptAccount}
                                </div>
                            </div>

                            {/* Customer Email Input */}
                            <div className="mb-5">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Customer Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="customer@example.com"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 font-medium ${formErrors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                                            }`}
                                    />
                                </div>
                                {formErrors.email && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Order Date Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Order Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        name="orderDate"
                                        value={formData.orderDate}
                                        onChange={handleInputChange}
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 font-medium ${formErrors.orderDate
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                                            }`}
                                    />
                                </div>
                                {formErrors.orderDate && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{formErrors.orderDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleCloseAddModal}
                                disabled={isAdding}
                                className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMember}
                                disabled={isAdding}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center shadow-lg shadow-green-500/25"
                            >
                                {isAdding ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="text-sm" />
                                        Add Customer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResellerTeamCard;
