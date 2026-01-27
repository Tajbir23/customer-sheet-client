import React, { useState } from 'react'


const DeleteResellerModal = ({ reseller, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(reseller._id)
    setIsDeleting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-md border border-[var(--border-subtle)]">
        {/* Warning Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 bg-[var(--error)]/10 rounded-full flex items-center justify-center">
            <span className="text-[var(--error)] text-4xl font-bold">!</span>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Delete Reseller</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">"{reseller.name}"</span>?
              This action cannot be undone.
            </p>

            {/* Reseller Info Summary */}
            <div className="bg-[var(--bg-surface)] rounded-xl p-4 mb-6 text-left border border-[var(--border-subtle)]">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)] text-sm">Name:</span>
                  <span className="font-medium text-white text-sm">{reseller.name}</span>
                </div>
                {reseller.email && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)] text-sm">Email:</span>
                    <span className="font-medium text-white text-sm">{reseller.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)] text-sm">Phone:</span>
                  <span className="font-medium text-white text-sm">{reseller.phone}</span>
                </div>
                {reseller.gptAccount && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)] text-sm">GPT Account:</span>
                    <span className="font-medium text-white text-sm">{reseller.gptAccount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${isDeleting
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] cursor-not-allowed'
                  : 'bg-[var(--error)] hover:bg-[var(--error)]/90 text-white'
                  }`}
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 animate-spin font-bold">...</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 font-bold">X</span>
                    Yes, Delete
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="w-4 h-4 font-bold">X</span>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteResellerModal
