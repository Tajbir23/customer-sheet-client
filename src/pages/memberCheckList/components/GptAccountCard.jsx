import React, { useState } from 'react'
import MemberItem from './MemberItem'
import { FaEnvelope, FaUsers, FaClock, FaCalendarAlt, FaCopy, FaCheck } from 'react-icons/fa'

const GptAccountCard = ({ accountData }) => {
  const { gptAccount, members, createdAt } = accountData
  const [copied, setCopied] = useState(false)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(gptAccount)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const checkedMembers = members.filter(member => member.isChecked).length
  const completionPercentage = members.length > 0 ? Math.round((checkedMembers / members.length) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center">
              <FaEnvelope className="text-white text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {gptAccount}
                </h3>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 text-gray-400 hover:text-blue bg-gray-50 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Copy email"
                >
                  {copied ? (
                    <FaCheck className="text-green text-sm" />
                  ) : (
                    <FaCopy className="text-sm" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">GPT Account</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <FaUsers className="text-blue" />
              <span className="font-medium text-gray-900">{members.length}</span>
              <span>Members</span>
            </div>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              completionPercentage === 100 
                ? 'bg-green-50 text-green border border-green-200' 
                : completionPercentage >= 50 
                ? 'bg-orange-50 text-orange border border-orange-200'
                : 'bg-red-50 text-red border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                completionPercentage === 100 ? 'bg-green' 
                : completionPercentage >= 50 ? 'bg-orange' 
                : 'bg-red'
              }`}></div>
              <span>{completionPercentage}% Complete</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
          <div className="flex items-center space-x-1">
            <FaCalendarAlt />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock />
            <span>{formatTime(createdAt)}</span>
          </div>
        </div>
      </div>
      
      {/* Members Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Team Members</h4>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            {checkedMembers} of {members.length} checked
          </div>
        </div>
        
        {/* Members List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No members found</p>
            </div>
          ) : (
            members.map((member) => (
              <MemberItem key={member._id} member={member} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default GptAccountCard 