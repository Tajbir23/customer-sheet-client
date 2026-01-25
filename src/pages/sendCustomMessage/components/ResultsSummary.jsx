import React from 'react'

const ResultsSummary = ({ totalCount, selectedCount, onClearSelection }) => {
    return (
        <div className="mb-6 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl">
            <div className="flex items-center justify-between">
                <p className="text-[var(--text-secondary)] font-medium">
                    <span className="text-white font-bold">{totalCount}</span> customer{totalCount !== 1 ? 's' : ''} found
                    {selectedCount > 0 && (
                        <span className="ml-2 text-[var(--accent-blue)]">
                            • {selectedCount} selected
                        </span>
                    )}
                </p>
                {selectedCount > 0 && (
                    <button
                        onClick={onClearSelection}
                        className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] font-medium text-sm hover:underline transition-colors"
                    >
                        Clear selection
                    </button>
                )}
            </div>
        </div>
    )
}

export default ResultsSummary
