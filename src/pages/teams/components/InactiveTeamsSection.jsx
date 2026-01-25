import React from "react";
import TeamGrid from "./TeamGrid";

const InactiveTeamsSection = ({
    inActiveData,
    filteredInactiveData,
    inactiveSearch,
    setInactiveSearch,
    onToggleActive,
    onRemoveMember,
    onAddMembers,
    togglingTeam,
    recentlyToggledTeam,
    recentlyAddedMembers,
    userId,
}) => {
    if (!inActiveData || inActiveData.length === 0) return null;

    return (
        <div className="mb-8 animate-fade-in">
            {/* Header Section */}
            <div className="rounded-xl px-6 py-4 mb-4 border border-[var(--error)]/30"
                style={{ background: 'var(--bg-card)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg"
                            style={{ background: 'var(--error-bg)', color: 'var(--error)' }}>
                            <span className="text-lg font-bold">!</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Inactive Teams</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {inactiveSearch ? (
                                    <>
                                        {filteredInactiveData.length} of {inActiveData.length} team
                                        {inActiveData.length !== 1 ? "s" : ""} shown
                                    </>
                                ) : (
                                    <>
                                        {inActiveData.length} team
                                        {inActiveData.length !== 1 ? "s" : ""} currently inactive
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    {/* Search Input for Inactive Teams */}
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--error)] transition-colors font-bold text-sm">Q</span>
                        <input
                            type="text"
                            placeholder="Search inactive teams..."
                            value={inactiveSearch}
                            onChange={(e) => setInactiveSearch(e.target.value)}
                            className="pl-10 pr-10 py-2.5 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-1 transition-all duration-200"
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-subtle)',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--error)';
                                e.target.style.boxShadow = '0 0 0 1px var(--error)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border-subtle)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {inactiveSearch && (
                            <button
                                onClick={() => setInactiveSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
                            >
                                <span className="font-bold text-sm">X</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Inactive Teams Grid */}
            {filteredInactiveData.length > 0 ? (
                <TeamGrid
                    teams={filteredInactiveData}
                    onToggleActive={onToggleActive}
                    onRemoveMember={onRemoveMember}
                    onAddMembers={onAddMembers}
                    togglingTeam={togglingTeam}
                    recentlyToggledTeam={recentlyToggledTeam}
                    recentlyAddedMembers={recentlyAddedMembers}
                    userId={userId}
                />
            ) : (
                <div className="text-center py-8 rounded-xl border border-dashed border-[var(--border-subtle)]"
                    style={{ background: 'var(--bg-card)' }}>
                    <div className="mx-auto text-[var(--text-tertiary)] text-3xl mb-3 font-bold">?</div>
                    <p className="font-medium text-[var(--text-secondary)]">
                        No inactive teams match "<span className="text-[var(--error)]">{inactiveSearch}</span>"
                    </p>
                    <button
                        onClick={() => setInactiveSearch("")}
                        className="mt-2 text-sm text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
};

export default InactiveTeamsSection;
