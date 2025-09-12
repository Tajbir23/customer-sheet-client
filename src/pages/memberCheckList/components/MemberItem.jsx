import React, { useState } from 'react'
import { FaCheck, FaTimes, FaEnvelope, FaCopy, FaUser, FaStar } from 'react-icons/fa'

const MemberItem = ({ member }) => {
  const { email, isChecked, isResell, reference } = member
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <div className={`border rounded-lg p-4 transition-colors duration-200 ${
      isChecked 
        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        {/* Member Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Status Icon */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isChecked
              ? 'bg-green text-white'
              : 'bg-gray-300 text-gray-600'
          }`}>
            {isChecked ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
          </div>
          
          {/* Email Info */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className={`p-2 rounded ${
              isChecked ? 'bg-green-100 text-green' : 'bg-gray-200 text-gray-500'
            }`}>
              <FaEnvelope className="text-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p className={`font-medium text-sm truncate ${
                  isChecked ? 'text-green-800' : 'text-gray-700'
                }`}>
                  {email}
                </p>
                <button
                  onClick={handleCopyEmail}
                  className={`p-1 rounded transition-colors duration-200 ${
                    isChecked 
                      ? 'bg-green-100 hover:bg-green-200 text-green' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Copy email"
                >
                  {copied ? (
                    <FaCheck className="text-xs text-green" />
                  ) : (
                    <FaCopy className="text-xs" />
                  )}
                </button>
              </div>
              <p className={`text-xs ${
                isChecked ? 'text-green-600' : 'text-gray-500'
              }`}>
                Team Member
              </p>
            </div>
          </div>
        </div>
        
        {/* Status and Indicators */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Reference Badge */}
          {reference?._id && (
            <div className="flex items-center space-x-1 bg-blue-50 text-blue px-2 py-1 rounded text-xs font-medium border border-blue-200">
              <FaUser className="text-xs" />
              <span>{reference.username}</span>
            </div>
          )}
          
          {/* Resell Badge */}
          {isResell && (
            <div className="flex items-center space-x-1 bg-orange-50 text-orange px-2 py-1 rounded text-xs font-medium border border-orange-200">
              <FaStar className="text-xs" />
              <span>Resell</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium ${
            isChecked
              ? 'bg-green text-white'
              : 'bg-red text-white'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              isChecked ? 'bg-green-200' : 'bg-red-200'
            }`}></div>
            <span>{isChecked ? 'Checked' : 'Pending'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberItem 