import React from "react";

const AllTeamsHeader = ({ totalCount }) => {
    return (
        <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 border border-blue-200 rounded-xl px-6 py-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Side - Title & Description */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                All Teams Overview
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage and monitor all your team accounts
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Stats Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Total Teams Badge */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <svg
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">Total</span>
                                <span className="text-lg font-bold text-blue-700">
                                    {totalCount.totalTeams}
                                </span>
                            </div>
                        </div>

                        {/* Active Teams Badge */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                <svg
                                    className="w-4 h-4 text-emerald-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">
                                    Active
                                </span>
                                <span className="text-lg font-bold text-emerald-600">
                                    {totalCount.totalActiveTeams}
                                </span>
                            </div>
                        </div>

                        {/* Inactive Teams Badge */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-1.5 bg-red-100 rounded-lg">
                                <svg
                                    className="w-4 h-4 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium">
                                    Inactive
                                </span>
                                <span className="text-lg font-bold text-red-500">
                                    {totalCount.totalInactiveTeams}
                                </span>
                            </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 rounded-xl shadow-lg">
                            <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-white">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTeamsHeader;
