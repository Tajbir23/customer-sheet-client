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
                                        <span className="font-semibold">{sortedTeamsCount}</span>{" "}
                                        teams for "
                                        <span className="font-semibold">{search}</span>"
                                    </>
                                ) : (
                                    <>
                                        Showing{" "}
                                        <span className="font-semibold">{sortedTeamsCount}</span> of{" "}
                                        <span className="font-semibold">{totalTeams}</span> teams
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
                            <button onClick={onClearSearch} className="btn btn-primary">
                                Clear Search
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsInfo;
