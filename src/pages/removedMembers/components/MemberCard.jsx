import React, { useState } from 'react';
import { FaUser, FaUsers, FaCalendarAlt, FaChevronDown, FaChevronUp, FaCopy, FaEye } from 'react-icons/fa';

const MemberCard = ({ member }) => {
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(''), 2000);
    };

    const displayMembers = showAllMembers ? member.members : member.members.slice(0, 3);
    const hasMoreMembers = member.members.length > 3;

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
            {/* Card Header */}
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FaUser className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {member.members.length}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue transition-colors">
                                    {member.gptAccount}
                                </h3>
                                <button
                                    onClick={() => copyToClipboard(member.gptAccount)}
                                    className="p-1.5 text-gray-400 hover:text-blue hover:bg-white rounded-lg transition-all duration-200"
                                    title="Copy email"
                                >
                                    <FaCopy className="w-3 h-3" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">GPT Account</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-red font-semibold">
                                <FaUsers className="w-4 h-4" />
                                <span>{member.members.length} removed</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {formatDate(member.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="space-y-4">
                    {/* Members Section Header */}
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            Removed Members ({member.members.length})
                        </h4>
                        {hasMoreMembers && (
                            <button
                                onClick={() => setShowAllMembers(!showAllMembers)}
                                className="inline-flex items-center gap-1 text-sm text-blue hover:text-blue-600 font-medium transition-colors"
                            >
                                <FaEye className="w-3 h-3" />
                                {showAllMembers ? 'Show Less' : 'Show All'}
                                {showAllMembers ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                            </button>
                        )}
                    </div>

                    {/* Members List */}
                    <div className="space-y-2">
                        {displayMembers.map((email, index) => (
                            <div 
                                key={index} 
                                className="group/member flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">
                                            {email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover/member:text-gray-900">
                                        {email}
                                    </span>
                                    {copiedEmail === email && (
                                        <span className="text-xs text-green bg-green-50 px-2 py-1 rounded-full font-medium">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(email)}
                                    className="opacity-0 group-hover/member:opacity-100 p-1.5 text-gray-400 hover:text-blue hover:bg-white rounded-lg transition-all duration-200"
                                    title="Copy email"
                                >
                                    <FaCopy className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {hasMoreMembers && !showAllMembers && (
                        <button
                            onClick={() => setShowAllMembers(true)}
                            className="w-full py-3 text-sm text-gray-500 hover:text-blue border-2 border-dashed border-gray-200 hover:border-blue rounded-xl transition-all duration-200 font-medium"
                        >
                            + {member.members.length - 3} more members
                        </button>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>Last updated: {formatDate(member.updatedAt)}</span>
                    </div>
                    <div className="text-gray-400">
                        Created: {formatDate(member.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberCard; 