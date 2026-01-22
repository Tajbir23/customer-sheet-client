import React, { useState } from 'react';
import { FaUserMinus, FaTimes, FaTrash } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

/**
 * Remove Member Modal Component
 * Sends remove request via Socket.IO with single email
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.team - Team object containing gptAccount and server
 * @param {Function} props.onRemoveSent - Optional callback when remove request is sent
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

        // Validate email
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
            // Emit remove-member event via Socket.IO
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-10 -translate-x-10"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <FaUserMinus className="text-xl text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-0.5">Remove Member</h3>
                                <p className="text-white/80 text-sm font-medium">{team?.gptAccount}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
                        >
                            <FaTimes className="text-lg text-white" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Socket Status */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 font-medium transition-all duration-200"
                            autoFocus
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl mb-4">
                        <p className="text-sm text-orange-700 font-medium">
                            ⚠️ This action will send a request to remove the member from the team.
                        </p>
                    </div>

                    {/* Info */}
                    <p className="text-sm text-gray-500">
                        The removal request will be sent via real-time socket connection.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        disabled={isRemoving}
                        className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isRemoving || !email.trim() || !isConnected}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-500/25"
                    >
                        {isRemoving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <FaTrash className="text-sm" />
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
