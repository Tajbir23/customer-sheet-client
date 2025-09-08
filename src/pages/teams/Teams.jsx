import React, { useState, useEffect, useCallback, useMemo } from 'react';
import handleApi from '../../libs/handleAPi';
import { FaExclamationCircle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Import our new components
import SearchBar from './components/SearchBar';
import TeamStats from './components/TeamStats';
import EmptyState from './components/EmptyState';
import LoadingGrid from './components/LoadingGrid';
import TeamGrid from './components/TeamGrid';

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
      throw err;
    }
  };

  // Handle adding multiple members
  const handleAddMembers = async (teamId, emailArray, reference) => {
    try {
      const response = await handleApi(`/gptTeam/team/${teamId}/members`, 'POST', {
        members: emailArray,
        reference
      });
      
      if (response.success) {
        setData(prevData => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map(team => {
            if (team._id === teamId) {
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
      throw err;
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
      return <LoadingGrid count={6} />;
    }

    if (error) {
      return <EmptyState message={error} icon={FaExclamationCircle} type="error" />;
    }

    if (!Array.isArray(sortedTeams) || sortedTeams.length === 0) {
      const emptyType = search ? 'search' : 'default';
      const emptyMessage = search ? 'No teams found' : 'No teams available';
      
      return <EmptyState message={emptyMessage} icon={FaSearch} type={emptyType} />;
    }

    return (
      <TeamGrid 
        teams={sortedTeams}
        onToggleActive={handleToggleActive}
        onRemoveMember={handleRemoveMember}
        onAddMembers={handleAddMembers}
        togglingTeam={togglingTeam}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Section */}
        <SearchBar 
          search={search}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />

        {/* Stats Section */}
        {!isLoading && !error && (
          <TeamStats teams={data} />
        )}

        {/* Results Info */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    {search ? 'Search Results' : 'All Teams'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {search ? (
                      <>Showing <span className="font-semibold">{sortedTeams.length}</span> teams for "<span className="font-semibold">{search}</span>"</>
                    ) : (
                      <>Managing <span className="font-semibold">{sortedTeams.length}</span> teams total</>
                    )}
                  </p>
                </div>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="relative">
          {renderContent()}
        </div>

        {/* Footer */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-gray-100">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;