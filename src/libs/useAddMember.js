import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import handleApi from './handleAPi';

/**
 * Validate and parse email addresses from text input
 * Supports multiple formats: comma-separated, semicolon-separated, space-separated, or newline-separated
 */
export const validateAndParseEmails = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const validEmails = [];
    const errors = [];

    lines.forEach((line, index) => {
        // Split by comma, semicolon, or space and clean up
        const emails = line.split(/[,;\s]+/).map(email => email.trim()).filter(email => email.length > 0);

        emails.forEach(email => {
            if (emailRegex.test(email)) {
                if (!validEmails.includes(email)) {
                    validEmails.push(email);
                }
            } else if (email.length > 0) {
                errors.push(`Line ${index + 1}: "${email}" is not a valid email`);
            }
        });
    });

    return { validEmails, errors };
};

/**
 * Custom hook for adding members to a team
 * @param {Object} options - Hook options
 * @param {Function} options.onSuccess - Callback function called on successful member addition
 * @param {Function} options.onError - Callback function called on error
 * @returns {Object} - Hook state and methods
 */
const useAddMember = ({ onSuccess, onError } = {}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [emailErrors, setEmailErrors] = useState([]);

    /**
     * Add members to a team
     * @param {string} teamId - The ID of the team to add members to
     * @param {string[]} emailArray - Array of email addresses to add
     * @param {string} reference - Optional reference ID
     * @returns {Promise<Object>} - API response
     */
    const addMembers = useCallback(async (teamId, emailArray, reference) => {
        setIsAdding(true);
        setEmailErrors([]);

        try {
            const response = await handleApi(
                `/gptTeam/team/${teamId}/members`,
                'POST',
                { members: emailArray, reference }
            );

            if (response.success) {
                const addedCount = emailArray.length;
                toast.success(
                    `${addedCount} member${addedCount === 1 ? '' : 's'} added successfully`
                );
                onSuccess?.(response, { teamId, emailArray, reference });
                return response;
            } else {
                const errorMessage = response.message || 'Failed to add members';
                setEmailErrors([errorMessage]);
                toast.error(errorMessage);
                onError?.(new Error(errorMessage));
                throw new Error(errorMessage);
            }
        } catch (err) {
            const errorMessage = 'An error occurred while adding members';
            setEmailErrors([errorMessage]);
            toast.error(errorMessage);
            console.error('Error adding members:', err);
            onError?.(err);
            throw err;
        } finally {
            setIsAdding(false);
        }
    }, [onSuccess, onError]);

    /**
     * Validate and add members from text input
     * @param {string} teamId - The ID of the team
     * @param {string} emailsText - Raw text containing email addresses
     * @param {string} reference - Optional reference ID
     * @returns {Promise<Object|null>} - API response or null if validation fails
     */
    const addMembersFromText = useCallback(async (teamId, emailsText, reference) => {
        const { validEmails, errors } = validateAndParseEmails(emailsText);

        if (errors.length > 0) {
            setEmailErrors(errors);
            return null;
        }

        if (validEmails.length === 0) {
            setEmailErrors(['Please enter at least one valid email address']);
            return null;
        }

        return addMembers(teamId, validEmails, reference);
    }, [addMembers]);

    const clearErrors = useCallback(() => {
        setEmailErrors([]);
    }, []);

    return {
        addMembers,
        addMembersFromText,
        validateAndParseEmails,
        isAdding,
        emailErrors,
        setEmailErrors,
        clearErrors
    };
};

export default useAddMember;
