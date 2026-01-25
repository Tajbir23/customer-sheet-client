import React, { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";

import Member from "./Member";
import RdpInfo from "./RdpInfo";
import handleApi from "../../../libs/handleAPi";
import InviteMemberModal from "../../../components/InviteMemberModal";
import RemoveMemberModal from "../../../components/RemoveMemberModal";
import {
  FaCopy,
  FaUserPlus,
  FaUserMinus,
  FaDesktop,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaCookie,
  FaUser,
  FaServer,
  FaPlus,
  FaTimes
} from "react-icons/fa";

const TeamCard = ({ team, onToggleActive, isToggling, onRemoveMember, onAddMembers, justToggled, recentlyAddedMembers = [], userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRdp, setShowRdp] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [emailsText, setEmailsText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [emailErrors, setEmailErrors] = useState([]);
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState('');
  const [copied, setCopied] = useState(false);
  const [cookieCopied, setCookieCopied] = useState(false);
  const [cookieLoading, setCookieLoading] = useState(false);
  const [openOnList, setOpenOnList] = useState(team.openOn || []);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [copiedAllMemberEmail, setCopiedAllMemberEmail] = useState(null);
  const [showMemberActions, setShowMemberActions] = useState(false);

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

  useEffect(() => {
    let timeoutId
    if (copiedAllMemberEmail !== null) {
      timeoutId = setTimeout(() => setCopiedAllMemberEmail(null), 2000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [copiedAllMemberEmail])

  const handleCopyAllMemberEmail = async (email, index) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedAllMemberEmail(index)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  // Helper to close other toggles when one is opened
  const closeOtherToggles = (except) => {
    if (except !== 'rdp') setShowRdp(false);
    if (except !== 'members') setIsExpanded(false);
    if (except !== 'allMembers') setShowAllMembers(false);
    if (except !== 'actions') setShowMemberActions(false);
  };

  const handleToggleRdp = () => {
    const newState = !showRdp;
    if (newState) closeOtherToggles('rdp');
    setShowRdp(newState);
  };

  const handleToggleMembers = () => {
    const newState = !isExpanded;
    if (newState) closeOtherToggles('members');
    setIsExpanded(newState);
  };

  const handleToggleAllMembers = () => {
    const newState = !showAllMembers;
    if (newState) closeOtherToggles('allMembers');
    setShowAllMembers(newState);
  };

  const handleToggleMemberActions = () => {
    const newState = !showMemberActions;
    if (newState) closeOtherToggles('actions');
    setShowMemberActions(newState);
  };

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
    if (!openOnList.includes(hostname)) {
      const newList = [...openOnList, hostname]
      setOpenOnList(newList);
    }
  };

  const handleRdpClose = (hostname) => {
    const newList = openOnList.filter(item => item !== hostname)
    setOpenOnList(newList);
  };

  return (
    <>
      <div className="group relative">
        {/* Main Card */}
        <div className={`
            relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
            ${team.isActive
            ? 'glass-card border-[var(--border-subtle)]'
            : 'bg-[var(--bg-elevated)] opacity-90 border-[var(--error)]/30'
          }
          `}>

          {/* Header Section */}
          <div className={`
              relative p-8 overflow-hidden
              ${team.isActive
              ? 'bg-gradient-to-br from-[var(--bg-hover)] to-[var(--bg-card)]'
              : 'bg-gradient-to-br from-[var(--error-bg)] to-transparent'
            }
            `}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className="relative z-10">
              {/* Status Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${team.isActive ? 'bg-[var(--success)] shadow-[0_0_8px_var(--success)]' : 'bg-[var(--error)] shadow-[0_0_8px_var(--error)]'}`} />
                  <span className={`text-white text-sm font-bold tracking-wide transition-all duration-300 ${justToggled ? 'scale-110' : ''}`}>
                    {team.isActive ? 'ACTIVE TEAM' : 'INACTIVE TEAM'}
                  </span>
                  {/* Status change indicator */}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[var(--success-bg)] text-[var(--success-light)]">
                    <FaCheck className="mr-1" /> Updated!
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Simple Member Count Badge */}
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/5">
                    <span className="text-white text-sm font-bold">{team.members.length} Members</span>
                  </div>
                  <div className={`transition-all duration-300 ${justToggled ? 'scale-110' : ''}`}>
                    <ToggleButton
                      isActive={team.isActive}
                      isLoading={isToggling === team._id}
                      onClick={() => onToggleActive(team._id, !team.isActive)}
                      justChanged={justToggled}
                    />
                  </div>
                </div>
              </div>

              {/* Open On Badges */}
              {openOnList && openOnList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 my-3">
                  {openOnList.map((openOn, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-lg px-3 py-1.5 shadow-md border border-[var(--border-subtle)] hover:border-[var(--success)] transition-all duration-200 hover:scale-105"
                    >
                      <span className="text-xs font-bold font-mono tracking-wide">
                        {openOn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Account Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white truncate group-hover:text-[var(--accent-blue-light)] transition-colors">
                        {team.gptAccount}
                      </h3>
                      <button
                        onClick={handleCopyEmail}
                        className="flex-shrink-0 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group/copy"
                        title="Copy email"
                      >
                        {copied ? (
                          <FaCheck className="text-[var(--success)] text-sm" />
                        ) : (
                          <FaCopy className="text-[var(--text-tertiary)] text-sm group-hover/copy:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">GPT Account</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                  <span className="text-sm font-medium capitalize flex items-center gap-1">
                    <FaServer className="w-3 h-3" /> Server: {team.server}
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Member Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleToggleMemberActions}
                    className="bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-dark)] text-white rounded-xl px-3 py-2 transition-all duration-200 font-medium shadow-lg shadow-purple-900/20 flex items-center gap-2"
                  >
                    <span className="text-xs">Actions</span>
                    {showMemberActions ? <FaChevronUp className="w-2.5 h-2.5" /> : <FaChevronDown className="w-2.5 h-2.5" />}
                  </button>
                  {showMemberActions && (
                    <div className="absolute bottom-full left-0 mb-2 rounded-xl shadow-2xl border border-[var(--border-subtle)] py-2 z-[100] min-w-[150px] overflow-hidden"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <button
                        onClick={() => { setShowInviteModal(true); setShowMemberActions(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white transition-colors flex items-center gap-2"
                      >
                        <FaUserPlus className="w-3 h-3" /> Invite Member
                      </button>
                      <button
                        onClick={() => { setShowRemoveModal(true); setShowMemberActions(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--error-light)] transition-colors flex items-center gap-2"
                      >
                        <FaUserMinus className="w-3 h-3" /> Remove Member
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCopyCookie}
                  disabled={cookieLoading}
                  className={`flex items-center gap-1.5 border border-[var(--border-subtle)] rounded-xl px-3 py-2 transition-all duration-200 font-medium ${cookieCopied
                    ? 'bg-[var(--success-bg)] text-[var(--success-light)] border-[var(--success)]'
                    : cookieLoading
                      ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-wait'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]'
                    }`}
                  title="Copy cookies"
                >
                  {cookieLoading ? (
                    <span className="text-xs">Loading...</span>
                  ) : cookieCopied ? (
                    <>
                      <FaCheck className="w-3 h-3" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCookie className="w-3 h-3" />
                      <span className="text-xs">Cookie</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleRdp}
                  className="bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 transition-all duration-200 text-[var(--text-secondary)] font-medium flex items-center gap-2"
                >
                  <span className="text-xs flex items-center gap-1"><FaDesktop className="w-3 h-3" /> RDP</span>
                  {showRdp ? <FaChevronUp className="w-2.5 h-2.5" /> : <FaChevronDown className="w-2.5 h-2.5" />}
                </button>

                <button
                  onClick={handleToggleMembers}
                  className="bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 transition-all duration-200 text-[var(--text-secondary)] font-medium flex items-center gap-2"
                >
                  <span className="text-xs flex items-center gap-1"><FaUsers className="w-3 h-3" /> Members</span>
                  {isExpanded ? <FaChevronUp className="w-2.5 h-2.5" /> : <FaChevronDown className="w-2.5 h-2.5" />}
                </button>

                {team.allMembers && team.allMembers.length > 0 && (
                  <button
                    onClick={handleToggleAllMembers}
                    className="bg-[var(--warning-bg)] hover:bg-[var(--warning)]/20 border border-[var(--warning)]/30 text-[var(--warning-light)] backdrop-blur-sm rounded-xl px-3 py-2 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <span className="text-xs flex items-center gap-1"><FaUsers className="w-3 h-3" /> All Members ({team.allMembers.length})</span>
                    {showAllMembers ? <FaChevronUp className="w-2.5 h-2.5" /> : <FaChevronDown className="w-2.5 h-2.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RDP Section */}
          {showRdp && (
            <div className="p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <RdpInfo team={team} onRdpOpen={handleRdpOpen} onRdpClose={handleRdpClose} />
            </div>
          )}

          {/* All Members Section */}
          {showAllMembers && team.allMembers && team.allMembers.length > 0 && (
            <div className="p-8 border-t border-[var(--border-subtle)]" style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaUsers className="w-5 h-5 text-[var(--warning-light)]" />
                  All Members
                </h4>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--warning-bg)] text-[var(--warning-light)]">
                  {team.allMembers.length} {team.allMembers.length === 1 ? 'member' : 'members'}
                </div>
              </div>

              {/* All Members List */}
              <div className="grid gap-3">
                {team.allMembers.map((member, index) => (
                  <div
                    key={`all-member-${team._id}-${index}`}
                    className="flex items-center justify-between rounded-xl p-4 shadow-sm border border-[var(--border-subtle)] hover:border-[var(--warning)]/50 transition-all duration-200"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--warning)] to-[var(--warning-light)] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member}</p>
                        <p className="text-[var(--text-tertiary)] text-sm flex items-center gap-1">
                          <FaUser className="w-3 h-3" /> Team Member
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyAllMemberEmail(member, index)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copiedAllMemberEmail === index
                        ? 'bg-[var(--success)] text-white'
                        : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                        }`}
                      title="Copy email"
                    >
                      {copiedAllMemberEmail === index ? (
                        <>
                          <FaCheck className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {isExpanded && (
            <div className="p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Team Members</h4>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${team.isActive
                    ? 'bg-[var(--info-bg)] text-[var(--accent-blue-light)]'
                    : 'bg-[var(--error-bg)] text-[var(--error-light)]'
                    }`}>
                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                  </div>
                  <button
                    onClick={handleAddMemberClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${team.isActive
                      ? 'bg-[var(--success)] hover:bg-[var(--success-light)] text-white'
                      : 'bg-[var(--error)] hover:bg-[var(--error-light)] text-white'
                      }`}
                  >
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
                        className={`transform transition-all duration-500 ${isNewlyAdded ? 'ring-2 ring-[var(--success)] ring-offset-2 ring-offset-[var(--bg-deepest)] rounded-xl scale-105' : ''}`}
                      >
                        {/* Newly added indicator */}
                        {isNewlyAdded && (
                          <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--success)] text-white">
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
                  <div className="bg-[var(--bg-surface)] rounded-3xl p-8 max-w-sm mx-auto border border-[var(--border-subtle)] border-dashed">
                    <h4 className="text-lg font-semibold text-white mb-2">No Team Members</h4>
                    <button
                      onClick={handleAddMemberClick}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 mx-auto ${team.isActive
                        ? 'bg-gradient-to-r from-[var(--success)] to-[var(--success-light)] text-white shadow-lg shadow-green-900/20'
                        : 'bg-gradient-to-r from-[var(--error)] to-[var(--error-light)] text-white shadow-lg shadow-red-900/20'
                        }`}
                    >
                      Add First Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}

      </div >

      {/* Add Members Modal */}
      < InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        team={team}
        userId={userId}
        onInviteSent={(data) => console.log('Invite sent:', data)}
      />

      < RemoveMemberModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        team={team}
        onRemoveSent={(data) => console.log('Remove request sent:', data)}
      />

      {
        showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              {/* Modal Header */}
              <div className="p-8 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)' }}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      <span className="text-2xl text-white">+</span>
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
                    <span className="text-xl text-white">X</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Reference Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
                    Select Reference (Optional)
                  </label>
                  <select
                    name="reference"
                    id="reference"
                    value={selectedReference}
                    onChange={(e) => setSelectedReference(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] transition-all duration-200"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select Reference</option>
                    {references.map((reference) => (
                      <option key={reference._id} value={reference._id}>{reference.username}</option>
                    ))}
                  </select>
                </div>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
                    Member Email Addresses
                  </label>
                  <textarea
                    value={emailsText}
                    onChange={(e) => setEmailsText(e.target.value)}
                    placeholder="Enter email addresses (one per line or separated by commas):&#10;&#10;john@example.com&#10;jane@example.com&#10;admin@company.com"
                    className="w-full h-40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] resize-none font-medium transition-all duration-200"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                    rows={8}
                  />
                  <p className="text-sm mt-3 font-medium text-[var(--text-tertiary)]">
                    You can enter multiple emails separated by commas, semicolons, spaces, or on separate lines.
                  </p>
                </div>

                {/* Email Preview */}
                {emailsText.trim() && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3">
                      Email Preview ({validateAndParseEmails(emailsText).validEmails.length} valid emails)
                    </h4>
                    <div className="rounded-2xl p-4 border border-[var(--border-subtle)]"
                      style={{ background: 'var(--bg-surface)' }}>
                      <div className="flex flex-wrap gap-2">
                        {validateAndParseEmails(emailsText).validEmails.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold text-white shadow-sm"
                            style={{ background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)' }}
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
                  <div className="mb-6 p-4 border rounded-2xl"
                    style={{ background: 'var(--error-bg)', borderColor: 'var(--error)' }}>
                    <h4 className="text-sm font-bold text-[var(--error-light)] mb-3">
                      Please fix the following errors:
                    </h4>
                    <ul className="text-sm text-[var(--error-light)] space-y-2">
                      {emailErrors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2 font-medium">
                          <span className="text-[var(--error)] mt-0.5 font-bold">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-4 p-8 border-t"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--bg-elevated)'
                }}>
                <button
                  onClick={handleCloseAddModal}
                  disabled={isAdding}
                  className="px-6 py-3 text-sm font-bold rounded-xl hover:bg-[var(--bg-hover)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMembers}
                  disabled={isAdding || !emailsText.trim() || validateAndParseEmails(emailsText).validEmails.length === 0}
                  className="px-6 py-3 text-sm font-bold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--success)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[180px] justify-center shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%)',
                  }}
                >
                  {isAdding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Adding Members...
                    </>
                  ) : (
                    <>
                      Add {validateAndParseEmails(emailsText).validEmails.length} Members
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default TeamCard;