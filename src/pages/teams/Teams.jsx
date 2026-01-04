import React, { useState, useEffect, useCallback, useMemo } from "react";
import handleApi from "../../libs/handleAPi";
import {
  FaExclamationCircle,
  FaSearch,
  FaExclamationTriangle,
  FaCopy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Import our new components
import SearchBar from "./components/SearchBar";
import TeamStats from "./components/TeamStats";
import EmptyState from "./components/EmptyState";
import LoadingGrid from "./components/LoadingGrid";
import TeamGrid from "./components/TeamGrid";
import { Helmet } from "react-helmet";

// Duplicate Members Card Component
const DuplicateMembersCard = ({ duplicateMembers }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);

  const handleCopyAll = () => {
    const emailsText = duplicateMembers.join("\n");
    navigator.clipboard.writeText(emailsText);
    setCopied(true);
    toast.success("Duplicate emails copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmail = (email, index) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(index);
    toast.success("Email copied!");
    setTimeout(() => setCopiedEmail(null), 1500);
  };

  const displayMembers = isExpanded
    ? duplicateMembers
    : duplicateMembers.slice(0, 5);
  const hasMore = duplicateMembers.length > 5;

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <FaExclamationTriangle className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800">
                  Duplicate Members Detected
                </h3>
                <p className="text-sm text-amber-600">
                  {duplicateMembers.length} member
                  {duplicateMembers.length !== 1 ? "s" : ""} found in multiple
                  teams
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${copied
                ? "bg-green-500 text-white"
                : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-300"
                }`}
            >
              <FaCopy className="text-sm" />
              {copied ? "Copied!" : "Copy All"}
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {displayMembers.map((email, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <span
                  className="text-gray-700 text-sm font-medium truncate flex-1"
                  title={email}
                >
                  {email}
                </span>
                <button
                  onClick={() => handleCopyEmail(email, index)}
                  className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${copiedEmail === index
                    ? "bg-green-500 text-white"
                    : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                    }`}
                  title="Copy email"
                >
                  <FaCopy className="text-xs" />
                </button>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200"
              >
                {isExpanded ? (
                  <>
                    <FaChevronUp className="text-sm" />
                    Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown className="text-sm" />
                    Show {duplicateMembers.length - 5} More
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Teams = () => {
  const [data, setData] = useState([]);
  const [inActiveData, setInActiveData] = useState([]);
  const [totalCount, setTotalCount] = useState({
    totalTeams: 0,
    totalMembers: 0,
    totalActiveTeams: 0,
    totalInactiveTeams: 0
  })
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
  // Filters by both main search and inactive-specific search
  const filteredInactiveData = useMemo(() => {
    if (!Array.isArray(inActiveData)) return [];

    let filtered = inActiveData;

    // Filter by main search (debouncedSearch)
    if (debouncedSearch.trim()) {
      const mainSearchLower = debouncedSearch.toLowerCase().trim();
      filtered = filtered.filter(team =>
        team.gptAccount?.toLowerCase().includes(mainSearchLower) ||
        team.server?.toLowerCase().includes(mainSearchLower) ||
        team.members?.some(member => member.toLowerCase().includes(mainSearchLower))
      );
    }

    // Filter by inactive-specific search
    if (inactiveSearch.trim()) {
      const searchLower = inactiveSearch.toLowerCase().trim();
      filtered = filtered.filter(team =>
        team.gptAccount?.toLowerCase().includes(searchLower) ||
        team.server?.toLowerCase().includes(searchLower) ||
        team.members?.some(member => member.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [inActiveData, inactiveSearch, debouncedSearch]);

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
            totalInactiveTeams: response.totalInactive || 0
          })
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

  console.log(data);
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
            pages.push("...");
            pages.push(totalPages);
          }
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          if (totalPages > 5) {
            pages.push("...");
          }
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Helmet>
          <title>Teams</title>
        </Helmet>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-blue hover:bg-blue-50"
            }`}
        >
          Previous
        </button>

        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${currentPage === page
                  ? "bg-blue text-white"
                  : "text-gray-600 hover:text-blue hover:bg-blue-50"
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
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage >= totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-blue hover:bg-blue-50"
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
      const response = await handleApi(
        `/gptTeam/team/${teamId}/toggle`,
        "PUT",
        {
          isActive: newActiveState,
        }
      );

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
        {
          member: member,
        }
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
        {
          members: emailArray,
          reference,
        }
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
          `${addedCount} member${addedCount === 1 ? "" : "s"
          } added successfully`
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
      setCurrentPage(1); // Reset to first page on search
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
              totalInactiveTeams: response.totalInactive || 0
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
  }, [debouncedSearch, currentPage, filter]); // Added filter as dependency

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
        {/* Inactive Teams Section - Inside All Teams with Red Theme */}
        {inActiveData.length > 0 && (
          <div className="mb-8">
            {/* Red Header Section */}
            <div className="bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 rounded-xl px-6 py-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <FaExclamationCircle className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">
                      Inactive Teams
                    </h3>
                    <p className="text-sm text-red-600">
                      {inactiveSearch ? (
                        <>{filteredInactiveData.length} of {inActiveData.length} team{inActiveData.length !== 1 ? "s" : ""} shown</>
                      ) : (
                        <>{inActiveData.length} team{inActiveData.length !== 1 ? "s" : ""} currently inactive</>
                      )}
                    </p>
                  </div>
                </div>
                {/* Search Input for Inactive Teams */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    placeholder="Search inactive teams..."
                    value={inactiveSearch}
                    onChange={(e) => setInactiveSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-sm w-full sm:w-64"
                  />
                  {inactiveSearch && (
                    <button
                      onClick={() => setInactiveSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Inactive Teams Grid */}
            {filteredInactiveData.length > 0 ? (
              <TeamGrid
                teams={filteredInactiveData}
                onToggleActive={handleToggleActive}
                onRemoveMember={handleRemoveMember}
                onAddMembers={handleAddMembers}
                togglingTeam={togglingTeam}
              />
            ) : (
              <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                <FaSearch className="mx-auto text-red-300 text-3xl mb-3" />
                <p className="text-red-600 font-medium">No inactive teams match "{inactiveSearch}"</p>
                <button
                  onClick={() => setInactiveSearch("")}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Teams Grid */}
        <TeamGrid
          teams={sortedTeams}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <SearchBar
          search={search}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />

        {/* filter */}
        <div className="relative inline-block">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg font-medium hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="">Filter by Admin</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.username}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Stats Section */}
        {!isLoading && !error && <TeamStats totalCount={totalCount} />}

        {/* Duplicate Members Warning */}
        {!isLoading && !error && duplicateMembers.length > 0 && (
          <DuplicateMembersCard duplicateMembers={duplicateMembers} />
        )}

        {/* Results Info */}
        {!isLoading && !error && sortedTeams.length > 0 && (
          <div className="mb-8">
            <div className="card">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {search ? "Search Results" : "All Teams"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {search ? (
                        <>
                          Showing{" "}
                          <span className="font-semibold">
                            {sortedTeams.length}
                          </span>{" "}
                          teams for "
                          <span className="font-semibold">{search}</span>"
                        </>
                      ) : (
                        <>
                          Showing{" "}
                          <span className="font-semibold">
                            {sortedTeams.length}
                          </span>{" "}
                          of <span className="font-semibold">{totalTeams}</span>{" "}
                          teams
                        </>
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
                      onClick={() => setSearch("")}
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
