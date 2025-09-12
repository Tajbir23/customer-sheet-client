import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaPlus, FaUsers, FaToggleOn, FaToggleOff, FaChevronDown, FaChevronUp, FaUserPlus, FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import handleApi from '../../../libs/handleAPi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, memberEmail, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="modal-content max-w-md w-full">
                <div className="card-header bg-red-50 border-b border-red-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FaExclamationTriangle className="text-red text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red">Remove Member</h3>
                            <p className="text-sm text-gray-600">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to remove <span className="font-medium text-gray-900">{memberEmail}</span> from this team?
                    </p>
                    <p className="text-sm text-gray-500">
                        The member will lose access to this team and all related resources.
                    </p>
                </div>

                <div className="card-footer">
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className={`btn border-red flex items-center space-x-2 transition-all duration-200 bg-red-800 ${
                                isDeleting 
                                    ? 'bg-gray-400 border-gray-400 text-gray-200 opacity-50 cursor-not-allowed' 
                                    : 'bg-red text-white hover:bg-red hover:text-yellow-100 hover:shadow-md transform hover:scale-105'
                            }`}
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Removing...</span>
                                </>
                            ) : (
                                <>
                                    <FaTrash size={14} />
                                    <span>Remove Member</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamCard = ({ team, onTeamUpdate, onToggleStatus }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [deletingMember, setDeletingMember] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const handleAddToTeam = async () => {
        if (!newMemberEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newMemberEmail.trim())) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsAdding(true);
        try {
            // Try different API endpoints that might work
            let response;
            
            // First try the original endpoint
            try {
                response = await handleApi(`/gptTeam/addToTeam/${team._id}`, 'POST', {
                    email: newMemberEmail.trim()
                });
            } catch (error) {
                console.log('First endpoint failed, trying alternative...');
                
                // Try alternative endpoint with members array
                response = await handleApi(`/gptTeam/team/${team._id}/members`, 'POST', {
                    members: [newMemberEmail.trim()]
                });
            }

            if (response && response.success) {
                toast.success('Member added successfully!');
                setNewMemberEmail('');
                setShowAddForm(false);
                if (onTeamUpdate) {
                    onTeamUpdate();
                }
            } else {
                toast.error(response?.message || 'Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            
            // Try one more alternative endpoint
            try {
                const fallbackResponse = await handleApi(`/gptTeam/${team._id}/addMember`, 'POST', {
                    memberEmail: newMemberEmail.trim()
                });
                
                if (fallbackResponse && fallbackResponse.success) {
                    toast.success('Member added successfully!');
                    setNewMemberEmail('');
                    setShowAddForm(false);
                    if (onTeamUpdate) {
                        onTeamUpdate();
                    }
                } else {
                    toast.error('Failed to add member. Please try again.');
                }
            } catch (fallbackError) {
                console.error('All endpoints failed:', fallbackError);
                toast.error('Unable to add member at this time. Please check your connection and try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const openDeleteModal = (member, memberIndex) => {
        setMemberToDelete({ member, memberIndex });
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setMemberToDelete(null);
        setDeletingMember(null);
    };

    const handleRemoveMember = async () => {
        if (!memberToDelete) return;

        const { member, memberIndex } = memberToDelete;
        setDeletingMember(memberIndex);

        try {
            // Try different API endpoints for removing members
            let response;
            
            // First try the original endpoint
            try {
                response = await handleApi(`/gptTeam/team/${team._id}/member`, 'DELETE', {
                    member: member
                });
            } catch (error) {
                console.log('First delete endpoint failed, trying alternative...');
                
                // Try alternative endpoint
                response = await handleApi(`/gptTeam/team/${team._id}/removeMember`, 'POST', {
                    memberEmail: member
                });
            }

            if (response && response.success) {
                toast.success('Member removed successfully!');
                closeDeleteModal();
                if (onTeamUpdate) {
                    onTeamUpdate();
                }
            } else {
                toast.error(response?.message || 'Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            
            // Try one more alternative endpoint
            try {
                const fallbackResponse = await handleApi(`/gptTeam/${team._id}/member/${memberIndex}`, 'DELETE');
                
                if (fallbackResponse && fallbackResponse.success) {
                    toast.success('Member removed successfully!');
                    closeDeleteModal();
                    if (onTeamUpdate) {
                        onTeamUpdate();
                    }
                } else {
                    toast.error('Failed to remove member. Please try again.');
                }
            } catch (fallbackError) {
                console.error('All delete endpoints failed:', fallbackError);
                toast.error('Unable to remove member at this time. Please try again.');
            }
        } finally {
            setDeletingMember(null);
        }
    };

    const toggleMembersView = () => {
        setShowMembers(!showMembers);
    };

    const cancelAddMember = () => {
        setShowAddForm(false);
        setNewMemberEmail('');
    };

    const renderMemberItem = (member, index, showDelete = true) => (
        <div 
            key={index} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue">
                        {member.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className="text-sm text-gray-700 truncate">{member}</span>
            </div>
            
            {showDelete && (
                <button
                    onClick={() => openDeleteModal(member, index)}
                    className="cursor-pointer ml-2 p-1.5 text-red bg-red-50 hover:bg-red-100 rounded transition-colors flex-shrink-0 border border-red-200 hover:border-red-300"
                    title="Remove member"
                >
                    Remove
                </button>
            )}
        </div>
    );

    return (
        <>
            <div className="card hover:shadow-md transition-shadow">
                {/* Header */}
                <div className={`card-header ${
                    team.isActive 
                        ? 'bg-gray-50 border-b border-gray-200' 
                        : 'bg-red-50 border-b border-red-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                team.isActive 
                                    ? 'bg-blue text-white' 
                                    : 'bg-red text-white'
                            }`}>
                                <FaUsers size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">
                                    {team.gptAccount}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    GPT Account
                                </p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                            team.isActive
                                ? 'bg-green-50 text-green'
                                : 'bg-red-50 text-red'
                        }`}>
                            {team.isActive ? (
                                <>
                                    <FaCheckCircle size={14} />
                                    <span>Active</span>
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle size={14} />
                                    <span>Inactive</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="card-body">
                    <div className="space-y-4">
                        {/* Members Section Header */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-gray-700">Team Members</h4>
                                    <span className="text-sm text-gray-500">
                                        ({team.members?.length || 0})
                                    </span>
                                </div>
                                
                                {/* Toggle Button */}
                                {team.members && team.members.length > 0 && (
                                    <button
                                        onClick={toggleMembersView}
                                        className="btn btn-secondary text-sm px-3 py-1 flex items-center space-x-1"
                                    >
                                        <span>{showMembers ? 'Hide' : 'Show'}</span>
                                        {showMembers ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                    </button>
                                )}
                            </div>
                            
                            {/* Add Member Form */}
                            {showAddForm && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <FaUserPlus className="text-blue" size={16} />
                                        <span className="text-sm font-medium text-blue">Add New Member</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            className="form-input flex-1 text-sm"
                                            disabled={isAdding}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddToTeam();
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={handleAddToTeam}
                                            disabled={isAdding || !newMemberEmail.trim()}
                                            className="btn btn-primary text-sm px-3 py-1"
                                        >
                                            {isAdding ? (
                                                <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                                            ) : (
                                                'Add'
                                            )}
                                        </button>
                                        <button
                                            onClick={cancelAddMember}
                                            disabled={isAdding}
                                            className="btn btn-secondary text-sm px-3 py-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Members List */}
                            {team.members && team.members.length > 0 ? (
                                <div>
                                    {/* Always show first 2 members */}
                                    <div className="space-y-1">
                                        {team.members.slice(0, 2).map((member, index) => 
                                            renderMemberItem(member, index, true)
                                        )}
                                    </div>

                                    {/* Show remaining members if toggle is on */}
                                    {showMembers && team.members.length > 2 && (
                                        <div className="mt-2 space-y-1 border-t border-gray-200 pt-2">
                                            {team.members.slice(2).map((member, index) => 
                                                renderMemberItem(member, index + 2, true)
                                            )}
                                        </div>
                                    )}

                                    {/* Show count if not showing all */}
                                    {!showMembers && team.members.length > 2 && (
                                        <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded mt-2 cursor-pointer" onClick={toggleMembersView}>
                                            +{team.members.length - 2} more members (click to view)
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <FaUsers className="text-gray-400 mx-auto mb-2" size={24} />
                                    <p className="text-sm text-gray-500">No members yet</p>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                    {team.totalMembers || team.members?.length || 0}
                                </div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-700">
                                    {team.activeMembers || 0}
                                </div>
                                <div className="text-xs text-gray-500">Active</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onToggleStatus(team._id, !team.isActive)}
                            className={`btn btn-outline flex items-center space-x-2 ${
                                team.isActive ? 'text-red border-red hover:bg-red' : 'text-green border-green hover:bg-green'
                            }`}
                        >
                            {team.isActive ? (
                                <>
                                    <FaToggleOff size={16} />
                                    <span>Deactivate</span>
                                </>
                            ) : (
                                <>
                                    <FaToggleOn size={16} />
                                    <span>Activate</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            disabled={isAdding}
                            className={`btn btn-primary flex items-center space-x-2 ${
                                showAddForm ? 'bg-gray-500 hover:bg-gray-600' : ''
                            }`}
                        >
                            <FaPlus size={14} />
                            <span>{showAddForm ? 'Cancel' : 'Add Member'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleRemoveMember}
                memberEmail={memberToDelete?.member}
                isDeleting={deletingMember !== null}
            />
        </>
    );
};

export default TeamCard;