import React from 'react'
import LogsTableRow from './LogsTableRow'

const LogsTable = ({ logs, isLoading, error, hasActiveFilters, currentPage, searchTerm }) => {
    // Calculate starting index for line numbers
    const startIndex = (currentPage - 1) * 10

    return (
        <div
            className="rounded-xl overflow-hidden"
            style={{
                background: '#0d1117',
                border: '1px solid #21262d',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)'
            }}
        >
            {/* Console Header */}
            <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{
                    background: '#161b22',
                    borderColor: '#21262d'
                }}
            >
                {/* Window Controls */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-gray-500 text-sm font-mono">
                    monitor-logs — bash
                </span>
                <span className="ml-auto text-gray-600 text-xs font-mono">
                    {logs.length} entries
                </span>
            </div>

            {/* Console Body */}
            <div
                className="min-h-[400px] max-h-[600px] overflow-y-auto"
                style={{
                    background: '#0d1117',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#30363d #0d1117'
                }}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] font-mono">
                        <div className="text-green-500 animate-pulse text-lg">
                            $ fetching logs...
                        </div>
                        <div className="mt-2 flex gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[400px] font-mono">
                        <span className="text-red-500 text-lg">$ Error: {error}</span>
                        <span className="text-gray-600 mt-2">Press refresh to retry</span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] font-mono">
                        <span className="text-gray-500 text-lg">
                            $ {hasActiveFilters ? 'No logs matching filters' : 'No logs found'}
                        </span>
                        <span className="text-gray-700 mt-2 animate-pulse">_</span>
                    </div>
                ) : (
                    <div className="py-2">
                        {logs.map((log, index) => (
                            <LogsTableRow
                                key={log._id}
                                log={log}
                                index={startIndex + index}
                                searchTerm={searchTerm}
                            />
                        ))}
                        {/* Cursor line */}
                        <div className="flex items-center gap-3 py-2 px-4 font-mono text-sm">
                            <span className="text-gray-600 w-8 text-right">
                                {(startIndex + logs.length + 1).toString().padStart(3, '0')}
                            </span>
                            <span className="text-green-500">$</span>
                            <span className="w-2 h-4 bg-green-500 animate-pulse"></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LogsTable
