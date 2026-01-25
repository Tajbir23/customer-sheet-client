import React from 'react';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';

const ResultsSummary = ({ searchEmail, membersCount, loading }) => {
    if (loading) return null;

    return (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] mb-6 overflow-hidden">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[var(--accent-blue)]/10 rounded-lg flex items-center justify-center">
                            {searchEmail ? (
                                <FaSearch className="w-4 h-4 text-[var(--accent-blue)]" />
                            ) : (
                                <FaInfoCircle className="w-4 h-4 text-[var(--accent-blue)]" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-[var(--text-secondary)]">
                                {searchEmail ? (
                                    <>Search results for "<span className="font-bold text-[var(--accent-blue)]">{searchEmail}</span>"</>
                                ) : (
                                    <>All removed members</>
                                )}
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                {searchEmail ? 'Filtered results' : 'Complete dataset'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                            {membersCount}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                            Result{membersCount !== 1 ? 's' : ''} Found
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsSummary;