import React, { useState } from 'react'
import { FaTrash, FaTimes, FaUser, FaEnvelope } from 'react-icons/fa'

const Member = ({ index, team, member, onRemoveMember }) => {
    const [showModal, setShowModal] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)

    const handleRemoveClick = () => {
        setShowModal(true)
    }

    const handleConfirmRemove = async () => {
        setIsRemoving(true)
        try {
            await onRemoveMember(team._id, member, index)
            setShowModal(false)
        } catch (error) {
            console.error('Error removing member:', error)
        } finally {
            setIsRemoving(false)
        }
    }

    const handleCancelRemove = () => {
        setShowModal(false)
    }

    // Generate avatar initials from email
    const getInitials = (email) => {
        const name = email.split('@')[0]
        return name.slice(0, 2).toUpperCase()
    }

    // Generate consistent color from email
    const getAvatarColor = (email) => {
        let hash = 0
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash)
        }
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
            'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
        ]
        return colors[Math.abs(hash) % colors.length]
    }

    return (
        <>
            <div className={`
                relative p-4 rounded-lg border transition-all duration-200 group hover:shadow-md
                ${team?.isActive 
                    ? 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700' 
                    : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20'
                }
            `}>
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold
                        ${getAvatarColor(member)}
                        ${team?.isActive ? '' : 'opacity-75'}
                    `}>
                        {getInitials(member)}
                        
                        {/* Status Indicator */}
                        <div className={`
                            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-700
                            ${team?.isActive ? 'bg-green-500' : 'bg-red-500'}
                        `} />
                    </div>

                    {/* Member Info */}
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <FaEnvelope className={`w-3 h-3 flex-shrink-0 ${
                                team?.isActive 
                                    ? 'text-gray-400 dark:text-gray-500' 
                                    : 'text-red-400 dark:text-red-500'
                            }`} />
                            <span className={`
                                font-medium text-sm truncate
                                ${team?.isActive
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-red-900 dark:text-red-100'
                                }
                            `}>
                                {member}
                            </span>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={`
                                inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                                ${team?.isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }
                            `}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    team?.isActive ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                {team?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Remove Button */}
                        <button
                            onClick={handleRemoveClick}
                            className={`
                                opacity-0 group-hover:opacity-100 transition-all duration-200 
                                p-2 rounded-lg hover:scale-105 active:scale-95
                                ${team?.isActive 
                                    ? 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                    : 'hover:bg-red-200 dark:hover:bg-red-800/30 text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200'
                                }
                                focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-red-500/20
                            `}
                            title="Remove member"
                        >
                            <FaTrash className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                    <FaTrash className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Remove Member
                                </h3>
                            </div>
                            <button
                                onClick={handleCancelRemove}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-gray-900 dark:text-white font-medium mb-4">
                                Are you sure you want to remove this member?
                            </p>
                            
                            {/* Member Preview Card */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold
                                        ${getAvatarColor(member)}
                                    `}>
                                        {getInitials(member)}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {member}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            From team: {team.gptAccount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</span>
                                    This action cannot be undone. The member will be permanently removed from this team.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                onClick={handleCancelRemove}
                                disabled={isRemoving}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                disabled={isRemoving}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                            >
                                {isRemoving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="w-3 h-3" />
                                        Remove Member
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Member