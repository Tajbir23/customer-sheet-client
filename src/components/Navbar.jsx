import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaRobot,
  FaPaypal,
  FaTeamspeak,
  FaList,
  FaTrash,
  FaQrcode,
  FaFileInvoice,
  FaSubscript,
  FaUser,
} from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { HiMenuAlt3 } from "react-icons/hi";
import { jwtDecode } from 'jwt-decode';
import { FaMessage } from "react-icons/fa6";


const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);

  let navigation = [];

  if (decoded.role === 'admin') {
    navigation = [
      { name: "Home", path: "/", icon: <FaHome size={18} /> },
      { name: "Customers", path: "/customers", icon: <FaUsers size={18} /> },
      { name: "Teams", path: "/teams", icon: <FaTeamspeak size={18} /> },
      {
        name: "ChatGPT Accounts",
        path: "/chatgpt-accounts",
        icon: <FaRobot size={18} />,
      },
      {
        name: "Member Check List",
        path: "/member-check-list",
        icon: <FaList size={18} />,
      },
      {
        name: "PayPal Accounts",
        path: "/paypal-accounts",
        icon: <FaPaypal size={18} />,
      },
      {
        name: "Removed Members",
        path: "/removed-members",
        icon: <FaTrash size={18} />,
      },
      {
        name: "Subscription End",
        path: "/subscription-end-members",
        icon: <FaSubscript size={18} />,
      },
      { name: "Asocks", path: "/asocks", icon: <BiWorld size={18} /> },
      { name: "QR Code", path: "/qr-code", icon: <FaQrcode size={18} /> },
      {
        name: "Search Invoice",
        path: "/search-invoice",
        icon: <FaFileInvoice size={18} />,
      },
      {
        name: "Reseller",
        path: "/reseller-info",
        icon: <FaUser size={18} />,
      },
      {
        name: "Send Message",
        path: "/send-custom-message",
        icon: <FaMessage size={18} />,
      }
    ];
  }

  if (decoded.role === "reseller") {
    navigation = [
      { name: "Home", path: "/reseller", icon: <FaHome size={18} /> },
    ]
  }

  return (
    <div className="fixed z-40 h-full pointer-events-none">
      {/* Toggle Button - Floating with glow effect */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`fixed top-5 left-5 z-40 p-3 rounded-xl transition-all duration-500 ease-out pointer-events-auto
          ${isOpen
            ? "opacity-0 -translate-x-full pointer-events-none"
            : "opacity-100 translate-x-0 bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-elevated)] shadow-lg"
          } 
          border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] focus:ring-opacity-50`}
        aria-label="Open Menu"
      >
        <HiMenuAlt3 size={22} />
      </button>

      {/* Sidebar with Glassmorphism */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-out z-50 pointer-events-auto`}
      >
        <div className="flex flex-col h-full w-72 glass-card rounded-none rounded-r-2xl border-l-0 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(30, 30, 42, 0.98) 0%, rgba(18, 18, 26, 0.99) 100%)',
            backdropFilter: 'blur(12px)',
            borderLeft: 'none',
            borderTop: 'none',
            borderBottom: 'none',
          }}>

          {/* Header with Gradient */}
          <div className="relative h-20 px-6 flex items-center justify-between border-b border-[var(--border-subtle)]"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            }}>
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)] flex items-center justify-center shadow-lg">
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
              className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <HiX size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl 
                    transition-all duration-300 relative overflow-hidden
                    ${isActive
                      ? "bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] text-white shadow-lg"
                      : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]"
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] opacity-20 blur-xl" />
                  )}

                  {/* Icon Container */}
                  <span className={`relative mr-3 p-1.5 rounded-lg transition-all duration-300
                    ${isActive
                      ? "bg-white/20"
                      : "bg-[var(--bg-surface)] group-hover:bg-[var(--accent-purple)]/20"
                    }`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="relative font-medium">{item.name}</span>

                  {/* Hover Arrow */}
                  {!isActive && (
                    <span className="absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--bg-surface)]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-blue)] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {decoded.username?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{decoded.username || 'Admin'}</p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">{decoded.role || 'User'}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_8px_var(--success)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer animate-fade-in pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
