import React, { useState } from "react";
import ToggleButton from "./ToggleButton";
import { FaUserFriends, FaEnvelope, FaChevronUp, FaChevronDown, FaPlus, FaTimes, FaUserPlus } from "react-icons/fa";
import Member from "./Member";

const TeamCard = ({ team, onToggleActive, isToggling, onRemoveMember, onAddMembers }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [emailsText, setEmailsText] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [emailErrors, setEmailErrors] = useState([]);
  
    const handleRemoveMember = async (teamId, member, memberIndex) => {
        if (onRemoveMember) {
            await onRemoveMember(teamId, member, memberIndex);
        }
    };

    const handleAddMemberClick = () => {
        setShowAddModal(true);
        setEmailsText('');
        setEmailErrors([]);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setEmailsText('');
        setEmailErrors([]);
    };

    // Validate and parse emails
    const validateAndParseEmails = (text) => {
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

    const handleAddMembers = async () => {
        const { validEmails, errors } = validateAndParseEmails(emailsText);
        
        if (errors.length > 0) {
            setEmailErrors(errors);
            return;
        }

        if (validEmails.length === 0) {
            setEmailErrors(['Please enter at least one valid email address']);
            return;
        }

        setIsAdding(true);
        setEmailErrors([]);

        try {
            if (onAddMembers) {
                await onAddMembers(team._id, validEmails);
                handleCloseAddModal();
            }
        } catch (error) {
            console.error('Error adding members:', error);
            setEmailErrors(['Failed to add members. Please try again.']);
        } finally {
            setIsAdding(false);
        }
    };

    return (
      <>
        <div 
          className={`
            rounded-xl overflow-hidden border transition-all duration-200 hover:shadow-lg h-full flex flex-col
            ${team.isActive 
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
            }
          `}
        >
          {/* Main Content */}
          <div className="p-4 sm:p-6 flex-grow">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${team.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${
                  team.isActive 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {team.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <ToggleButton
                isActive={team.isActive}
                isLoading={isToggling === team._id}
                onClick={() => onToggleActive(team._id, !team.isActive)}
              />
            </div>
    
            {/* Account Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FaEnvelope className={`flex-shrink-0 ${
                  team.isActive 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-red-500 dark:text-red-400'
                }`} />
                <h3 className={`text-lg font-semibold break-all ${
                  team.isActive 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  {team.gptAccount}
                </h3>
              </div>
              <div className={`ml-7 text-sm capitalize ${
                team.isActive 
                  ? 'text-gray-500 dark:text-gray-400' 
                  : 'text-red-600/70 dark:text-red-400/70'
              }`}>
                {team.server}
              </div>
            </div>
    
            {/* Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserFriends className={
                  team.isActive 
                    ? 'text-gray-400' 
                    : 'text-red-400 dark:text-red-500'
                } />
                <span className={`text-sm font-medium ${
                  team.isActive 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {team.members.length} members
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  flex items-center gap-2 text-sm font-medium transition-colors
                  ${team.isActive 
                    ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' 
                    : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                  }
                  focus:outline-none
                `}
              >
                {isExpanded ? (
                  <>
                    Hide Members
                    <FaChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show Members
                    <FaChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
    
          {/* Members List */}
          {isExpanded && (
            <div className={`border-t ${
              team.isActive 
                ? 'border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800' 
                : 'border-red-200 dark:border-red-800/30 bg-gradient-to-b from-red-50/50 to-red-25 dark:from-red-900/30 dark:to-red-900/20'
            }`}>
              <div className="p-4 sm:p-6">
                {/* Members Header with Add Button */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`text-sm font-semibold ${
                    team.isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    Team Members ({team.members.length})
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    {/* Member Count Badge */}
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${team.isActive 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }
                    `}>
                      {team.members.length === 1 ? '1 member' : `${team.members.length} members`}
                    </span>

                    {/* Add Member Button */}
                    <button
                      onClick={handleAddMemberClick}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105
                        ${team.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                        }
                        focus:outline-none focus:ring-2 focus:ring-green-500/20
                      `}
                      title="Add new members"
                    >
                      <FaPlus className="w-3 h-3" />
                      Add Members
                    </button>
                  </div>
                </div>

                {/* Members Grid */}
                {team.members.length > 0 ? (
                  <div className="space-y-3">
                    {team.members.map((member, index) => (
                      <Member 
                        key={`${team._id}-${index}-${member}`}
                        index={index}
                        team={team}
                        member={member}
                        onRemoveMember={handleRemoveMember}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${
                    team.isActive 
                      ? 'text-gray-500 dark:text-gray-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <FaUserFriends className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm mb-3">No members in this team</p>
                    <button
                      onClick={handleAddMemberClick}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105
                        ${team.isActive 
                          ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                          : 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                        }
                        focus:outline-none focus:ring-2 focus:ring-green-500/20
                      `}
                    >
                      <FaUserPlus className="w-4 h-4" />
                      Add First Member
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Members Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FaUserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add Members
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      To {team.gptAccount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAddModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Member Email Addresses
                  </label>
                  <textarea
                    value={emailsText}
                    onChange={(e) => setEmailsText(e.target.value)}
                    placeholder="Enter email addresses (one per line or separated by commas):&#10;&#10;john@example.com&#10;jane@example.com&#10;admin@company.com"
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    You can enter multiple emails separated by commas, semicolons, spaces, or on separate lines.
                  </p>
                </div>

                {/* Email Preview */}
                {emailsText.trim() && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Preview ({validateAndParseEmails(emailsText).validEmails.length} valid emails)
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 max-h-24 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {validateAndParseEmails(emailsText).validEmails.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {emailErrors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={handleCloseAddModal}
                  disabled={isAdding}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMembers}
                  disabled={isAdding || !emailsText.trim() || validateAndParseEmails(emailsText).validEmails.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding Members...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="w-3 h-3" />
                      Add {validateAndParseEmails(emailsText).validEmails.length} Members
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  export default TeamCard