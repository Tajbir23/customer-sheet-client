import React, { useState, useEffect, useCallback, useMemo } from 'react';
import handleApi from '../../libs/handleAPi';
import { FaExclamationCircle, FaSearch, FaTimes } from 'react-icons/fa';
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

  // Handle team update (refresh data)
  const handleTeamUpdate = () => {
    fetchData(debouncedSearch);
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
        onTeamUpdate={handleTeamUpdate}
        togglingTeam={togglingTeam}
      />
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Teams Management</h1>
        <p className="text-gray-600">Manage your GPT teams and members</p>
      </div>

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center shadow-sm">
                    <FaSearch className="text-white text-sm" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {search ? 'Search Results' : 'All Teams'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {search ? (
                        <>Found <span className="font-semibold text-blue">{sortedTeams.length}</span> teams matching "<span className="font-semibold text-blue">{search}</span>"</>
                      ) : (
                        <>Currently managing <span className="font-semibold text-blue">{sortedTeams.length}</span> teams</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors duration-200 shadow-sm"
                  >
                    <FaTimes className="mr-2 text-xs" />
                    Clear Search
                  </button>
                )}
                
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                  <span>Live results</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-medium text-green">{sortedTeams.filter(t => t.isActive).length}</span> Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-medium text-red">{sortedTeams.filter(t => !t.isActive).length}</span> Inactive
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue rounded-full"></div>
                <span className="text-gray-600">
                  <span className="font-medium text-blue">{sortedTeams.reduce((acc, team) => acc + (team.members?.length || 0), 0)}</span> Total Members
                </span>
              </div>
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
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <div className="h-2 w-2 bg-blue rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;