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
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTeams, setTotalTeams] = useState(0)
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
  const fetchData = useCallback(async (searchTerm = '', pageNum = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await handleApi(`/gptTeam/team?search=${searchTerm}&page=${pageNum}`, 'GET');
      
      if (response.success) {
        setData(response.data || []);
        setTotalTeams(response.pagination?.totalTeams || 0);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || pageNum);
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

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPage(newPage);
      fetchData(debouncedSearch, newPage);
    }
  };

  // Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const pages = [];
      const showPages = 5;

      if (totalPages <= showPages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          if (totalPages > 5) {
            pages.push('...');
            pages.push(totalPages);
          }
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          if (totalPages > 5) {
            pages.push('...');
          }
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue-50'
          }`}
        >
          Previous
        </button>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue text-white'
                    : 'text-gray-600 hover:text-blue hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage >= totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-blue hover:bg-blue-50'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

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
      setCurrentPage(1); // Reset to first page on search
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data when debounced search changes
  useEffect(() => {
    let isSubscribed = true;

    const getData = async () => {
      if (isSubscribed) {
        await fetchData(debouncedSearch, currentPage);
      }
    };

    getData();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch, currentPage, fetchData]);

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
    <div className="min-h-screen bg-gray-50">
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
            <div className="card">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {search ? 'Search Results' : 'All Teams'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {search ? (
                        <>Showing <span className="font-semibold">{sortedTeams.length}</span> teams for "<span className="font-semibold">{search}</span>"</>
                      ) : (
                        <>Showing <span className="font-semibold">{sortedTeams.length}</span> of <span className="font-semibold">{totalTeams}</span> teams</>
                      )}
                    </p>
                    {totalPages > 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Page {currentPage} of {totalPages}
                      </p>
                    )}
                  </div>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="btn btn-primary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="relative">
          {renderContent()}
        </div>

        {/* Pagination */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Footer */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200">
              <div className="h-2 w-2 bg-blue rounded-full animate-pulse"></div>
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