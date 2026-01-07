import React, { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";
import { FaUserFriends, FaEnvelope, FaChevronUp, FaChevronDown, FaPlus, FaTimes, FaUserPlus, FaServer, FaCopy, FaCheck, FaPaperPlane } from "react-icons/fa";
import Member from "./Member";
import RdpInfo from "./RdpInfo";
import handleApi from "../../../libs/handleAPi";
import InviteMemberModal from "../../../components/InviteMemberModal";

const TeamCard = ({ team, onToggleActive, isToggling, onRemoveMember, onAddMembers, justToggled, recentlyAddedMembers = [], userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRdp, setShowRdp] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [emailsText, setEmailsText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState('');
  const [copied, setCopied] = useState(false);
  const [cookieCopied, setCookieCopied] = useState(false);
  const [cookieLoading, setCookieLoading] = useState(false);
  const [openOnList, setOpenOnList] = useState(team.openOn || []);

  useEffect(() => {
    const fetchReferences = async () => {
      const response = await handleApi('/references')
      setReferences(response.data)
    }
    fetchReferences()
  }, [])

  useEffect(() => {
    let timeoutId
    if (copied) {
      timeoutId = setTimeout(() => setCopied(false), 2000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [copied])

  useEffect(() => {
    let timeoutId
    if (cookieCopied) {
      timeoutId = setTimeout(() => setCookieCopied(false), 2000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [cookieCopied])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(team.gptAccount)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const handleCopyCookie = async () => {
    try {
      setCookieLoading(true);
      const response = await handleApi(`/gptTeam/cookies?gptAccount=${team.gptAccount}`, 'GET');
      if (response.success && response.data) {
        const cookiesJson = JSON.stringify(response.data, null, 2);
        await navigator.clipboard.writeText(cookiesJson);
        setCookieCopied(true);
      } else {
        console.error('Failed to fetch cookies:', response.message);
      }
    } catch (err) {
      console.error('Failed to copy cookies:', err);
    } finally {
      setCookieLoading(false);
    }
  }

  const handleRemoveMember = async (teamId, member, memberIndex) => {
    if (onRemoveMember) {
      await onRemoveMember(teamId, member, memberIndex);
    }
  };

  const handleAddMemberClick = () => {
    setShowAddModal(true);
    setEmailsText('');
    setEmailErrors([]);
    setSelectedReference('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEmailsText('');
    setEmailErrors([]);
    setSelectedReference('');
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
        await onAddMembers(team._id, validEmails, selectedReference);
        handleCloseAddModal();
      }
    } catch (error) {
      console.error('Error adding members:', error);
      setEmailErrors(['Failed to add members. Please try again.']);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle RDP open/close actions
  const handleRdpOpen = (hostname) => {
    console.log('handleRdpOpen called with:', hostname)
    console.log('Current openOnList:', openOnList)
    if (!openOnList.includes(hostname)) {
      const newList = [...openOnList, hostname]
      console.log('Adding to list, new list:', newList)
      setOpenOnList(newList);
    } else {
      console.log('Hostname already in list')
    }
  };

  const handleRdpClose = (hostname) => {
    console.log('handleRdpClose called with:', hostname)
    console.log('Current openOnList:', openOnList)
    const newList = openOnList.filter(item => item !== hostname)
    console.log('After filtering, new list:', newList)
    setOpenOnList(newList);
  };

  return (
    <>
      <div className="group relative">
        {/* Main Card */}
        <div className={`
            relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
            ${team.isActive
            ? 'bg-white shadow-xl border border-gray-100'
            : 'bg-gradient-to-br from-red-50 to-red-100 shadow-lg border border-red-200'
          }
          `}>

          {/* Header Section */}
          <div className={`
              relative p-8 overflow-hidden
              ${team.isActive
              ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700'
              : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'
            }
            `}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className="relative z-10">
              {/* Status Row */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${team.isActive ? 'bg-green-400' : 'bg-red-300'} ${justToggled ? 'animate-ping' : 'animate-pulse'}`} />
                  <span className={`text-white/90 text-sm font-semibold transition-all duration-300 ${justToggled ? 'scale-110' : ''}`}>
                    {team.isActive ? 'Active Team' : 'Inactive Team'}
                  </span>
                  {/* Status change indicator */}
                  {justToggled && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-white/30 text-white animate-pulse">
                      ✓ Updated!
                    </span>
                  )}
                </div>
                <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-2 transition-all duration-300 ${justToggled ? 'ring-4 ring-white/50 scale-110' : ''}`}>
                  <ToggleButton
                    isActive={team.isActive}
                    isLoading={isToggling === team._id}
                    onClick={() => onToggleActive(team._id, !team.isActive)}
                    justChanged={justToggled}
                  />
                </div>
              </div>

              {/* Open On Badges */}
              {openOnList && openOnList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 my-3">
                  {openOnList.map((openOn, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 bg-white text-gray-900 rounded-lg px-4 py-2 shadow-lg border-2 border-white/50 hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-sm font-bold">
                        {openOn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Account Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white truncate">
                        {team.gptAccount}
                      </h3>
                      <button
                        onClick={handleCopyEmail}
                        className="flex-shrink-0 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm group/copy"
                        title="Copy email"
                      >
                        {copied ? (
                          <FaCheck className="text-green-300 text-sm" />
                        ) : (
                          <FaCopy className="text-white text-sm group-hover/copy:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>
                    <p className="text-white/80 text-sm font-medium">GPT Account</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/70 ml-16">
                  <FaServer className="text-sm" />
                  <span className="text-sm font-medium capitalize">{team.server}</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaUserFriends className="text-white text-lg" />
                    <div>
                      <div className="text-2xl font-bold text-white">{team.members.length}</div>
                      <div className="text-white/80 text-xs font-medium">Members</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-1.5 bg-purple-500/80 hover:bg-purple-600 backdrop-blur-sm rounded-xl px-3 py-2 transition-all duration-200 text-white font-medium shadow-lg shadow-purple-500/25"
                    title="Invite Member"
                  >
                    <FaPaperPlane className="text-xs" />
                    <span className="text-xs">Invite</span>
                  </button>

                  <button
                    onClick={handleCopyCookie}
                    disabled={cookieLoading}
                    className={`flex items-center gap-1.5 backdrop-blur-sm rounded-xl px-3 py-2 transition-all duration-200 font-medium ${cookieCopied
                      ? 'bg-green-500 text-white'
                      : cookieLoading
                        ? 'bg-white/30 text-white cursor-wait'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    title="Copy cookies"
                  >
                    {cookieLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading...</span>
                      </>
                    ) : cookieCopied ? (
                      <>
                        <FaCheck className="text-xs" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy className="text-xs" />
                        <span className="text-xs">Cookie</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowRdp(!showRdp)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3 py-2 transition-all duration-200 text-white font-medium"
                  >
                    <FaServer className="text-xs" />
                    <span className="text-xs">RDP</span>
                    {showRdp ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3 py-2 transition-all duration-200 text-white font-medium"
                  >
                    <FaUserFriends className="text-xs" />
                    <span className="text-xs">Members</span>
                    {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RDP Section */}
          {showRdp && (
            <div className="p-8 border-t-2 border-gray-200">
              <RdpInfo team={team} onRdpOpen={handleRdpOpen} onRdpClose={handleRdpClose} />
            </div>
          )}

          {/* Members Section */}
          {isExpanded && (
            <div className="p-8 border-t-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">Team Members</h4>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${team.isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                  </div>
                  <button
                    onClick={handleAddMemberClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${team.isActive
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                      }`}
                  >
                    <FaPlus className="text-xs" />
                    Add Members
                  </button>
                </div>
              </div>

              {/* Members List */}
              {team.members.length > 0 ? (
                <div className="grid gap-4">
                  {team.members.map((member, index) => {
                    const isNewlyAdded = recentlyAddedMembers.includes(member);
                    return (
                      <div
                        key={`${team._id}-${index}-${member}`}
                        className={`transform transition-all duration-500 ${isNewlyAdded ? 'animate-pulse ring-2 ring-green-400 ring-offset-2 rounded-xl scale-105' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Newly added indicator */}
                        {isNewlyAdded && (
                          <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white animate-bounce">
                              ✓ New! Just Added
                            </span>
                          </div>
                        )}
                        <Member
                          index={index}
                          team={team}
                          member={member}
                          onRemoveMember={handleRemoveMember}
                          isNewlyAdded={isNewlyAdded}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-3xl p-8 max-w-sm mx-auto">
                    <FaUserFriends className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Team Members</h4>
                    <p className="text-gray-600 mb-6">Get started by adding your first team member</p>
                    <button
                      onClick={handleAddMemberClick}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 mx-auto ${team.isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25'
                        }`}
                    >
                      <FaUserPlus className="text-sm" />
                      Add First Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl ${team.isActive
          ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20'
          : 'bg-gradient-to-br from-red-400/20 to-red-600/20'
          }`}></div>
      </div>

      {/* Add Members Modal */}
      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        team={team}
        userId={userId}
        onInviteSent={(data) => console.log('Invite sent:', data)}
      />

      {showAddModal && (
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
                    <h3 className="text-2xl font-bold text-white mb-1">Add Team Members</h3>
                    <p className="text-white/80 font-medium">To {team.gptAccount}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAddModal}
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
                    Email Preview ({validateAndParseEmails(emailsText).validEmails.length} valid emails)
                  </h4>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex flex-wrap gap-2">
                      {validateAndParseEmails(emailsText).validEmails.map((email, index) => (
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
                onClick={handleCloseAddModal}
                disabled={isAdding}
                className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                disabled={isAdding || !emailsText.trim() || validateAndParseEmails(emailsText).validEmails.length === 0}
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