import React, { useState, useEffect, useCallback, useMemo } from 'react';
import handleApi from '../../libs/handleAPi';
import { FaServer, FaUserFriends, FaEnvelope, FaCircle, FaChevronDown, FaChevronUp, FaExclamationCircle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ToggleButton = ({ isActive, isLoading, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`
      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${isActive ? 'bg-green-500' : 'bg-gray-400'}
      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
        transition duration-200 ease-in-out
        ${isActive ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

const TeamCard = ({ team, onToggleActive, isToggling }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50' 
            : 'border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/30'
        }`}>
          <div className="p-4 sm:p-6 space-y-2">
            {team.members.map((member, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  team.isActive 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'bg-red-400 dark:bg-red-600'
                }`} />
                <span className={
                  team.isActive 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-red-700 dark:text-red-300'
                }>
                  {member}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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