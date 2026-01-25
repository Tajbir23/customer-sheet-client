import React, { useState } from "react";


import { toast } from "react-toastify";

const DuplicateMembersCard = ({ duplicateMembers }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [copied, setCopied] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(null);

    const handleCopyAll = () => {
        const emailsText = duplicateMembers.join("\n");
        navigator.clipboard.writeText(emailsText);
        setCopied(true);
        toast.success("Duplicate emails copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyEmail = (email, index) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(index);
        toast.success("Email copied!");
        setTimeout(() => setCopiedEmail(null), 1500);
    };

    const displayMembers = isExpanded
        ? duplicateMembers
        : duplicateMembers.slice(0, 5);
    const hasMore = duplicateMembers.length > 5;

    return (
        <div className="mb-8">
            <div className="rounded-2xl overflow-hidden border border-[var(--warning)]/30"
                style={{ background: 'var(--bg-card)' }}>
                {/* Header */}
                <div className="px-6 py-4 border-b"
                    style={{
                        background: 'var(--warning-bg)',
                        borderColor: 'var(--warning)/20'
                    }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg"
                                style={{ background: 'var(--warning)', color: 'var(--bg-deepest)' }}>
                                <span className="text-lg font-bold">!</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold"
                                    style={{ color: 'var(--warning-light)' }}>
                                    Duplicate Members Detected
                                </h3>
                                <p className="text-sm font-medium opacity-90"
                                    style={{ color: 'var(--warning-light)' }}>
                                    {duplicateMembers.length} member
                                    {duplicateMembers.length !== 1 ? "s" : ""} found in multiple
                                    teams
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopyAll}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 border ${copied
                                ? "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]"
                                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white hover:border-[var(--text-secondary)]"
                                }`}
                        >
                            <span className="font-bold text-sm">{copied ? "Copied!" : "Copy All"}</span>
                        </button>
                    </div>
                </div>

                {/* Members List */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {displayMembers.map((email, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-3 rounded-lg px-4 py-3 border transition-all duration-200"
                                style={{
                                    background: 'var(--bg-surface)',
                                    borderColor: 'var(--border-subtle)'
                                }}
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                    style={{ background: 'var(--warning-bg)', color: 'var(--warning-light)' }}>
                                    {index + 1}
                                </div>
                                <span
                                    className="text-sm font-medium truncate flex-1 text-[var(--text-primary)]"
                                    title={email}
                                >
                                    {email}
                                </span>
                                <button
                                    onClick={() => handleCopyEmail(email, index)}
                                    className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${copiedEmail === index
                                        ? "bg-[var(--success)] text-white"
                                        : "text-[var(--text-tertiary)] hover:text-[var(--accent-purple)] hover:bg-[var(--bg-hover)]"
                                        }`}
                                    title="Copy email"
                                >
                                    <span className="text-xs font-bold">Copy</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Show More/Less Button */}
                    {hasMore && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-2 px-4 py-2 font-bold transition-colors duration-200 rounded-lg hover:bg-[var(--bg-hover)]"
                                style={{ color: 'var(--warning-light)' }}
                            >
                                {isExpanded ? (
                                    <>
                                        <span>Show Less</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Show {duplicateMembers.length - 5} More</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DuplicateMembersCard;
