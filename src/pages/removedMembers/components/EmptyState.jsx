import React from 'react';
import { FaUsers, FaTimes, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const EmptyState = ({ searchEmail, clearSearch }) => {
    return (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
            <div className="text-center py-16 px-8">
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-[var(--bg-surface)] rounded-3xl flex items-center justify-center mx-auto border border-[var(--border-subtle)]">
                        {searchEmail ? (
                            <FaSearch className="w-12 h-12 text-[var(--text-muted)]" />
                        ) : (
                            <FaUsers className="w-12 h-12 text-[var(--text-muted)]" />
                        )}
                    </div>
                    {searchEmail && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--warning)]/10 rounded-full flex items-center justify-center">
                            <FaExclamationTriangle className="w-4 h-4 text-[var(--warning)]" />
                        </div>
                    )}
                </div>

                <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {searchEmail ? 'No Results Found' : 'No Removed Members'}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                        {searchEmail
                            ? `We couldn't find any removed members matching "${searchEmail}". Try adjusting your search terms or clearing the filter.`
                            : 'Great! There are currently no removed members in your system. All team members are active.'
                        }
                    </p>

                    {searchEmail && (
                        <div className="space-y-3">
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--accent-blue)] text-white rounded-xl font-medium hover:bg-[var(--accent-blue)]/90 transition-all duration-200"
                            >
                                <FaTimes className="w-4 h-4" />
                                Clear Search & Show All
                            </button>

                            <div className="text-sm text-[var(--text-tertiary)]">
                                or try searching for a different term
                            </div>
                        </div>
                    )}

                    {!searchEmail && (
                        <div className="bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-xl p-4 mt-6">
                            <div className="flex items-center justify-center space-x-2 text-[var(--success)]">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">All members are active</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyState;