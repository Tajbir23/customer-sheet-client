import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'

const AddResellerModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gptAccount: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await handleApi('/reseller/add-reseller', 'POST', formData, navigate)

      if (response?.success) {
        onSuccess(response.reseller)
      } else {
        toast.error(response?.message || 'Failed to add reseller')
      }
    } catch (error) {
      console.error('Error adding reseller:', error)
      toast.error('Failed to add reseller')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl w-full max-w-lg border border-[var(--border-subtle)]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-purple)]/20 rounded-xl flex items-center justify-center">
                <span className="text-[var(--accent-purple)] text-lg font-bold">+</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Add New Reseller</h2>
                <p className="text-[var(--text-tertiary)] text-sm">Fill in the reseller information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
              title="Close"
            >
              <span className="w-4 h-4 text-[var(--text-tertiary)] font-bold">X</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Full Name <span className="text-[var(--error)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="text-[var(--text-tertiary)] font-bold">U</span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all text-white placeholder-[var(--text-muted)]"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="text-[var(--text-tertiary)] font-bold">@</span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all text-white placeholder-[var(--text-muted)]"
                placeholder="reseller@example.com"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Phone Number <span className="text-[var(--error)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="text-[var(--text-tertiary)] font-bold">P</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all text-white placeholder-[var(--text-muted)]"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Password <span className="text-[var(--error)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="text-[var(--text-tertiary)] font-bold">***</span>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all text-white placeholder-[var(--text-muted)]"
                placeholder="Enter password"
              />
            </div>
          </div>

          {/* GPT Account Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              GPT Account
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="text-[var(--text-tertiary)] font-bold">GPT</span>
              </div>
              <input
                type="text"
                name="gptAccount"
                value={formData.gptAccount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all text-white placeholder-[var(--text-muted)]"
                placeholder="GPT account identifier (optional)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${isSubmitting
                ? 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] cursor-not-allowed'
                : 'bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-white'
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 animate-spin font-bold">...</span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="w-4 h-4 font-bold">✓</span>
                  Add Reseller
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResellerModal
