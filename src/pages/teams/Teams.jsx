import React, { useState, useEffect, useCallback, useMemo } from "react";
import handleApi from "../../libs/handleAPi";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

// Import components
import SearchBar from "./components/SearchBar";
import TeamStats from "./components/TeamStats";
import EmptyState from "./components/EmptyState";
import LoadingGrid from "./components/LoadingGrid";
import TeamGrid from "./components/TeamGrid";
import DuplicateMembersCard from "./components/DuplicateMembersCard";
import Pagination from "./components/Pagination";
import InactiveTeamsSection from "./components/InactiveTeamsSection";
import AllTeamsHeader from "./components/AllTeamsHeader";
import AdminFilter from "./components/AdminFilter";
import ResultsInfo from "./components/ResultsInfo";
import { Helmet } from "react-helmet";

const Teams = () => {
  const [data, setData] = useState([]);
  const [inActiveData, setInActiveData] = useState([]);
  const [totalCount, setTotalCount] = useState({
    totalTeams: 0,
    totalMembers: 0,
    totalActiveTeams: 0,
    totalInactiveTeams: 0,
  });
  const [duplicateMembers, setDuplicateMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState(null);
  const [togglingTeam, setTogglingTeam] = useState(null);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("");
  const [inactiveSearch, setInactiveSearch] = useState("");

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

  // Filter inactive teams based on search (client-side only)
  const filteredInactiveData = useMemo(() => {
    if (!Array.isArray(inActiveData)) return [];

    let filtered = inActiveData;

    // Filter by admin
    if (filter) {
      filtered = filtered.filter(
        (team) =>
          team.reference === filter ||
          team.admin === filter ||
          team.reference?._id === filter
      );
    }

    // Filter by main search (debouncedSearch)
    if (debouncedSearch.trim()) {
      const mainSearchLower = debouncedSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (team) =>
          team.gptAccount?.toLowerCase().includes(mainSearchLower) ||
          team.server?.toLowerCase().includes(mainSearchLower) ||
          team.members?.some((member) =>
            member.toLowerCase().includes(mainSearchLower)
          )
      );
    }

    // Filter by inactive-specific search
    if (inactiveSearch.trim()) {
      const searchLower = inactiveSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (team) =>
          team.gptAccount?.toLowerCase().includes(searchLower) ||
          team.server?.toLowerCase().includes(searchLower) ||
          team.members?.some((member) =>
            member.toLowerCase().includes(searchLower)
          )
      );
    }

    return filtered;
  }, [inActiveData, inactiveSearch, debouncedSearch, filter]);

  const fetchAdmins = useCallback(async () => {
    const response = await handleApi("/references", "GET");
    if (response.success) {
      setAdmins(response.data || []);
    }
  }, []);

  // Fetch data with proper error handling
  const fetchData = useCallback(
    async (searchTerm = "", pageNum = 1) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await handleApi(
          `/gptTeam/team?search=${searchTerm}&page=${pageNum}&admin=${filter}`,
          "GET"
        );

        if (response.success) {
          setData(response.data || []);
          setInActiveData(response.gptInActiveData || []);
          setTotalCount({
            totalTeams: response.total || 0,
            totalMembers: response.totalMembers || 0,
            totalActiveTeams: response.totalActive || 0,
            totalInactiveTeams: response.totalInactive || 0,
          });
          setDuplicateMembers(response.duplicateMembers || []);
          setTotalTeams(response.pagination?.totalTeams || 0);
          setTotalPages(response.pagination?.totalPages || 1);
          setCurrentPage(response.pagination?.currentPage || pageNum);
        } else {
          setError(response.message || "Failed to fetch teams");
          setData([]);
          setInActiveData([]);
        }
      } catch (err) {
        setError("An error occurred while fetching teams");
        console.error("Error fetching teams:", err);
        setData([]);
        setInActiveData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filter]
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPage(newPage);
      fetchData(debouncedSearch, newPage);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle team activation toggle
  const handleToggleActive = async (teamId, newActiveState) => {
    try {
      setTogglingTeam(teamId);
      const response = await handleApi(`/gptTeam/team/${teamId}/toggle`, "PUT", {
        isActive: newActiveState,
      });

      if (response.success) {
        setData((prevData) => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map((team) =>
            team._id === teamId ? { ...team, isActive: newActiveState } : team
          );
          return updatedData;
        });
        toast.success(
          `Team ${newActiveState ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error(response.message || "Failed to update team status");
      }
    } catch (err) {
      toast.error("An error occurred while updating team status");
      console.error("Error toggling team status:", err);
    } finally {
      setTogglingTeam(null);
    }
  };

  // Handle member removal
  const handleRemoveMember = async (teamId, member, memberIndex) => {
    try {
      const response = await handleApi(
        `/gptTeam/team/${teamId}/member`,
        "DELETE",
        { member: member }
      );

      if (response.success) {
        setData((prevData) => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map((team) => {
            if (team._id === teamId) {
              const updatedMembers = team.members.filter(
                (_, index) => index !== memberIndex
              );
              return { ...team, members: updatedMembers };
            }
            return team;
          });
          return updatedData;
        });
        toast.success("Member removed successfully");
      } else {
        toast.error(response.message || "Failed to remove member");
      }
    } catch (err) {
      toast.error("An error occurred while removing member");
      console.error("Error removing member:", err);
      throw err;
    }
  };

  // Handle adding multiple members
  const handleAddMembers = async (teamId, emailArray, reference) => {
    try {
      const response = await handleApi(
        `/gptTeam/team/${teamId}/members`,
        "POST",
        { members: emailArray, reference }
      );

      if (response.success) {
        setData((prevData) => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map((team) => {
            if (team._id === teamId) {
              const existingMembers = team.members || [];
              const newMembers = emailArray.filter(
                (email) => !existingMembers.includes(email)
              );
              return { ...team, members: [...existingMembers, ...newMembers] };
            }
            return team;
          });
          return updatedData;
        });

        const addedCount = emailArray.length;
        toast.success(
          `${addedCount} member${addedCount === 1 ? "" : "s"} added successfully`
        );
      } else {
        toast.error(response.message || "Failed to add members");
        throw new Error(response.message || "Failed to add members");
      }
    } catch (err) {
      toast.error("An error occurred while adding members");
      console.error("Error adding members:", err);
      throw err;
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data when debounced search changes
  useEffect(() => {
    let isSubscribed = true;

    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const response = await handleApi(
          `/gptTeam/team?search=${debouncedSearch}&page=${currentPage}&admin=${filter}`,
          "GET"
        );

        if (isSubscribed) {
          if (response.success) {
            setData(response.data || []);
            setInActiveData(response.gptInActiveData || []);
            setTotalCount({
              totalTeams: response.total || 0,
              totalMembers: response.totalMembers || 0,
              totalActiveTeams: response.totalActive || 0,
              totalInactiveTeams: response.totalInactive || 0,
            });
            setDuplicateMembers(response.duplicateMembers || []);
            setTotalTeams(response.pagination?.totalTeams || 0);
            setTotalPages(response.pagination?.totalPages || 1);
          } else {
            setError("Failed to fetch teams");
          }
        }
      } catch (error) {
        if (isSubscribed) {
          setError(error.message);
          setData([]);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchTeams();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch, currentPage, filter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingGrid count={6} />;
    }

    if (error) {
      return (
        <EmptyState message={error} icon={FaExclamationCircle} type="error" />
      );
    }

    if (!Array.isArray(sortedTeams) || sortedTeams.length === 0) {
      const emptyType = search ? "search" : "default";
      const emptyMessage = search ? "No teams found" : "No teams available";

      return (
        <EmptyState message={emptyMessage} icon={FaSearch} type={emptyType} />
      );
    }

    return (
      <>
        {/* Inactive Teams Section */}
        <InactiveTeamsSection
          inActiveData={inActiveData}
          filteredInactiveData={filteredInactiveData}
          inactiveSearch={inactiveSearch}
          setInactiveSearch={setInactiveSearch}
          onToggleActive={handleToggleActive}
          onRemoveMember={handleRemoveMember}
          onAddMembers={handleAddMembers}
          togglingTeam={togglingTeam}
        />

        {/* All Teams Header Section */}
        <AllTeamsHeader totalCount={totalCount} />

        {/* Active Teams Grid */}
        <TeamGrid
          teams={sortedTeams.filter(team => team.isActive)}
          onToggleActive={handleToggleActive}
          onRemoveMember={handleRemoveMember}
          onAddMembers={handleAddMembers}
          togglingTeam={togglingTeam}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Teams</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <SearchBar
          search={search}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />

        {/* Admin Filter */}
        <AdminFilter admins={admins} onFilterChange={setFilter} />

        {/* Stats Section */}
        {!isLoading && !error && <TeamStats totalCount={totalCount} />}

        {/* Duplicate Members Warning */}
        {!isLoading && !error && duplicateMembers.length > 0 && (
          <DuplicateMembersCard duplicateMembers={duplicateMembers} />
        )}

        {/* Results Info */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <ResultsInfo
            search={search}
            sortedTeamsCount={sortedTeams.length}
            totalTeams={totalTeams}
            currentPage={currentPage}
            totalPages={totalPages}
            onClearSearch={() => setSearch("")}
          />
        )}

        {/* Content Area */}
        <div className="relative">{renderContent()}</div>

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
