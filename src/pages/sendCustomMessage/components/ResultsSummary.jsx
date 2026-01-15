import React from 'react'

const ResultsSummary = ({ totalCount, selectedCount, onClearSelection }) => {
    return (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
                <p className="text-blue-800 font-medium">
                    {totalCount} customer{totalCount !== 1 ? 's' : ''} found
                    {selectedCount > 0 && ` • ${selectedCount} selected`}
                </p>
                {selectedCount > 0 && (
                    <button
                        onClick={onClearSelection}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                    >
                        Clear selection
                    </button>
                )}
            </div>
        </div>
    )
}

export default ResultsSummary
