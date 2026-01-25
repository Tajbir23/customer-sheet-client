import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import handleApi from "../../libs/handleAPi";

import { toast } from "react-toastify";
import useAddMember from "../../libs/useAddMember";
import { useSocket } from "../../context/SocketContext";

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
import DraggableScreenshotPreview from "../../components/DraggableScreenshotPreview";
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
  // Track recently changed teams for visual feedback (optimistic UI)
  const [recentlyToggledTeam, setRecentlyToggledTeam] = useState(null);
  const [recentlyAddedMembers, setRecentlyAddedMembers] = useState({ teamId: null, members: [] });
  // Track team IDs that should stay visible even after member removal
  const [visibleTeamIds, setVisibleTeamIds] = useState(new Set());

  // Refs for managing waiting timeouts
  const inviteWaitingTimeoutRef = useRef(null);
  const removeWaitingTimeoutRef = useRef(null);
  // Get userId from JWT token
  const [userId, setUserId] = useState(null);
  // Screenshot preview from socket
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  // Remove member screenshot preview from socket
  const [removeScreenshotPreview, setRemoveScreenshotPreview] = useState(null);
  // Waiting states for screenshot previews
  const [inviteWaiting, setInviteWaiting] = useState(false);
  const [removeWaiting, setRemoveWaiting] = useState(false);

  // Extract userId from JWT token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload._id || payload.id || payload.userId);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }, []);

  // Get socket subscribe function
  const { subscribe, socket, isConnected } = useSocket();

  // Listen for invite-monitoring-response event (only once in Teams page)
  useEffect(() => {
    console.log('Socket status:', { socket: !!socket, isConnected });

    // Only subscribe when socket is connected
    if (!socket || !isConnected) return;

    console.log('Subscribing to invite-monitoring-response event');

    const unsubscribe = subscribe('invite-monitoring-response', (data) => {
      console.log('invite-monitoring-response received:', data);

      // Handle browser closed status - clear screenshot and show message
      if (data.status === 'invite_completed_browser_closed') {
        setScreenshotPreview(null);
        setInviteWaiting(false);
        toast.info('✅ Invite completed - Browser closed');
        return;
      }

      // Handle screenshot preview
      if (data.status === 'screenshot' && data.screenshot) {
        // Clear any existing timeout
        if (inviteWaitingTimeoutRef.current) {
          clearTimeout(inviteWaitingTimeoutRef.current);
        }

        // Reset waiting (new screenshot arrived), then set waiting again for next
        setInviteWaiting(false);
        setScreenshotPreview({
          id: Date.now() + Math.random(), // Unique ID to force re-render
          image: data.screenshot,
          gptAccount: data.gptAccount,
          memberEmail: data.memberEmail,
          timestamp: data.timestamp
        });

        // After showing screenshot, set waiting for next screenshot
        inviteWaitingTimeoutRef.current = setTimeout(() => {
          setInviteWaiting(true);
        }, 100);
      }

      if (data.success && data.message) {
        toast.success(data.message);
      } else if (!data.success && data.message) {
        toast.error(data.message);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, socket, isConnected]);

  // Listen for remove-monitoring-response event
  useEffect(() => {
    // Only subscribe when socket is connected
    if (!socket || !isConnected) return;

    console.log('Subscribing to remove-monitoring-response event');

    const unsubscribe = subscribe('remove-monitoring-response', (data) => {
      console.log('remove-monitoring-response received:', data);

      // Handle different status types
      if (data.status === 'removed') {
        toast.success('✅ Remove member successful');
        return;
      }

      if (data.status === 'remove_failed') {
        toast.error('❌ Remove failed');
        return;
      }

      if (data.status === 'error') {
        toast.error('⚠️ Something went wrong');
        return;
      }

      if (data.status === 'removed_browser_closed') {
        setRemoveScreenshotPreview(null);
        setRemoveWaiting(false);
        toast.info('🔒 Browser closing');
        return;
      }

      // Handle screenshot preview
      if (data.status === 'screenshot' && data.screenshot) {
        // Clear any existing timeout
        if (removeWaitingTimeoutRef.current) {
          clearTimeout(removeWaitingTimeoutRef.current);
        }

        // Reset waiting (new screenshot arrived), then set waiting again for next
        setRemoveWaiting(false);
        setRemoveScreenshotPreview({
          id: Date.now() + Math.random(), // Unique ID to force re-render
          image: data.screenshot,
          gptAccount: data.gptAccount,
          email: data.email,
          timestamp: data.timestamp
        });

        // After showing screenshot, set waiting for next screenshot
        removeWaitingTimeoutRef.current = setTimeout(() => {
          setRemoveWaiting(true);
        }, 100);
      }

      if (data.success && data.message) {
        toast.success(data.message);
      } else if (!data.success && data.message) {
        toast.error(data.message);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe, socket, isConnected]);

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

  // Filter active teams based on search (client-side)
  const filteredActiveData = useMemo(() => {
    let filtered = sortedTeams.filter((team) => team.isActive);

    // Filter by main search (debouncedSearch)
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (team) =>
          // Keep teams that match search OR were previously visible (to handle member removal)
          visibleTeamIds.has(team._id) ||
          team.gptAccount?.toLowerCase().includes(searchLower) ||
          team.server?.toLowerCase().includes(searchLower) ||
          team.members?.some((member) =>
            member.toLowerCase().includes(searchLower)
          )
      );
    }

    return filtered;
  }, [sortedTeams, debouncedSearch, visibleTeamIds]);

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
        // Update local state immediately for optimistic UI
        setData((prevData) => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map((team) =>
            team._id === teamId ? { ...team, isActive: newActiveState } : team
          );
          return updatedData;
        });

        // Also update inactive data if team is there
        setInActiveData((prevData) => {
          if (!Array.isArray(prevData)) return [];
          const updatedData = prevData.map((team) =>
            team._id === teamId ? { ...team, isActive: newActiveState } : team
          );
          return updatedData;
        });

        // Mark team as recently toggled for visual feedback
        setRecentlyToggledTeam(teamId);
        setTimeout(() => setRecentlyToggledTeam(null), 2000);

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
        // Add teamId to visibleTeamIds so it stays visible after member removal
        setVisibleTeamIds(prev => new Set([...prev, teamId]));

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

  // Update local state when members are added (for optimistic UI)
  const updateLocalStateOnMemberAdd = useCallback((teamId, emailArray) => {
    // Update active data
    setData((prevData) => {
      if (!Array.isArray(prevData)) return [];
      return prevData.map((team) => {
        if (team._id === teamId) {
          const existingMembers = team.members || [];
          const newMembers = emailArray.filter(
            (email) => !existingMembers.includes(email)
          );
          return { ...team, members: [...existingMembers, ...newMembers] };
        }
        return team;
      });
    });

    // Also update inactive data if team is there
    setInActiveData((prevData) => {
      if (!Array.isArray(prevData)) return [];
      return prevData.map((team) => {
        if (team._id === teamId) {
          const existingMembers = team.members || [];
          const newMembers = emailArray.filter(
            (email) => !existingMembers.includes(email)
          );
          return { ...team, members: [...existingMembers, ...newMembers] };
        }
        return team;
      });
    });

    // Track recently added members for visual feedback
    setRecentlyAddedMembers({ teamId, members: emailArray });
    setTimeout(() => setRecentlyAddedMembers({ teamId: null, members: [] }), 3000);
  }, []);

  // Use the reusable addMember hook
  const { addMembers } = useAddMember({
    onSuccess: (response, { teamId, emailArray }) => {
      updateLocalStateOnMemberAdd(teamId, emailArray);
    }
  });

  // Handle adding multiple members (wrapper for child components)
  const handleAddMembers = useCallback(async (teamId, emailArray, reference) => {
    await addMembers(teamId, emailArray, reference);
  }, [addMembers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
      setPage(1);
      // Clear visible teams when search query changes so we don't carry over
      // temporarily visible teams to a completely new search context
      setVisibleTeamIds(new Set());
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
            setError(null);
          } else {
            // Don't show error if we have results in inactive data (static search)
            // API might fail but static data might have results
            setError(null);
          }
        }
      } catch (error) {
        if (isSubscribed) {
          // Don't clear data or show error - keep existing data for static search
          setError(null);
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
        <EmptyState message={error} type="error" />
      );
    }

    // Check if we have any results in either inactive or active data
    const hasInactiveResults = filteredInactiveData.length > 0;
    const hasActiveResults = filteredActiveData.length > 0;
    const hasAnyResults = hasInactiveResults || hasActiveResults;

    if (!hasAnyResults) {
      const emptyType = search ? "search" : "default";
      const emptyMessage = search ? "No teams found" : "No teams available";

      return (
        <EmptyState message={emptyMessage} type={emptyType} />
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
          recentlyToggledTeam={recentlyToggledTeam}
          recentlyAddedMembers={recentlyAddedMembers}
          userId={userId}
        />

        {/* All Teams Header Section */}
        <AllTeamsHeader totalCount={totalCount} />

        {/* Active Teams Grid */}
        <TeamGrid
          teams={filteredActiveData}
          onToggleActive={handleToggleActive}
          onRemoveMember={handleRemoveMember}
          onAddMembers={handleAddMembers}
          togglingTeam={togglingTeam}
          recentlyToggledTeam={recentlyToggledTeam}
          recentlyAddedMembers={recentlyAddedMembers}
          userId={userId}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Teams - Customer Sheet</title>
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
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)]"
              style={{ background: 'var(--bg-card)' }}>
              <div className="h-2 w-2 rounded-full bg-[var(--accent-blue)]"></div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Preview - Draggable, Resizable */}
      <DraggableScreenshotPreview
        preview={screenshotPreview}
        onClose={() => { setScreenshotPreview(null); setInviteWaiting(false); }}
        isWaiting={inviteWaiting}
        type="invite"
      />

      {/* Remove Member Screenshot Preview - Draggable, Resizable */}
      <DraggableScreenshotPreview
        preview={removeScreenshotPreview}
        onClose={() => { setRemoveScreenshotPreview(null); setRemoveWaiting(false); }}
        isWaiting={removeWaiting}
        type="remove"
      />
    </div>
  );
};

export default Teams;
