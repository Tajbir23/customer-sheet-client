import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
    // Convert string date to Date object for DatePicker
    const selectedDate = dateFilter ? new Date(dateFilter) : null

    const handleDateChange = (date) => {
        if (date) {
            // Format to YYYY-MM-DD for API
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            setDateFilter(`${year}-${month}-${day}`)
        } else {
            setDateFilter('')
        }
    }

    return (
        <div
            className="rounded-xl p-4 mb-6 font-mono"
            style={{
                background: '#161b22',
                border: '1px solid #21262d',
            }}
        >
            <style>{`
                .react-datepicker {
                    background: #0d1117 !important;
                    border: 1px solid #30363d !important;
                    font-family: ui-monospace, monospace !important;
                    border-radius: 8px !important;
                }
                .react-datepicker__header {
                    background: #161b22 !important;
                    border-bottom: 1px solid #30363d !important;
                }
                .react-datepicker__current-month,
                .react-datepicker__day-name {
                    color: #c9d1d9 !important;
                }
                .react-datepicker__day {
                    color: #8b949e !important;
                    border-radius: 4px !important;
                }
                .react-datepicker__day:hover {
                    background: #30363d !important;
                    color: #c9d1d9 !important;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                    background: #238636 !important;
                    color: #fff !important;
                }
                .react-datepicker__day--today {
                    background: #21262d !important;
                    color: #58a6ff !important;
                    font-weight: bold !important;
                }
                .react-datepicker__day--outside-month {
                    color: #484f58 !important;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #8b949e !important;
                }
                .react-datepicker__navigation:hover *::before {
                    border-color: #c9d1d9 !important;
                }
                .react-datepicker__triangle {
                    display: none !important;
                }
                .react-datepicker-popper {
                    z-index: 100 !important;
                }
            `}</style>
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

                {/* Date Filter with DatePicker */}
                <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs text-gray-500 mb-2">
                        --date
                    </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date..."
                        isClearable
                        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        wrapperClassName="w-full"
                        calendarClassName="console-calendar"
                        showPopperArrow={false}
                        popperPlacement="bottom-start"
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
