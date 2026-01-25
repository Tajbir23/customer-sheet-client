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
  const [endDate, setEndDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const limit = 10;

  const fetchData = useCallback(
    async (page = 1, searchQuery = "", endDateFilter = "", orderDateFilter = "") => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        if (searchQuery) {
          params.append("search", searchQuery.trim());
        }
        if (endDateFilter) {
          params.append("endDate", endDateFilter);
        }
        if (orderDateFilter) {
          params.append("orderDate", orderDateFilter);
        }

        const response = await handleApi(
          `/gptTeam/subscription-end-history?${params.toString()}`,
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
    fetchData(currentPage, search, endDate, orderDate);
  }, [currentPage, fetchData]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setCurrentPage(1);
    fetchData(1, search, endDate, orderDate);
  }, [fetchData, search, endDate, orderDate]);

  const clearSearch = () => {
    setSearch("");
    setEndDate("");
    setOrderDate("");
    setCurrentPage(1);
    fetchData(1, "", "", "");
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchData(page, search, endDate, orderDate);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Subscription End History - Customer Sheet</title>
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
        endDate={endDate}
        setEndDate={setEndDate}
        orderDate={orderDate}
        setOrderDate={setOrderDate}
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
              {data.map((item, index) => (
                <HistoryCard key={item._id} item={item} index={index} />
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
