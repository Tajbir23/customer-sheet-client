import React from 'react'
import { FaPaperPlane, FaCommentDots } from 'react-icons/fa'

const PageHeader = ({ selectedCount, onSendClick }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Title and Description */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                        <FaCommentDots className="h-6 w-6 text-[var(--accent-blue)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                            Send Custom Message
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Select customers to send WhatsApp messages
                        </p>
                    </div>
                </div>

                {/* Send Message Button */}
                {selectedCount > 0 && (
                    <button
                        onClick={onSendClick}
                        className="group flex items-center gap-3 bg-[var(--success)] hover:bg-[var(--success)]/90 text-white px-6 py-3 rounded-xl transition-all duration-200 font-bold"
                    >
                        <FaPaperPlane className="text-lg group-hover:scale-110 transition-transform duration-200" />
                        <span>Send to {selectedCount} Customer{selectedCount > 1 ? 's' : ''}</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default PageHeader
