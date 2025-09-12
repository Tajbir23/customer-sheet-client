import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaUsers, FaRobot, FaPaypal, FaTeamspeak, FaList } from 'react-icons/fa'
import { BiWorld } from 'react-icons/bi'
import { HiX } from 'react-icons/hi'
import { HiMenuAlt3 } from 'react-icons/hi'

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', path: '/', icon: <FaHome size={16} /> },
    { name: 'Customers', path: '/customers', icon: <FaUsers size={16} /> },
    { name: 'Teams', path: '/teams', icon: <FaTeamspeak size={16} /> },
    { name: 'ChatGPT accounts', path: '/chatgpt-accounts', icon: <FaRobot size={16} /> },
    { name: 'Member Check list', path: '/member-check-list', icon: <FaList size={16} /> },
    { name: 'Asocks', path: '/asocks', icon: <BiWorld size={16} /> }
  ]

  return (
    <div className="fixed z-40 h-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="btn btn-primary fixed top-4 left-4 z-50"
      >
        {isOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-30`}>
        <div className="flex flex-col h-full w-64 sidebar">
          {/* Header */}
          <div className="sidebar-header flex items-center justify-between h-16 px-4">
            <h1 className="text-lg font-semibold text-gray-700">Customer Sheet</h1>
            <button
              type="button"
              className="btn btn-secondary p-2"
              onClick={() => setIsOpen(false)}
            >
              <HiX size={16} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`sidebar-nav-item flex items-center px-3 py-2 text-sm font-medium rounded ${
                  location.pathname === item.path
                    ? 'active'
                    : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Customer Sheet
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="modal-backdrop fixed inset-0 z-20 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar