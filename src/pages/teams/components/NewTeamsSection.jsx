import React from "react";
import TeamGrid from "./TeamGrid";

const NewTeamsSection = ({
    newTeams,
    onToggleActive,
    onRemoveMember,
    onAddMembers,
    togglingTeam,
    recentlyToggledTeam,
    recentlyAddedMembers,
    userId,
}) => {
    if (!newTeams || newTeams.length === 0) return null;

    // Calculate days since creation for each team
    const getTeamAge = (orderDate) => {
        const now = new Date();
        const created = new Date(orderDate);
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="mb-8 animate-fade-in">
            {/* Header Section */}
            <div className="rounded-xl px-6 py-4 mb-4 border border-[var(--success)]/30"
                style={{ background: 'var(--bg-card)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg"
                            style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <span className="text-lg font-bold">+</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">New Teams (Last 7 Days)</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {newTeams.length} new team{newTeams.length !== 1 ? "s" : ""} added recently
                            </p>
                        </div>
                    </div>
                    {/* Badge showing count */}
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                                background: 'var(--success-bg)',
                                color: 'var(--success)',
                                border: '1px solid var(--success)'
                            }}>
                            {newTeams.length} New
                        </span>
                    </div>
                </div>
            </div>

            {/* New Teams Grid */}
            <TeamGrid
                teams={newTeams}
                onToggleActive={onToggleActive}
                onRemoveMember={onRemoveMember}
                onAddMembers={onAddMembers}
                togglingTeam={togglingTeam}
                recentlyToggledTeam={recentlyToggledTeam}
                recentlyAddedMembers={recentlyAddedMembers}
                userId={userId}
                isNewTeam={true}
            />
        </div>
    );
};

export default NewTeamsSection;
