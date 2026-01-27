import React, { useState } from 'react'


const SendMessageModal = ({ isOpen, onClose, selectedCount, onSend }) => {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    if (!isOpen) return null

    const handleSend = async () => {
        if (!message.trim()) return

        setSending(true)
        try {
            await onSend(message)
            setMessage('')
            onClose()
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-2xl border border-[var(--border-subtle)] w-full max-w-lg transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--success)] flex items-center justify-center">
                            <span className="text-white text-lg font-bold">WA</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Send Message</h2>
                            <p className="text-sm text-[var(--text-tertiary)]">
                                To {selectedCount} customer{selectedCount > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                        <span className="text-[var(--text-tertiary)] hover:text-white font-bold">X</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block text-sm font-semibold text-white mb-2">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                        className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--success)] focus:ring-1 focus:ring-[var(--success)] transition-all duration-200 text-white placeholder-[var(--text-muted)] resize-none"
                    />
                    <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                        This message will be sent to all {selectedCount} selected customer{selectedCount > 1 ? 's' : ''} via WhatsApp.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--success)] hover:bg-[var(--success)]/90 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-bold">Send</span>
                                <span>Send Message</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SendMessageModal
