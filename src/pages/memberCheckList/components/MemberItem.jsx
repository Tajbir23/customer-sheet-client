import React, { useState } from 'react'
import { FaCheck, FaTimes, FaEnvelope, FaTag, FaStar, FaCopy } from 'react-icons/fa'

const MemberItem = ({ member }) => {
  const { email, isChecked, isResell } = member
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
    <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
      isChecked 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300 shadow-sm hover:shadow-md' 
        : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100'
    }`}>
      
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-16 h-16 bg-current rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-current rounded-full translate-y-6 -translate-x-6"></div>
      </div>
      
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          {/* Member Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              isChecked
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-gray-300 text-gray-600'
            } transition-all duration-300`}>
              {isChecked ? <FaCheck className="text-sm" /> : <FaTimes className="text-sm" />}
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${
                isChecked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
              }`}>
                <FaEnvelope className="text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-sm sm:text-base truncate ${
                    isChecked ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {email}
                  </p>
                  <button
                    onClick={handleCopyEmail}
                    className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 group/copy ${
                      isChecked 
                        ? 'bg-green-100 hover:bg-green-200 text-green-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Copy email"
                  >
                    {copied ? (
                      <FaCheck className="text-xs text-green-500" />
                    ) : (
                      <FaCopy className="text-xs group-hover/copy:scale-110 transition-transform" />
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
          
          {/* Status and Resell Indicators */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Resell Badge */}
            {isResell && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-xl text-xs font-bold border border-purple-200 shadow-sm">
                <FaStar className="text-xs" />
                <span>Resell</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-300 ${
              isChecked
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-red-400 to-rose-400 text-white shadow-red-400/25'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isChecked ? 'bg-green-200' : 'bg-red-200'
              } animate-pulse`}></div>
              <span>{isChecked ? 'Checked' : 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Border Animation */}
      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
        isChecked 
          ? 'bg-gradient-to-r from-green-400 to-emerald-400 w-full' 
          : 'bg-gradient-to-r from-gray-400 to-slate-400 w-0 group-hover:w-full'
      }`}></div>
    </div>
  )
}

export default MemberItem 