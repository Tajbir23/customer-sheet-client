import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchSection = ({
  searchValue,
  setSearchValue,
  handleSearch,
  clearSearch,
  isSearching,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Search & Filter</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
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
              placeholder="Search by GPT account or member email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchValue)}
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500 focus:ring-opacity-10 transition-all duration-200 placeholder-gray-400"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSearch(searchValue)}
              disabled={isSearching}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isSearching
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              <FaSearch className="w-4 h-4" />
              {isSearching ? "Searching..." : "Search"}
            </button>

            {searchValue && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                <FaTimes className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
