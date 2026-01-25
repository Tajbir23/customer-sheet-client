import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

/**
 * Invite Member Modal Component
 * Sends invite via Socket.IO with single email
 */
const InviteMemberModal = ({
    isOpen,
    onClose,
    team,
    userId,
    onInviteSent
}) => {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const { emit, isConnected } = useSocket();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setIsSending(false);
        onClose();
    };

    const handleSubmit = async () => {
        setError('');

        if (!email.trim()) {
            setError('Please enter an email address');
            return;
        }

        if (!validateEmail(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        if (!isConnected) {
            setError('Socket not connected. Please try again.');
            toast.error('Socket not connected');
            return;
        }

        setIsSending(true);

        try {
            emit('invite-member', {
                userId: userId || null,
                gptAccount: team.gptAccount,
                memberEmail: email.trim(),
                server: team.server
            });

            toast.success(`Invite sent to ${email.trim()}`);
            onInviteSent?.({ userId, gptAccount: team.gptAccount, memberEmail: email.trim(), server: team.server });
            handleClose();
        } catch (err) {
            console.error('Error sending invite:', err);
            setError('Failed to send invite. Please try again.');
            toast.error('Failed to send invite');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isSending) {
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] max-w-md w-full mx-4 overflow-hidden animate-scale-in">
                {/* Modal Header */}
                <div className="p-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--accent-purple)]/20 rounded-xl flex items-center justify-center">
                                <FaPaperPlane className="text-[var(--accent-purple)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Invite Member</h3>
                                <p className="text-[var(--text-tertiary)] text-sm">{team?.gptAccount}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                        >
                            <FaTimes className="text-[var(--text-tertiary)]" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Socket Status */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--error)]'}`}></div>
                        <span className={`text-sm font-medium ${isConnected ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-white mb-2">
                            Member Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] text-white placeholder-[var(--text-muted)] transition-all duration-200"
                            autoFocus
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-xl">
                            <p className="text-sm text-[var(--error)] font-medium">{error}</p>
                        </div>
                    )}

                    {/* Info */}
                    <p className="text-sm text-[var(--text-tertiary)]">
                        An invitation will be sent via real-time socket connection.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <button
                        onClick={handleClose}
                        disabled={isSending}
                        className="px-5 py-2.5 text-sm font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSending || !email.trim() || !isConnected}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="text-sm" />
                                Send Invite
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;
