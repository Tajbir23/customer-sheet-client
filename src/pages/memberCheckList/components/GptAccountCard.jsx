import React, { useState } from 'react'
import MemberItem from './MemberItem'
import { FaEnvelope, FaUsers, FaClock, FaCalendarAlt, FaCopy, FaCheck } from 'react-icons/fa'

const GptAccountCard = ({ accountData, data, setData }) => {
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
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[var(--border-default)] group h-full">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-purple)]/50 transition-colors">
                <FaEnvelope className="text-[var(--accent-purple)] text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white truncate" title={gptAccount}>
                    {gptAccount}
                  </h3>
                  <button
                    onClick={handleCopyEmail}
                    className="flex-shrink-0 p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)] transition-all duration-200"
                    title="Copy email"
                  >
                    {copied ? (
                      <FaCheck className="text-[var(--success)] text-xs" />
                    ) : (
                      <FaCopy className="text-xs" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="opacity-70" />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="opacity-70" />
                    <span>{formatTime(createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[140px]">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-white font-bold text-lg leading-none">
                <FaUsers className="text-[var(--text-tertiary)] text-xs" />
                <span>{members.length}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mt-1">Members</p>
            </div>

            {/* Completion Ring */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="var(--bg-elevated)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke={completionPercentage === 100 ? 'var(--success)' : completionPercentage >= 50 ? 'var(--warning)' : 'var(--error)'}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={100}
                  strokeDashoffset={100 - completionPercentage}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className={`absolute text-[10px] font-bold ${completionPercentage === 100 ? 'text-[var(--success)]' : completionPercentage >= 50 ? 'text-[var(--warning)]' : 'text-[var(--error)]'
                }`}>
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="p-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/50">
          <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Team Members</h4>
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${checkedMembers === members.length
            ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20'
            : 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border-[var(--border-subtle)]'
            }`}>
            {checkedMembers}/{members.length} CHECKED
          </div>
        </div>

        {/* Members List */}
        <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-5 space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                <FaUsers className="text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm font-medium">No members found</p>
            </div>
          ) : (
            members.map((member, index) => (
              <div
                key={member._id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 30}ms`
                }}
              >
                <MemberItem member={member} gptAccount={gptAccount} data={data} setData={setData} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default GptAccountCard 