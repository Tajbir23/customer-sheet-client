import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTimes } from 'react-icons/fa';
import handleApi from '../libs/handleAPi';
import useAddMember, { validateAndParseEmails } from '../libs/useAddMember';

/**
 * Reusable Add Member Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.team - Team object containing _id and gptAccount
 * @param {Function} props.onMembersAdded - Callback when members are successfully added (receives response, { teamId, emailArray, reference })
 * @param {string} props.title - Optional custom title
 * @param {string} props.buttonText - Optional custom button text
 */
const AddMemberModal = ({
    isOpen,
    onClose,
    team,
    onMembersAdded,
    title = 'Add Team Members',
    buttonText = 'Add Members'
}) => {
    const [emailsText, setEmailsText] = useState('');
    const [references, setReferences] = useState([]);
    const [selectedReference, setSelectedReference] = useState('');

    const { addMembersFromText, isAdding, emailErrors, clearErrors } = useAddMember({
        onSuccess: (response, data) => {
            onMembersAdded?.(response, data);
            handleClose();
        }
    });

    useEffect(() => {
        const fetchReferences = async () => {
            const response = await handleApi('/references');
            setReferences(response.data || []);
        };
        if (isOpen) {
            fetchReferences();
        }
    }, [isOpen]);

    const handleClose = () => {
        setEmailsText('');
        setSelectedReference('');
        clearErrors();
        onClose();
    };

    const handleSubmit = async () => {
        await addMembersFromText(team._id, emailsText, selectedReference);
    };

    if (!isOpen) return null;

    const previewEmails = validateAndParseEmails(emailsText).validEmails;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                                <FaUserPlus className="text-2xl text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                                <p className="text-white/80 font-medium">To {team?.gptAccount}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-200 backdrop-blur-sm"
                        >
                            <FaTimes className="text-xl text-white" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {/* Reference Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                            Select Reference (Optional)
                        </label>
                        <select
                            name="reference"
                            id="reference"
                            value={selectedReference}
                            onChange={(e) => setSelectedReference(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium transition-all duration-200"
                        >
                            <option value="">Select Reference</option>
                            {references.map((reference) => (
                                <option key={reference._id} value={reference._id}>{reference.username}</option>
                            ))}
                        </select>
                    </div>

                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                            Member Email Addresses
                        </label>
                        <textarea
                            value={emailsText}
                            onChange={(e) => setEmailsText(e.target.value)}
                            placeholder="Enter email addresses (one per line or separated by commas):&#10;&#10;john@example.com&#10;jane@example.com&#10;admin@company.com"
                            className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none font-medium transition-all duration-200"
                            rows={8}
                        />
                        <p className="text-sm text-gray-600 mt-3 font-medium">
                            You can enter multiple emails separated by commas, semicolons, spaces, or on separate lines.
                        </p>
                    </div>

                    {/* Email Preview */}
                    {emailsText.trim() && (
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">
                                Email Preview ({previewEmails.length} valid emails)
                            </h4>
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                                <div className="flex flex-wrap gap-2">
                                    {previewEmails.map((email, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                                        >
                                            {email}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Errors */}
                    {emailErrors.length > 0 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl">
                            <h4 className="text-sm font-bold text-red-800 mb-3">
                                Please fix the following errors:
                            </h4>
                            <ul className="text-sm text-red-700 space-y-2">
                                {emailErrors.map((error, index) => (
                                    <li key={index} className="flex items-start gap-2 font-medium">
                                        <span className="text-red-500 mt-0.5 font-bold">•</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        disabled={isAdding}
                        className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isAdding || !emailsText.trim() || previewEmails.length === 0}
                        className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[180px] justify-center shadow-lg shadow-green-500/25"
                    >
                        {isAdding ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Adding Members...
                            </>
                        ) : (
                            <>
                                <FaUserPlus className="text-sm" />
                                {buttonText} ({previewEmails.length})
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
