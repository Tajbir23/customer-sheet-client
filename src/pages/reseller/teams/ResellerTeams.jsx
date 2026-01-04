import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import handleApi from '../../../libs/handleAPi';

// Import components
import ResellerTeamGrid from './components/ResellerTeamGrid';
import ResellerLoadingGrid from './components/ResellerLoadingGrid';
import ResellerTeamStats from './components/ResellerTeamStats';
import ResellerEmptyState from './components/ResellerEmptyState';

const ResellerTeams = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Fetch teams data
    const fetchTeams = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await handleApi('/reseller/get-teams', 'GET');

            if (response.success) {
                setTeams(response.teams || []);
            } else {
                setError(response.message || 'Failed to fetch teams');
                setTeams([]);
            }
        } catch (err) {
            setError('An error occurred while fetching teams');
            console.error('Error fetching teams:', err);
            setTeams([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // Filter teams based on search
    const filteredTeams = teams.filter((team) => {
        if (!debouncedSearch.trim()) return true;
        const searchLower = debouncedSearch.toLowerCase().trim();
        return (
            team.gptAccount?.toLowerCase().includes(searchLower) ||
            team.members?.some((member) => member.toLowerCase().includes(searchLower))
        );
    });

    // Handle member removal
    const handleRemoveMember = async (gptAccount, member) => {
        try {
            const response = await handleApi('/reseller/remove-member', 'DELETE', {
                gptAccount,
                member,
            });

            if (response.success) {
                // Update local state
                setTeams((prevTeams) =>
                    prevTeams.map((team) => {
                        if (team.gptAccount === gptAccount) {
                            return {
                                ...team,
                                members: team.members.filter((m) => m !== member),
                            };
                        }
                        return team;
                    })
                );
                return true;
            } else {
                throw new Error(response.message || 'Failed to remove member');
            }
        } catch (err) {
            console.error('Error removing member:', err);
            throw err;
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const renderContent = () => {
        if (isLoading) {
            return <ResellerLoadingGrid count={6} />;
        }

        if (error) {
            return <ResellerEmptyState type="error" message={error} />;
        }

        if (filteredTeams.length === 0) {
            const emptyType = search ? 'search' : 'default';
            const emptyMessage = search
                ? `No teams found for "${search}"`
                : 'No teams available';

            return <ResellerEmptyState type={emptyType} message={emptyMessage} />;
        }

        return <ResellerTeamGrid teams={filteredTeams} onRemoveMember={handleRemoveMember} onMemberAdded={fetchTeams} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Helmet>
                <title>My Teams | Reseller Dashboard</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                    <FaUsers className="text-white" />
                                </div>
                                My Teams
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage your GPT team members and view team statistics
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teams or members..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200 font-medium"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                {!isLoading && !error && teams.length > 0 && (
                    <ResellerTeamStats teams={teams} />
                )}

                {/* Results Info */}
                {!isLoading && !error && filteredTeams.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {search ? 'Search Results' : 'All Teams'}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {search ? (
                                        <>
                                            Showing <span className="font-semibold">{filteredTeams.length}</span> teams
                                            for "<span className="font-semibold">{search}</span>"
                                        </>
                                    ) : (
                                        <>
                                            Showing <span className="font-semibold">{filteredTeams.length}</span> teams
                                        </>
                                    )}
                                </p>
                            </div>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors duration-200"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="relative">{renderContent()}</div>

                {/* Footer */}
                {!isLoading && !error && filteredTeams.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-100">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
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

export default ResellerTeams;