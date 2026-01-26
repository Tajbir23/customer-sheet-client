import React, { useState } from 'react';

import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

/**
 * Remove Member Modal Component
 * Sends remove request via Socket.IO with single email
 */
const RemoveMemberModal = ({
    isOpen,
    onClose,
    team,
    onRemoveSent
}) => {
    const [email, setEmail] = useState('');
    const [isRemoving, setIsRemoving] = useState(false);
    const [error, setError] = useState('');
    const { emit, isConnected } = useSocket();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setIsRemoving(false);
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

        setIsRemoving(true);

        try {
            emit('remove-member', {
                gptAccount: team.gptAccount,
                email: email.trim(),
                server: team.server
            });

            toast.success(`Remove request sent for ${email.trim()}`);
            onRemoveSent?.({ gptAccount: team.gptAccount, email: email.trim(), server: team.server });
            handleClose();
        } catch (err) {
            console.error('Error sending remove request:', err);
            setError('Failed to send remove request. Please try again.');
            toast.error('Failed to send remove request');
        } finally {
            setIsRemoving(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isRemoving) {
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] max-w-md w-full mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--error)]/20 rounded-xl flex items-center justify-center">
                                <span className="text-[var(--error)] font-bold text-lg">-</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Remove Member</h3>
                                <p className="text-[var(--text-tertiary)] text-sm">{team?.gptAccount}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                        >
                            <span className="text-[var(--text-tertiary)] font-bold">X</span>
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
                            Member Email to Remove
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter email address to remove"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--error)] focus:ring-1 focus:ring-[var(--error)] text-white placeholder-[var(--text-muted)] transition-all duration-200"
                            autoFocus
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-xl">
                            <p className="text-sm text-[var(--error)] font-medium">{error}</p>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl mb-4">
                        <p className="text-sm text-[var(--warning)] font-medium">
                            ⚠️ This action will send a request to remove the member from the team.
                        </p>
                    </div>

                    {/* Info */}
                    <p className="text-sm text-[var(--text-tertiary)]">
                        The removal request will be sent via real-time socket connection.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <button
                        onClick={handleClose}
                        disabled={isRemoving}
                        className="px-5 py-2.5 text-sm font-bold text-[var(--text-secondary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isRemoving || !email.trim() || !isConnected}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--error)] hover:bg-[var(--error)]/90 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isRemoving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-bold">🗑</span>
                                Remove Member
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveMemberModal;
