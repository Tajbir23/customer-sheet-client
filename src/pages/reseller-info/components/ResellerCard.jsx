import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaRobot, FaEdit, FaTrash, FaCalendarAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

// Password Field Component with show/hide toggle
const PasswordField = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
      <div className="w-8 h-8 bg-[var(--error)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <FaLock className="text-[var(--error)] text-sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Password</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">
            {showPassword ? password : '••••••••'}
          </p>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-[var(--bg-hover)] rounded transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FaEyeSlash className="text-[var(--text-tertiary)] text-xs" />
            ) : (
              <FaEye className="text-[var(--text-tertiary)] text-xs" />
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
    <div className="group bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30 transition-all duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="bg-[var(--bg-surface)] p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center">
            <FaUser className="text-[var(--accent-purple)] text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {reseller.name}
            </h3>
            <p className="text-[var(--text-tertiary)] text-sm truncate">
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
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="w-8 h-8 bg-[var(--accent-purple)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaEnvelope className="text-[var(--accent-purple)] text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-white truncate">
                {reseller.email || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="w-8 h-8 bg-[var(--success)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaPhone className="text-[var(--success)] text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium text-white truncate">
                {reseller.phone}
              </p>
            </div>
          </div>

          {/* GPT Account */}
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className={`w-8 h-8 ${reseller.gptAccount ? 'bg-[var(--accent-blue)]/10' : 'bg-[var(--bg-surface)]'} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <FaRobot className={`${reseller.gptAccount ? 'text-[var(--accent-blue)]' : 'text-[var(--text-muted)]'} text-sm`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">GPT Account</p>
              <p className={`text-sm font-medium truncate ${reseller.gptAccount ? 'text-white' : 'text-[var(--text-muted)] italic'}`}>
                {reseller.gptAccount || 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Password */}
          <PasswordField password={reseller.password} />

          {/* Created At */}
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="w-8 h-8 bg-[var(--warning)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-[var(--warning)] text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Created</p>
              <p className="text-sm font-medium text-white">
                {formatDate(reseller.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => onEdit(reseller)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white rounded-lg font-medium transition-all duration-200"
          >
            <FaEdit className="text-sm" />
            Edit
          </button>
          <button
            onClick={() => onDelete(reseller)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--error)] hover:bg-[var(--error)]/90 text-white rounded-lg font-medium transition-all duration-200"
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
