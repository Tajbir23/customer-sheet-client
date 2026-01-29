import React from 'react'

const LogsHeader = ({ total }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] font-mono">
                    Monitor Logs
                </h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-2 font-mono text-sm">
                <span className="text-green-500">$</span> tail -f system.log
                <span className="text-gray-500 ml-2">// {total} entries</span>
            </p>
        </div>
    )
}

export default LogsHeader
