import React, { useState } from "react";
import {
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
} from "react-icons/fa";

const HistoryCard = ({ item }) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(""), 2000);
  };

  const displayMembers = showAllMembers
    ? item.members
    : item.members.slice(0, 3);
  const hasMoreMembers = item.members.length > 3;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="relative bg-gradient-to-r from-orange-50 to-red-50 px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUser className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {item.members.length}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {item.gptAccount}
                </h3>
                <button
                  onClick={() => copyToClipboard(item.gptAccount)}
                  className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-white rounded-lg transition-all duration-200"
                  title="Copy email"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
                {copiedEmail === item.gptAccount && (
                  <span className="text-xs text-green-600 font-medium">
                    Copied!
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">GPT Account</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <FaUsers className="w-4 h-4" />
                <span>{item.members.length} expired</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                {formatDate(item.createdAt)}
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
              Expired Members ({item.members.length})
            </h4>
            {hasMoreMembers && (
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                {showAllMembers ? (
                  <>
                    Show Less <FaChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Show All ({item.members.length - 3} more){" "}
                    <FaChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Members List */}
          <div className="grid gap-3">
            {displayMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {member.email}
                      </span>
                      <button
                        onClick={() => copyToClipboard(member.email)}
                        className="p-1 text-gray-400 hover:text-orange-600 rounded transition-colors"
                        title="Copy email"
                      >
                        <FaCopy className="w-3 h-3" />
                      </button>
                      {copiedEmail === member.email && (
                        <span className="text-xs text-green-600 font-medium">
                          Copied!
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Removed: {formatDate(member.removedAt)}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Subscription Ended
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
