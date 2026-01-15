import React from 'react'
import { FaPaperPlane } from 'react-icons/fa'

const PageHeader = ({ selectedCount, onSendClick }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Title and Description */}
                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                        Send Custom Message
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Select customers to send WhatsApp messages
                    </p>
                </div>

                {/* Send Message Button */}
                {selectedCount > 0 && (
                    <button
                        onClick={onSendClick}
                        className="group flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
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
