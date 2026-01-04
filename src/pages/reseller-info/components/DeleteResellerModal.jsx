import React, { useState } from 'react'
import { FaExclamationTriangle, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa'

const DeleteResellerModal = ({ reseller, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(reseller._id)
    setIsDeleting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-fadeIn">
        {/* Warning Icon */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <FaExclamationTriangle className="text-red-500 text-4xl" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Reseller</h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-700">"{reseller.name}"</span>?
            This action cannot be undone.
          </p>

          {/* Reseller Info Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Name:</span>
                <span className="font-medium text-gray-700 text-sm">{reseller.name}</span>
              </div>
              {reseller.email && (
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Email:</span>
                  <span className="font-medium text-gray-700 text-sm">{reseller.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Phone:</span>
                <span className="font-medium text-gray-700 text-sm">{reseller.phone}</span>
              </div>
              {reseller.gptAccount && (
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">GPT Account:</span>
                  <span className="font-medium text-gray-700 text-sm">{reseller.gptAccount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isDeleting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4" />
                  Yes, Delete
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteResellerModal
