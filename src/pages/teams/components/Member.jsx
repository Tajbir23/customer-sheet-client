import React, { useState } from 'react'


const Member = ({ index, team, member, onRemoveMember, isNewlyAdded = false }) => {
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
            'bg-indigo-500', 'bg-amber-500', 'bg-red-500', 'bg-teal-500'
        ]
        return colors[Math.abs(hash) % colors.length]
    }

    return (
        <>
            <div className={`
                relative p-4 rounded-xl border transition-all duration-300 group hover:shadow-lg
                ${isNewlyAdded
                    ? 'bg-[var(--success-bg)] border-[var(--success)] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-blue)] hover:bg-[var(--bg-elevated)]'
                }
            `}>
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md
                        ${getAvatarColor(member)}
                        ${team?.isActive ? '' : 'opacity-75'}
                    `}>
                        {getInitials(member)}

                        {/* Status Indicator */}
                        <div className={`
                            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-card)]
                            ${team?.isActive ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}
                        `} />
                    </div>

                    {/* Member Info */}
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm truncate font-semibold text-[var(--text-primary)]">
                                {member}
                            </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={`
                                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                ${team?.isActive
                                    ? 'bg-[var(--success-bg)] text-[var(--success-light)]'
                                    : 'bg-[var(--error-bg)] text-[var(--error-light)]'
                                }
                            `}>
                                <div className={`w-1.5 h-1.5 rounded-full ${team?.isActive ? 'bg-[var(--success)]' : 'bg-[var(--error)]'
                                    }`} />
                                {team?.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Remove Button */}
                        <button
                            onClick={handleRemoveClick}
                            className={`
                                opacity-0 group-hover:opacity-100 transition-all duration-200 
                                px-3 py-1 rounded-lg
                                hover:bg-[var(--error-bg)] text-[var(--text-tertiary)] hover:text-[var(--error)]
                                focus:outline-none focus:opacity-100 text-xs font-bold border border-transparent hover:border-[var(--error)]
                            `}
                            title="Remove member"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                background: 'linear-gradient(135deg, var(--error) 0%, var(--error-dark) 100%)'
                            }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                    !
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Remove Member
                                </h3>
                            </div>
                            <button
                                onClick={handleCancelRemove}
                                className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 text-lg font-bold"
                            >
                                X
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-[var(--text-primary)] font-medium mb-6">
                                Are you sure you want to remove this member?
                            </p>

                            {/* Member Preview Card */}
                            <div className="rounded-xl p-4 mb-6 border"
                                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold
                                        ${getAvatarColor(member)}
                                    `}>
                                        {getInitials(member)}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-[var(--text-primary)] truncate">
                                            {member}
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)] truncate">
                                            From team: {team.gptAccount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl p-4 border flex items-start gap-3"
                                style={{
                                    background: 'var(--warning-bg)',
                                    borderColor: 'var(--warning)/30'
                                }}>
                                <span className="text-[var(--warning)] text-lg">⚠️</span>
                                <p className="text-sm text-[var(--warning-light)] font-medium">
                                    This action cannot be undone. The member will be permanently removed from this team.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                background: 'var(--bg-elevated)'
                            }}>
                            <button
                                onClick={handleCancelRemove}
                                disabled={isRemoving}
                                className="px-5 py-2.5 text-sm font-bold rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-200"
                                style={{
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'var(--bg-card)'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRemove}
                                disabled={isRemoving}
                                className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center shadow-lg hover:shadow-xl"
                                style={{
                                    background: 'linear-gradient(135deg, var(--error) 0%, var(--error-light) 100%)',
                                }}
                            >
                                {isRemoving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Removing...
                                    </>
                                ) : (
                                    <>
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