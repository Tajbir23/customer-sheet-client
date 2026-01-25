import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-deepest)] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--border-subtle)] border-t-[var(--accent-blue)] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)] text-lg">Loading customers...</p>
            </div>
        </div>
    )
}

export default LoadingSpinner
