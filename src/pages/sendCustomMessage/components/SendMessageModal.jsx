import React, { useState } from 'react'
import { FaTimes, FaPaperPlane, FaWhatsapp } from 'react-icons/fa'

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <FaWhatsapp className="text-white text-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Send Message</h2>
                            <p className="text-sm text-gray-500">
                                To {selectedCount} customer{selectedCount > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none"
                    />
                    <p className="mt-2 text-xs text-gray-400">
                        This message will be sent to all {selectedCount} selected customer{selectedCount > 1 ? 's' : ''} via WhatsApp.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="text-sm" />
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
