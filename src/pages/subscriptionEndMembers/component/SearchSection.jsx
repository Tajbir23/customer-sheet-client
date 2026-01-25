import React from "react";
import { FaSearch, FaTimes, FaCalendarAlt } from "react-icons/fa";

const SearchSection = ({
  searchValue,
  setSearchValue,
  handleSearch,
  clearSearch,
  isSearching,
  currentPage,
  totalPages,
  endDate,
  setEndDate,
  orderDate,
  setOrderDate,
}) => {
  const handleClear = () => {
    clearSearch();
    setEndDate("");
    setOrderDate("");
  };

  const hasFilters = searchValue || endDate || orderDate;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FaSearch className="w-4 h-4" />
            Search & Filter
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full">
              Page {currentPage} {totalPages > 1 && `of ${totalPages}`}
            </span>
          </div>
        </div>
      </div>

      {/* Search Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email, GPT account, or WhatsApp/FB ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder-gray-400"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* End Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline w-4 h-4 mr-2 text-red-500" />
                Subscription End Date (before)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
              />
            </div>

            {/* Order Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline w-4 h-4 mr-2 text-purple-500" />
                Order Date (before)
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isSearching
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
            >
              <FaSearch className="w-4 h-4" />
              {isSearching ? "Searching..." : "Search"}
            </button>

            {hasFilters && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                <FaTimes className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchValue && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Search: "{searchValue}"
                  <button onClick={() => setSearchValue("")} className="ml-1 hover:text-orange-900">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  End Date: ≤ {endDate}
                  <button onClick={() => setEndDate("")} className="ml-1 hover:text-red-900">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
              {orderDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Order Date: ≤ {orderDate}
                  <button onClick={() => setOrderDate("")} className="ml-1 hover:text-purple-900">
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
