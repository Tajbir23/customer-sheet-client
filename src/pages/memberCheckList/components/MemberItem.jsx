import React, { useState } from 'react'
import { FaCheck, FaTimes, FaEnvelope, FaTag, FaStar, FaCopy, FaUser } from 'react-icons/fa'
import UpdateMember from './UpdateMember'
import AddMember from './AddMember'

const MemberItem = ({ member, gptAccount, data, setData }) => {
  const { email, isChecked, isResell, reference } = member
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
    <>
      <div className={`relative rounded-lg border transition-all duration-200 hover:shadow-md ${
        isChecked 
          ? 'bg-white border-green-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Status Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isChecked
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {isChecked ? <FaCheck size={12} /> : <FaTimes size={12} />}
            </div>
            
            {/* Email Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FaEnvelope className={`text-sm ${isChecked ? 'text-green-500' : 'text-gray-400'}`} />
                <p className="font-medium text-gray-700 truncate">
                  {email}
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Copy email"
                >
                  {copied ? (
                    <FaCheck className="text-xs text-green-500" />
                  ) : (
                    <FaCopy className="text-xs" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Team Member
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {reference?._id && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-medium">
                  <FaUser className="text-xs" />
                  <span>{reference.username}</span>
                </div>
              )}
              
              {isResell && (
                <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md text-xs font-medium">
                  <FaStar className="text-xs" />
                  <span>Resell</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsOpen(isChecked ? 'update' : 'add')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isChecked
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-green-200' : 'bg-red-200'}`} />
                <span>{isChecked ? 'Available' : 'Not Available'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen === 'update' && <UpdateMember member={member} gptAccount={gptAccount} setIsOpen={setIsOpen} memberData={data} setData={setData} />}
      {isOpen === 'add' && <AddMember member={member} gptAccount={gptAccount} setIsOpen={setIsOpen} reference={reference} memberData={data} setData={setData} />}
    </>
  )
}

export default MemberItem 