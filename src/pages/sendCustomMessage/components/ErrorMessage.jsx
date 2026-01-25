import React from 'react'

const ErrorMessage = ({ error }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-deepest)] flex items-center justify-center">
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-xl p-6 text-[var(--error)]">
                {error}
            </div>
        </div>
    )
}

export default ErrorMessage
