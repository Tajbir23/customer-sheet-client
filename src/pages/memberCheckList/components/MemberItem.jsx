import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import UpdateMember from './UpdateMember'
import AddMember from './AddMember'
import removeDataFromCheckList from './removeDataFromChecklist'
import handleApi from '../../../libs/handleAPi'

const MemberItem = ({ member, gptAccount, data, setData }) => {
  const { email, isChecked, isResell, reference } = member
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const handleRemoveMember = async () => {
    setIsRemoving(true)
    try {
      const response = await handleApi('/gpt-account/remove-from-checklist', 'DELETE', {
        gptAccount,
        email: email.trim()
      })

      if (response.success) {
        toast.success(`${email} removed from checklist`)
        removeDataFromCheckList(gptAccount, email, data, setData)
        setShowRemoveConfirm(false)
      } else {
        toast.error(response.message || 'Failed to remove member')
      }
    } catch (err) {
      console.error('Error removing member from checklist:', err)
      toast.error('Failed to remove member from checklist')
    } finally {
      setIsRemoving(false)
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
              {isChecked ? <span className="font-bold text-sm">✔</span> : <span className="font-bold text-sm">✕</span>}
            </button>

            {/* Email Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isChecked ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]'}`}>@</span>
                <p
                  onClick={handleCopyEmail}
                  className={`font-mono text-sm truncate transition-colors cursor-pointer hover:text-[var(--accent-blue)] ${copied
                      ? 'text-[var(--success)] font-bold'
                      : isChecked
                        ? 'text-[var(--text-primary)] font-medium'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  title="Click to copy email"
                >
                  {email}
                </p>
                {copied && (
                  <span className="text-[10px] text-[var(--success)] font-bold">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Team Member</span>
              </div>
            </div>

            {/* Remove Button & Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Badges */}
              <div className="flex flex-col items-end gap-1.5">
                {reference?._id && (
                  <div className="flex items-center gap-1 bg-[var(--accent-blue)] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-blue-500/20">
                    <span className="text-[9px] font-bold">Ref:</span>
                    <span>{reference.username}</span>
                  </div>
                )}

                {isResell && (
                  <div className="flex items-center gap-1 bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[var(--accent-purple)]/20">
                    <span className="font-bold">★</span>
                    <span>Resell</span>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => setShowRemoveConfirm(true)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 border border-transparent hover:border-[var(--error)]/30 transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                title="Remove member"
              >
                <span className="text-xs font-bold">🗑</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen === 'update' && <UpdateMember member={member} gptAccount={gptAccount} setIsOpen={setIsOpen} memberData={data} setData={setData} />}
      {isOpen === 'add' && <AddMember member={member} gptAccount={gptAccount} setIsOpen={setIsOpen} reference={reference} memberData={data} setData={setData} />}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && createPortal(
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] max-w-sm w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--error)]/20 rounded-xl flex items-center justify-center">
                  <span className="text-[var(--error)] font-bold text-lg">🗑</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Remove Member</h3>
                  <p className="text-[var(--text-tertiary)] text-xs">{gptAccount}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Are you sure you want to remove this member from checklist?
              </p>
              <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                <p className="text-sm font-mono text-white font-medium truncate">{email}</p>
              </div>

              <div className="mt-3 p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl">
                <p className="text-xs text-[var(--warning)] font-medium">
                  ⚠️ This will only remove the member from the checklist, not from the team or monitoring server.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                disabled={isRemoving}
                className="px-4 py-2 text-sm font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                disabled={isRemoving}
                className="px-4 py-2 text-sm font-bold text-white bg-[var(--error)] hover:bg-[var(--error)]/90 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default MemberItem 