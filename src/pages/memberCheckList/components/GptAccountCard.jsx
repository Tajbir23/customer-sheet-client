import React from 'react'
import MemberItem from './MemberItem'
import { FaEnvelope, FaUsers, FaClock, FaCalendarAlt } from 'react-icons/fa'

const GptAccountCard = ({ accountData }) => {
  const { gptAccount, members, createdAt } = accountData
  
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

  const checkedMembers = members.filter(member => member.isChecked).length
  const completionPercentage = members.length > 0 ? Math.round((checkedMembers / members.length) * 100) : 0

  return (
    <div className="group relative">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-gray-200">
        {/* Card Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white truncate">
                      {gptAccount}
                    </h3>
                    <p className="text-blue-100 text-sm font-medium">GPT Account</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-sm" />
                    <span className="text-sm font-medium">{formatDate(createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-sm" />
                    <span className="text-sm font-medium">{formatTime(createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaUsers className="text-white text-lg" />
                    <span className="text-2xl font-bold text-white">{members.length}</span>
                  </div>
                  <p className="text-blue-100 text-sm font-medium">Members</p>
                </div>
                
                {/* Completion Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  completionPercentage === 100 
                    ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                    : completionPercentage >= 50 
                    ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    completionPercentage === 100 ? 'bg-green-400' 
                    : completionPercentage >= 50 ? 'bg-yellow-400' 
                    : 'bg-red-400'
                  }`}></div>
                  {completionPercentage}% Complete
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Members Section */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-900">Team Members</h4>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {checkedMembers} of {members.length} checked
            </div>
          </div>
          
          {/* Members List */}
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {members.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">👥</div>
                <p className="text-gray-500 font-medium">No members found</p>
              </div>
            ) : (
              members.map((member, index) => (
                <div
                  key={member._id}
                  className="transform transition-all duration-200"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <MemberItem member={member} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  )
}

export default GptAccountCard 