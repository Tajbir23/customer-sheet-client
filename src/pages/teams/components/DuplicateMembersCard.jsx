import React, { useState } from "react";
import {
    FaExclamationTriangle,
    FaCopy,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500 rounded-lg">
                                <FaExclamationTriangle className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-amber-800">
                                    Duplicate Members Detected
                                </h3>
                                <p className="text-sm text-amber-600">
                                    {duplicateMembers.length} member
                                    {duplicateMembers.length !== 1 ? "s" : ""} found in multiple
                                    teams
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopyAll}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${copied
                                ? "bg-green-500 text-white"
                                : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-300"
                                }`}
                        >
                            <FaCopy className="text-sm" />
                            {copied ? "Copied!" : "Copy All"}
                        </button>
                    </div>
                </div>

                {/* Members List */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {displayMembers.map((email, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-semibold text-sm">
                                        {index + 1}
                                    </span>
                                </div>
                                <span
                                    className="text-gray-700 text-sm font-medium truncate flex-1"
                                    title={email}
                                >
                                    {email}
                                </span>
                                <button
                                    onClick={() => handleCopyEmail(email, index)}
                                    className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${copiedEmail === index
                                        ? "bg-green-500 text-white"
                                        : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                        }`}
                                    title="Copy email"
                                >
                                    <FaCopy className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Show More/Less Button */}
                    {hasMore && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200"
                            >
                                {isExpanded ? (
                                    <>
                                        <FaChevronUp className="text-sm" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <FaChevronDown className="text-sm" />
                                        Show {duplicateMembers.length - 5} More
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
