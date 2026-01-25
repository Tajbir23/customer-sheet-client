import React from "react";


const AllTeamsHeader = ({ totalCount }) => {
    return (
        <div className="mb-6 animate-fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-6 py-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Side - Title & Description */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                            <span className="text-xl font-bold text-[var(--accent-blue)]">T</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                All Teams Overview
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                Manage and monitor all your team accounts
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Stats Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Total Teams Badge */}
                        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)]">
                            <div className="p-1.5 rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                                <span className="font-bold text-xs">T</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-[var(--text-tertiary)] font-bold">Total</span>
                                <span className="text-lg font-bold text-[var(--text-primary)]">
                                    {totalCount.totalTeams}
                                </span>
                            </div>
                        </div>

                        {/* Active Teams Badge */}
                        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)]">
                            <div className="p-1.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)]">
                                <span className="font-bold text-xs">A</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-[var(--text-tertiary)] font-bold">
                                    Active
                                </span>
                                <span className="text-lg font-bold text-[var(--success)]">
                                    {totalCount.totalActiveTeams}
                                </span>
                            </div>
                        </div>

                        {/* Inactive Teams Badge */}
                        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)]">
                            <div className="p-1.5 rounded-lg bg-[var(--error)]/10 text-[var(--error)]">
                                <span className="font-bold text-xs">I</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-[var(--text-tertiary)] font-bold">
                                    Inactive
                                </span>
                                <span className="text-lg font-bold text-[var(--error)]">
                                    {totalCount.totalInactiveTeams}
                                </span>
                            </div>
                        </div>

                        {/* Live Indicator */}
                        <div className="flex items-center gap-2 bg-[var(--bg-elevated)] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)]">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
                            </div>
                            <span className="text-sm font-bold text-[var(--text-secondary)]">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTeamsHeader;
