import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaUsers, FaRobot, FaPaypal, FaTeamspeak, FaList } from 'react-icons/fa'
import { BiWorld } from 'react-icons/bi'
import { HiX } from 'react-icons/hi'
import { HiMenuAlt3 } from 'react-icons/hi'

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', path: '/', icon: <FaHome size={20} /> },
    { name: 'Customers', path: '/customers', icon: <FaUsers size={20} /> },
    { name: 'Teams', path: '/teams', icon: <FaTeamspeak size={20} /> },
    { name: 'ChatGPT accounts', path: '/chatgpt-accounts', icon: <FaRobot size={20} /> },
    { name: 'Member Check list', path: '/member-check-list', icon: <FaList size={20} /> },
    { name: 'Asocks', path: '/asocks', icon: <BiWorld size={20} /> }
  ]

  return (
    <div className="fixed z-40 h-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors duration-200 ${
          isOpen 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-gray-600`}
      >
        {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex flex-col h-full w-64 bg-[#1a1f2b] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-[#1a1f2b] border-b border-gray-700">
            <h1 className="text-xl font-semibold text-white">Customer Sheet</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-[#2d3545] text-white shadow-lg'
                    : 'text-gray-300 hover:bg-[#2d3545] hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar