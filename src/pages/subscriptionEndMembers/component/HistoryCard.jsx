import React, { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaCopy,
  FaCheck,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
  FaUserCircle,
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";

const HistoryCard = ({ item }) => {
  const [copiedField, setCopiedField] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Calculate days until/since end
  const getDaysStatus = () => {
    if (!item.endAt) return null;
    const endDate = new Date(item.endAt);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days ago`, isExpired: true };
    } else if (diffDays === 0) {
      return { text: "Today", isExpired: true };
    } else {
      return { text: `${diffDays} days left`, isExpired: false };
    }
  };

  const daysStatus = getDaysStatus();

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaEnvelope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white truncate max-w-[300px]">
                  {item.email}
                </h3>
                <button
                  onClick={() => copyToClipboard(item.email, "email")}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                  title="Copy email"
                >
                  {copiedField === "email" ? (
                    <FaCheck className="w-3 h-3 text-green-300" />
                  ) : (
                    <FaCopy className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
              <p className="text-white/80 text-sm">Member Email</p>
            </div>
          </div>

          {daysStatus && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${daysStatus.isExpired
                ? 'bg-red-600 text-white'
                : 'bg-yellow-400 text-gray-900'
              }`}>
              {daysStatus.text}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GPT Account */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <MdComputer className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-600 font-medium uppercase">GPT Account</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-medium truncate">{item.gptAccount}</p>
                <button
                  onClick={() => copyToClipboard(item.gptAccount, "gptAccount")}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                  title="Copy GPT account"
                >
                  {copiedField === "gptAccount" ? (
                    <FaCheck className="w-3 h-3 text-green-500" />
                  ) : (
                    <FaCopy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp/FB ID */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <FaWhatsapp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-600 font-medium uppercase">WhatsApp/FB ID</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-medium truncate">{item.waOrFbId || "N/A"}</p>
                {item.waOrFbId && (
                  <button
                    onClick={() => copyToClipboard(item.waOrFbId, "waOrFbId")}
                    className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                    title="Copy WhatsApp/FB ID"
                  >
                    {copiedField === "waOrFbId" ? (
                      <FaCheck className="w-3 h-3 text-green-500" />
                    ) : (
                      <FaCopy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-purple-600 font-medium uppercase">Order Date</p>
              <p className="text-gray-900 font-medium">{formatDate(item.orderDate)}</p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <FaClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-red-600 font-medium uppercase">Subscription End</p>
              <p className="text-gray-900 font-medium">{formatDate(item.endAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer - User Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaUserCircle className="w-4 h-4" />
            <span>
              Added by: {item.user?.name || item.user?.email || "Unknown"}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Recorded: {formatDateTime(item.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
