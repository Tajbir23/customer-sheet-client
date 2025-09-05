import React, { useState, useEffect, useCallback, useMemo } from 'react';
import handleApi from '../../libs/handleAPi';
import { FaUserFriends, FaEnvelope, FaChevronDown, FaChevronUp, FaExclamationCircle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TeamCard from './components/TeamCard';


const EmptyState = ({ message, icon: Icon, type = 'default' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className={`rounded-full p-4 mb-4 ${
      type === 'error' 
        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
    }`}>
      <Icon className="w-8 h-8" />
    </div>
    <p className={`text-lg font-medium mb-2 ${
      type === 'error'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-900 dark:text-white'
    }`}>
      {message}
    </p>
    {type !== 'error' && (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    )}
  </div>
);

const Teams = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState(null);
  const [togglingTeam, setTogglingTeam] = useState(null);

  // Sort teams with inactive first
  const sortedTeams = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      if (a.isActive === b.isActive) {
        return a.gptAccount.localeCompare(b.gptAccount);
      }
      return a.isActive ? 1 : -1;
    });
  }, [data]);

  // Fetch data with proper error handling
  const fetchData = useCallback(async (searchTerm) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleApi(`/gptTeam/team?search=${searchTerm}`, 'GET');
      
      if (response.success) {
        // The data is in response.data
        setData(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch teams');
        setData([]);
      }
    } catch (err) {
      setError('An error occurred while fetching teams');
      console.error('Error fetching teams:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle team activation toggle
  const handleToggleActive = async (teamId, newActiveState) => {
    try {
      setTogglingTeam(teamId);
      const response = await handleApi(`/gptTeam/team/${teamId}/toggle`, 'PUT', {
        isActive: newActiveState
      });
      
      if (response.success) {
        setData(prevData => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map(team => 
            team._id === teamId ? { ...team, isActive: newActiveState } : team
          );
          return updatedData;
        });
        toast.success(`Team ${newActiveState ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error(response.message || 'Failed to update team status');
      }
    } catch (err) {
      toast.error('An error occurred while updating team status');
      console.error('Error toggling team status:', err);
    } finally {
      setTogglingTeam(null);
    }
  };

  // Handle member removal
  const handleRemoveMember = async (teamId, member, memberIndex) => {
    try {
      const response = await handleApi(`/gptTeam/team/${teamId}/member`, 'DELETE', {
        member: member
      });
      
      if (response.success) {
        setData(prevData => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map(team => {
            if (team._id === teamId) {
              const updatedMembers = team.members.filter((_, index) => index !== memberIndex);
              return { ...team, members: updatedMembers };
            }
            return team;
          });
          return updatedData;
        });
        toast.success('Member removed successfully');
      } else {
        toast.error(response.message || 'Failed to remove member');
      }
    } catch (err) {
      toast.error('An error occurred while removing member');
      console.error('Error removing member:', err);
      throw err; // Re-throw to handle in Member component
    }
  };

  // Handle adding multiple members
  const handleAddMembers = async (teamId, emailArray) => {
    try {
      const response = await handleApi(`/gptTeam/team/${teamId}/members`, 'POST', {
        members: emailArray
      });
      
      if (response.success) {
        setData(prevData => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map(team => {
            if (team._id === teamId) {
              // Add new members to existing members array, avoiding duplicates
              const existingMembers = team.members || [];
              const newMembers = emailArray.filter(email => !existingMembers.includes(email));
              return { ...team, members: [...existingMembers, ...newMembers] };
            }
            return team;
          });
          return updatedData;
        });
        
        const addedCount = emailArray.length;
        toast.success(`${addedCount} member${addedCount === 1 ? '' : 's'} added successfully`);
      } else {
        toast.error(response.message || 'Failed to add members');
        throw new Error(response.message || 'Failed to add members');
      }
    } catch (err) {
      toast.error('An error occurred while adding members');
      console.error('Error adding members:', err);
      throw err; // Re-throw to handle in TeamCard component
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data when debounced search changes
  useEffect(() => {
    let isSubscribed = true;

    const getData = async () => {
      if (isSubscribed) {
        await fetchData(debouncedSearch);
      }
    };

    getData();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch, fetchData]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-gray-100 dark:bg-gray-800 h-48 rounded-xl animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return <EmptyState message={error} icon={FaExclamationCircle} type="error" />;
    }

    if (!Array.isArray(sortedTeams) || sortedTeams.length === 0) {
      return <EmptyState message="No teams found" icon={FaSearch} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeams.map((team) => (
          <TeamCard 
            key={team._id} 
            team={team} 
            onToggleActive={handleToggleActive}
            onRemoveMember={handleRemoveMember}
            onAddMembers={handleAddMembers}
            isToggling={togglingTeam === team._id}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Search Input */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search GPT Teams
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search by GPT account or member email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Teams;