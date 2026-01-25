import React, { useState } from "react";
import {
  FaEnvelope,
  FaRobot,
  FaWhatsapp,
  FaHistory,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheck
} from 'react-icons/fa';


const HistoryCard = ({ item, index = 0 }) => {
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
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Card Header */}
      <div
        className="relative px-6 py-4"
        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaEnvelope className="text-white text-2xl" />
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
                    <span className="text-white text-xs font-bold">Copy</span>
                  )}
                </button>
              </div>
              <p className="text-white/80 text-sm">Member Email</p>
            </div>
          </div>

          {daysStatus && (
            <div
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: daysStatus.isExpired ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                color: 'white',
              }}
            >
              {daysStatus.text}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GPT Account */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}
            >
              <FaRobot className="text-white text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--accent-blue-light)] font-medium uppercase">GPT Account</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-medium truncate">{item.gptAccount}</p>
                <button
                  onClick={() => copyToClipboard(item.gptAccount, "gptAccount")}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] rounded transition-colors"
                  title="Copy GPT account"
                >
                  {copiedField === "gptAccount" ? (
                    <FaCheck className="w-3 h-3 text-[var(--success)]" />
                  ) : (
                    <span className="text-xs font-bold">Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp/FB ID */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
            >
              <FaWhatsapp className="text-white text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--success-light)] font-medium uppercase">WhatsApp/FB ID</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-medium truncate">{item.waOrFbId || "N/A"}</p>
                {item.waOrFbId && (
                  <button
                    onClick={() => copyToClipboard(item.waOrFbId, "waOrFbId")}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--success)] rounded transition-colors"
                    title="Copy WhatsApp/FB ID"
                  >
                    {copiedField === "waOrFbId" ? (
                      <FaCheck className="w-3 h-3 text-[var(--success)]" />
                    ) : (
                      <span className="text-xs font-bold">Copy</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
            >
              <FaHistory className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-[var(--accent-purple-light)] font-medium uppercase">Order Date</p>
              <p className="text-white font-medium">{formatDate(item.orderDate)}</p>
            </div>
          </div>

          {/* End Date */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }}
            >
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-[var(--error-light)] font-medium uppercase">Subscription End</p>
              <p className="text-white font-medium">{formatDate(item.endAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer - User Info */}
        <div
          className="mt-4 pt-4 flex items-center justify-between border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <FaUser className="text-sm" />
            <span>
              Added by: {item.user?.name || item.user?.email || "Unknown"}
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <FaClock className="text-xs" />
            Recorded: {formatDateTime(item.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
