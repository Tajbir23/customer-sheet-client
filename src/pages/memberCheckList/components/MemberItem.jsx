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
      <div className={`relative rounded-xl border transition-all duration-200 group/item ${isChecked
        ? 'bg-[var(--success)]/5 border-[var(--success)]/20 hover:border-[var(--success)]/40'
        : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30'
        }`}>
        <div className="p-3">
          <div className="flex items-center justify-between gap-3">
            {/* Status Icon */}
            <button
              onClick={() => setIsOpen(isChecked ? 'update' : 'add')}
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isChecked
                ? 'bg-[var(--success)] text-white shadow-lg shadow-green-500/20 hover:bg-[var(--success)]/90'
                : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10'
                }`}
            >
              {isChecked ? <FaCheck size={10} /> : <FaTimes size={10} />}
            </button>

            {/* Email Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FaEnvelope className={`text-xs ${isChecked ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]'}`} />
                <p className={`font-mono text-sm truncate transition-colors ${isChecked ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                  {email}
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-white transition-colors opacity-0 group-hover/item:opacity-100"
                  title="Copy email"
                >
                  {copied ? (
                    <FaCheck className="text-[10px] text-[var(--success)]" />
                  ) : (
                    <FaCopy className="text-[10px]" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Team Member</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              {reference?._id && (
                <div className="flex items-center gap-1 bg-[var(--accent-blue)] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-blue-500/20">
                  <FaUser className="text-[9px]" />
                  <span>{reference.username}</span>
                </div>
              )}

              {isResell && (
                <div className="flex items-center gap-1 bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[var(--accent-purple)]/20">
                  <FaStar className="text-[9px]" />
                  <span>Resell</span>
                </div>
              )}
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