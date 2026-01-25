import React from "react";

const ResultsInfo = ({
    search,
    sortedTeamsCount,
    totalTeams,
    currentPage,
    totalPages,
    onClearSearch,
}) => {
    return (
        <div className="mb-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-transparent sm:bg-transparent">
                <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {search ? "Search Results" : "All Teams"}
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1 font-medium">
                        {search ? (
                            <>
                                Showing{" "}
                                <span className="text-[var(--accent-blue)]">{sortedTeamsCount}</span>{" "}
                                teams for "
                                <span className="text-[var(--accent-purple)]">{search}</span>"
                            </>
                        ) : (
                            <>
                                Showing{" "}
                                <span className="text-[var(--accent-blue)]">{sortedTeamsCount}</span> of{" "}
                                <span className="text-[var(--text-primary)]">{totalTeams}</span> teams
                            </>
                        )}
                    </p>
                    {totalPages > 1 && (
                        <p className="text-sm text-[var(--text-tertiary)] mt-1 font-mono">
                            Page {currentPage} of {totalPages}
                        </p>
                    )}
                </div>
                {search && (
                    <button
                        onClick={onClearSearch}
                        className="px-4 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg font-medium transition-colors"
                    >
                        Clear Search
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResultsInfo;
