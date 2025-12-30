import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaRobot, FaEdit, FaTrash, FaCalendarAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

// Password Field Component with show/hide toggle
const PasswordField = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <FaLock className="text-red-600 text-sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Password</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700 truncate">
            {showPassword ? password : '••••••••'}
          </p>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400 text-xs" />
            ) : (
              <FaEye className="text-gray-400 text-xs" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const ResellerCard = ({ reseller, onEdit, onDelete }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {reseller.name}
            </h3>
            <p className="text-purple-100 text-sm truncate">
              {reseller.email || 'No email provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        {/* Contact Info */}
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaEnvelope className="text-purple-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-gray-700 truncate">
                {reseller.email || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaPhone className="text-green-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium text-gray-700 truncate">
                {reseller.phone}
              </p>
            </div>
          </div>

          {/* GPT Account */}
          <div className="flex items-center gap-3 text-gray-600">
            <div className={`w-8 h-8 ${reseller.gptAccount ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <FaRobot className={`${reseller.gptAccount ? 'text-blue-600' : 'text-gray-400'} text-sm`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">GPT Account</p>
              <p className={`text-sm font-medium truncate ${reseller.gptAccount ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                {reseller.gptAccount || 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Password */}
          <PasswordField password={reseller.password} />

          {/* Created At */}
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-orange-600 text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Created</p>
              <p className="text-sm font-medium text-gray-700">
                {formatDate(reseller.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(reseller)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FaEdit className="text-sm" />
            Edit
          </button>
          <button
            onClick={() => onDelete(reseller)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FaTrash className="text-sm" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResellerCard
