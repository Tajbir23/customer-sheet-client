import React, { useState } from 'react';


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
        <div className="group glass rounded-2xl overflow-hidden hover:border-[var(--border-default)] transition-all duration-300">
            {/* Card Header */}
            <div className="relative bg-white/5 px-6 py-5 border-b border-[var(--border-subtle)]">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-[var(--accent-blue)] rounded-2xl flex items-center justify-center">
                                <span className="w-7 h-7 text-white font-bold text-xl text-center flex items-center justify-center">U</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--error)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {member.members.length}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                                    {member.gptAccount}
                                </h3>
                                <button
                                    onClick={() => copyToClipboard(member.gptAccount)}
                                    className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-hover)] rounded-lg transition-all duration-200"
                                    title="Copy email"
                                >
                                    <span className="w-3 h-3 font-bold text-xs">Copy</span>
                                </button>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] font-medium">GPT Account</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-[var(--error)] font-semibold">
                                <span className="w-4 h-4 font-bold">T</span>
                                <span>{member.members.length} removed</span>
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] mt-1">
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
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide">
                            Removed Members ({member.members.length})
                        </h4>
                        {hasMoreMembers && (
                            <button
                                onClick={() => setShowAllMembers(!showAllMembers)}
                                className="inline-flex items-center gap-1 text-sm text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] font-medium transition-colors"
                            >
                                <span className="w-3 h-3 font-bold">O</span>
                                {showAllMembers ? 'Show Less' : 'Show All'}
                                {showAllMembers ? <span className="w-3 h-3 font-bold">^</span> : <span className="w-3 h-3 font-bold">v</span>}
                            </button>
                        )}
                    </div>

                    {/* Members List */}
                    <div className="space-y-2">
                        {displayMembers.map((email, index) => (
                            <div
                                key={index}
                                className="group/member flex items-center justify-between p-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-[var(--text-secondary)]">
                                            {email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)] group-hover/member:text-[var(--text-primary)]">
                                        {email}
                                    </span>
                                    {copiedEmail === email && (
                                        <span className="text-xs text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full font-medium">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(email)}
                                    className="opacity-0 group-hover/member:opacity-100 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-blue)] hover:bg-[var(--bg-elevated)] rounded-lg transition-all duration-200"
                                    title="Copy email"
                                >
                                    <span className="w-3 h-3 font-bold text-xs">Copy</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {hasMoreMembers && !showAllMembers && (
                        <button
                            onClick={() => setShowAllMembers(true)}
                            className="w-full py-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-blue)] border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-blue)] rounded-xl transition-all duration-200 font-medium"
                        >
                            + {member.members.length - 3} more members
                        </button>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="bg-[var(--bg-surface)] px-6 py-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                        <span className="w-4 h-4 font-bold text-xs">D</span>
                        <span>Last updated: {formatDate(member.updatedAt)}</span>
                    </div>
                    <div className="text-[var(--text-muted)]">
                        Created: {formatDate(member.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberCard;