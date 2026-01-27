import React from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaRobot,
  FaClipboardList,
  FaPaypal,
  FaUserTimes,
  FaCalendarTimes,
  FaShieldAlt,
  FaQrcode,
  FaFileInvoice,
  FaStore,
  FaCommentDots,
  FaTimes,
  FaBars,
  FaCheckCircle,
  FaCog
} from 'react-icons/fa';


const Navbar = ({ isOpen, setIsOpen, onOpenSettings }) => {
  const location = useLocation();

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);

  let navigation = [];

  if (decoded.role === 'admin') {
    navigation = [
      { name: "Home", path: "/", icon: <FaHome className="w-5 h-5" /> },
      { name: "Customers", path: "/customers", icon: <FaUsers className="w-5 h-5" /> },
      { name: "Teams", path: "/teams", icon: <FaUserFriends className="w-5 h-5" /> },
      {
        name: "ChatGPT Accounts",
        path: "/chatgpt-accounts",
        icon: <FaRobot className="w-5 h-5" />,
      },
      {
        name: "Member Check List",
        path: "/member-check-list",
        icon: <FaClipboardList className="w-5 h-5" />,
      },
      {
        name: "PayPal Accounts",
        path: "/paypal-accounts",
        icon: <FaPaypal className="w-5 h-5" />,
      },
      {
        name: "Removed Members",
        path: "/removed-members",
        icon: <FaUserTimes className="w-5 h-5" />,
      },
      {
        name: "Subscription End",
        path: "/subscription-end-members",
        icon: <FaCalendarTimes className="w-5 h-5" />,
      },
      { name: "Asocks", path: "/asocks", icon: <FaShieldAlt className="w-5 h-5" /> },
      { name: "QR Code", path: "/qr-code", icon: <FaQrcode className="w-5 h-5" /> },
      {
        name: "Search Invoice",
        path: "/search-invoice",
        icon: <FaFileInvoice className="w-5 h-5" />,
      },
      {
        name: "Reseller",
        path: "/reseller-info",
        icon: <FaStore className="w-5 h-5" />,
      },
      {
        name: "Send Message",
        path: "/send-custom-message",
        icon: <FaCommentDots className="w-5 h-5" />,
      }
    ];
  }

  if (decoded.role === "reseller") {
    navigation = [
      { name: "Home", path: "/reseller", icon: <FaHome className="w-5 h-5" /> },
    ]
  }

  return (
    <div className="fixed z-40 h-full pointer-events-none">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="fixed top-5 left-5 z-40 p-3 rounded-xl pointer-events-auto bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
          aria-label="Open Menu"
        >
          <FaBars className="text-xl" />
        </button>
      )}

      {/* Sidebar - No Animation, Conditional Render */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-50 pointer-events-auto flex">
          <div className="flex flex-col h-full w-72 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] shadow-xl overflow-hidden">

            {/* Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-purple)] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CS</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Customer Sheet</h1>
                  <p className="text-xs text-[var(--text-tertiary)]">Management System</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)]"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl 
                    ${isActive
                        ? "bg-[var(--accent-blue)] text-white"
                        : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]"
                      }`}
                  >
                    {/* Icon Container */}
                    <span className={`mr-3 p-1.5 rounded-lg
                    ${isActive
                        ? "bg-white/20"
                        : "bg-[var(--bg-surface)]"
                      }`}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--bg-surface)] min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--accent-blue)] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {decoded.username?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{decoded.username || 'Admin'}</p>
                    <p className="text-xs text-[var(--text-tertiary)] capitalize">{decoded.role || 'User'}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings();
                  }}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-subtle)] transition-all"
                  aria-label="Settings"
                >
                  <FaCog />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 cursor-pointer pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
