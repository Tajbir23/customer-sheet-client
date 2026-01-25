import React from 'react';


const PageHeader = ({ totalAccounts, totalMembers, totalUniqueMembers, loading }) => {
    return (
        <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-[var(--text-tertiary)] mb-4">
                <span className="w-4 h-4 font-bold">Home</span>
                <span className="w-3 h-3 font-bold">&gt;</span>
                <span className="text-white font-medium">Removed Members</span>
            </nav>

            {/* Header Content */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                        <span className="w-6 h-6 text-[var(--error)] font-bold text-xl">🗑</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Removed Members</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage and track removed team members</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                    {/* Total Accounts */}
                    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--accent-blue)]/10 rounded-lg flex items-center justify-center">
                                <span className="text-[var(--accent-blue)] font-bold">AC</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {loading ? '--' : totalAccounts}
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                                    Total Accounts
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Removed Members */}
                    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--error)]/10 rounded-lg flex items-center justify-center">
                                <span className="text-[var(--error)] font-bold">RM</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--error)]">
                                    {loading ? '--' : totalMembers}
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                                    Removed Members
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Unique Members */}
                    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--warning)]/10 rounded-lg flex items-center justify-center">
                                <span className="text-[var(--warning)] font-bold">UM</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[var(--warning)]">
                                    {loading ? '--' : totalUniqueMembers}
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                                    Unique Members
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;