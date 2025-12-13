import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import handleApi from "../../libs/handleAPi";

// Import components
import PageHeader from "./component/PageHeader";
import StatsSummary from "./component/StatsSummary";
import SearchSection from "./component/SearchSection";
import HistoryCard from "./component/HistoryCard";
import LoadingSkeleton from "./component/LoadingSkeleton";
import EmptyState from "./component/EmptyState";
import Pagination from "./component/Pagination";

const SubscriptionEndMembers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const limit = 10;

  const fetchData = useCallback(
    async (page = 1, searchQuery = "") => {
      try {
        setLoading(true);
        const response = await handleApi(
          `/gptTeam/subscription-end-history?page=${page}&limit=${limit}&search=${encodeURIComponent(
            searchQuery
          )}`,
          "GET",
          null,
          navigate
        );

        if (response) {
          setData(response.subscriptionEndHistory || []);
          setTotalCount(response.total || 0);
          setTotalPages(Math.ceil((response.total || 0) / limit));
        }
      } catch (error) {
        console.error("Error fetching subscription end history:", error);
        setData([]);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchData(currentPage, search);
  }, [currentPage, fetchData]);

  const handleSearch = useCallback(
    (searchQuery) => {
      setIsSearching(true);
      setCurrentPage(1);
      setSearch(searchQuery);
      fetchData(1, searchQuery);
    },
    [fetchData]
  );

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchData(1, "");
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchData(page, search);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>Subscription End History</title>
      </Helmet>

      <PageHeader />

      <SearchSection
        searchValue={search}
        setSearchValue={setSearch}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        isSearching={isSearching}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <StatsSummary
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Content */}
      <div className="space-y-6">
        {loading ? (
          <LoadingSkeleton />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-4">
              {data.map((item) => (
                <HistoryCard key={item._id} item={item} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionEndMembers;
