import React from 'react'

// Log types for dropdown filter
const LOG_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'error', label: 'error' },
    { value: 'success', label: 'success' },
    { value: 'message', label: 'message' },
    { value: 'removed', label: 'removed' },
    { value: 'subscriptionEnd', label: 'subscriptionEnd' },
    { value: 'members', label: 'members' },
    { value: 'inviteMember', label: 'inviteMember' },
    { value: 'whatsapp', label: 'whatsapp' },
    { value: 'addMember', label: 'addMember' }
]

const LogsFilters = ({
    logsType,
    setLogsType,
    messageSearch,
    setMessageSearch,
    dateFilter,
    setDateFilter,
    onClearFilters,
    hasActiveFilters
}) => {
    return (
        <div
            className="rounded-xl p-4 mb-6 font-mono"
            style={{
                background: '#161b22',
                border: '1px solid #21262d',
            }}
        >
            <div className="flex flex-wrap gap-4 items-end">
                {/* Log Type Dropdown */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs text-gray-500 mb-2">
                        --type
                    </label>
                    <select
                        value={logsType}
                        onChange={(e) => setLogsType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        style={{
                            background: '#0d1117',
                            border: '1px solid #30363d',
                            color: '#c9d1d9'
                        }}
                    >
                        {LOG_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Message Search */}
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-xs text-gray-500 mb-2">
                        --grep
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">$</span>
                        <input
                            type="text"
                            value={messageSearch}
                            onChange={(e) => setMessageSearch(e.target.value)}
                            placeholder="search pattern..."
                            className="w-full pl-7 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            style={{
                                background: '#0d1117',
                                border: '1px solid #30363d',
                                color: '#c9d1d9'
                            }}
                        />
                    </div>
                </div>

                {/* Date Filter */}
                <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs text-gray-500 mb-2">
                        --date
                    </label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        style={{
                            background: '#0d1117',
                            border: '1px solid #30363d',
                            color: '#c9d1d9'
                        }}
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/20 text-red-400 border border-red-500/30"
                        style={{
                            background: '#0d1117',
                        }}
                    >
                        --reset
                    </button>
                )}
            </div>
        </div>
    )
}

export default LogsFilters
