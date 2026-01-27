import React from 'react';


const SearchSection = ({
    searchEmail,
    setSearchEmail,
    handleSearch,
    clearSearch,
    isSearching,
    currentPage,
    totalPages
}) => {
    return (
        <div className="glass rounded-2xl border border-[var(--border-subtle)] mb-8 overflow-hidden">
            {/* Header */}
            <div className="bg-transparent px-6 py-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--text-primary)]">Search & Filter</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-[var(--text-tertiary)]">
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
                            <span className="h-5 w-5 text-[var(--text-tertiary)] font-bold flex items-center justify-center">Q</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by GPT account or member email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchEmail)}
                            className="w-full pl-12 pr-12 py-4 text-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all duration-200 text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                        />
                        {searchEmail && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <span className="h-5 w-5 font-bold">X</span>
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleSearch(searchEmail)}
                                disabled={isSearching}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${isSearching
                                    ? 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] cursor-not-allowed'
                                    : 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90'
                                    }`}
                            >
                                <span className="w-4 h-4 font-bold">Q</span>
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>

                            {searchEmail && (
                                <button
                                    onClick={clearSearch}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-xl font-medium hover:bg-[var(--bg-hover)] transition-all duration-200"
                                >
                                    <span className="w-4 h-4 font-bold">X</span>
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Additional Actions */}
                        <div className="flex items-center space-x-3">
                            <button className="inline-flex items-center gap-2 px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200">
                                <span className="w-4 h-4 font-bold">F</span>
                                <span className="hidden sm:inline">Filter</span>
                            </button>
                            <button className="inline-flex items-center gap-2 px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-all duration-200">
                                <span className="w-4 h-4 font-bold">↓</span>
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Search Suggestions */}
                    {!searchEmail && (
                        <div className="pt-4 border-t border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-tertiary)] mb-3">Quick suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                                {['@gmail.com', '@proton.me', '@yahoo.com'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setSearchEmail(suggestion)}
                                        className="px-3 py-1.5 text-sm bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchSection;