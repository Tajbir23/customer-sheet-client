import React from "react";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
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
}) => {
    if (!inActiveData || inActiveData.length === 0) return null;

    return (
        <div className="mb-8">
            {/* Red Header Section */}
            <div className="bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 rounded-xl px-6 py-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                            <FaExclamationCircle className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-800">Inactive Teams</h3>
                            <p className="text-sm text-red-600">
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
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                        <input
                            type="text"
                            placeholder="Search inactive teams..."
                            value={inactiveSearch}
                            onChange={(e) => setInactiveSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-sm w-full sm:w-64"
                        />
                        {inactiveSearch && (
                            <button
                                onClick={() => setInactiveSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                            >
                                ×
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
                />
            ) : (
                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <FaSearch className="mx-auto text-red-300 text-3xl mb-3" />
                    <p className="text-red-600 font-medium">
                        No inactive teams match "{inactiveSearch}"
                    </p>
                    <button
                        onClick={() => setInactiveSearch("")}
                        className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
};

export default InactiveTeamsSection;
