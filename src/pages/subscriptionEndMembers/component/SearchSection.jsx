import React from "react";


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
    <div
      className="rounded-2xl mb-8 overflow-hidden animate-fade-in-up"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="font-bold">Search</span>
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
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[var(--text-muted)] group-focus-within:text-[var(--accent-purple)] transition-colors font-bold">Q</span>
            </div>
            <input
              type="text"
              placeholder="Search by email, GPT account, or WhatsApp/FB ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-12 py-4 text-lg rounded-xl text-white placeholder-[var(--text-muted)] transition-all duration-300"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-purple)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <span className="font-bold">X</span>
              </button>
            )}
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* End Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <span className="inline mr-2 text-[var(--error)] font-bold">Date:</span>
                Subscription End Date (before)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  colorScheme: 'dark',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-purple)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Order Date Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <span className="inline mr-2 text-[var(--accent-purple)] font-bold">Date:</span>
                Order Date (before)
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  colorScheme: 'dark',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-purple)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 text-white"
              style={{
                background: isSearching
                  ? 'var(--bg-surface)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                color: isSearching ? 'var(--text-muted)' : 'white',
                boxShadow: isSearching ? 'none' : '0 8px 20px -8px rgba(239, 68, 68, 0.5)',
                cursor: isSearching ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px -8px rgba(239, 68, 68, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isSearching ? 'none' : '0 8px 20px -8px rgba(239, 68, 68, 0.5)';
              }}
            >
              <span className="font-bold">Search</span>
              {isSearching ? "Searching..." : "Search"}
            </button>

            {hasFilters && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span className="font-bold">X</span>
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchValue && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Search: "{searchValue}"
                  <button onClick={() => setSearchValue("")} className="ml-1 hover:text-white transition-colors">
                    <span className="font-bold text-xs">x</span>
                  </button>
                </span>
              )}
              {endDate && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  End Date: ≤ {endDate}
                  <button onClick={() => setEndDate("")} className="ml-1 hover:text-white transition-colors">
                    <span className="font-bold text-xs">x</span>
                  </button>
                </span>
              )}
              {orderDate && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  Order Date: ≤ {orderDate}
                  <button onClick={() => setOrderDate("")} className="ml-1 hover:text-white transition-colors">
                    <span className="font-bold text-xs">x</span>
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
