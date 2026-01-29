import React from 'react'

// Function to highlight search matches in text
const highlightSearchMatches = (text, searchTerm) => {
    if (!searchTerm || !text) return text

    try {
        // Escape special regex characters in search term
        const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`(${escapedSearch})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) => {
            if (regex.test(part)) {
                regex.lastIndex = 0
                return (
                    <mark
                        key={index}
                        className="bg-yellow-500/40 text-yellow-200 px-0.5 rounded"
                    >
                        {part}
                    </mark>
                )
            }
            return part
        })
    } catch {
        return text
    }
}

// Function to highlight emails and phone numbers in message
const formatMessageWithHighlights = (message, searchTerm) => {
    if (!message) return null

    // Combined regex for emails and phone numbers
    // Phone: matches patterns like +880123456789, 01712345678, 880-1712-345678, etc.
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    const phoneRegex = /(\+?[0-9]{1,4}[-.\s]?[0-9]{2,4}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,6})/

    // Combined pattern
    const combinedRegex = new RegExp(`(${emailRegex.source}|${phoneRegex.source})`, 'g')

    const parts = message.split(combinedRegex)

    return parts.map((part, index) => {
        if (!part) return null

        // Check if this part is an email
        if (emailRegex.test(part)) {
            const isProtonMail = part.toLowerCase().includes('@proton.me')
            const colorClass = isProtonMail
                ? 'text-pink-400'
                : 'text-cyan-400'

            return (
                <span key={index} className={colorClass}>
                    {highlightSearchMatches(part, searchTerm)}
                </span>
            )
        }

        // Check if this part is a phone number
        if (phoneRegex.test(part)) {
            return (
                <span key={index} className="text-lime-400">
                    {highlightSearchMatches(part, searchTerm)}
                </span>
            )
        }

        // Regular text - highlight search matches
        return <React.Fragment key={index}>{highlightSearchMatches(part, searchTerm)}</React.Fragment>
    })
}

const getLogTypeStyle = (logsType) => {
    const styles = {
        error: { color: '#ef4444', prefix: '[ERROR]' },
        success: { color: '#22c55e', prefix: '[SUCCESS]' },
        message: { color: '#3b82f6', prefix: '[MESSAGE]' },
        removed: { color: '#f97316', prefix: '[REMOVED]' },
        subscriptionEnd: { color: '#eab308', prefix: '[SUB_END]' },
        members: { color: '#a855f7', prefix: '[MEMBERS]' },
        inviteMember: { color: '#06b6d4', prefix: '[INVITE]' },
        whatsapp: { color: '#14b8a6', prefix: '[WHATSAPP]' },
        addMember: { color: '#10b981', prefix: '[ADD_MBR]' },
        default: { color: '#6b7280', prefix: '[LOG]' }
    }
    return styles[logsType] || styles.default
}

const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const pad = (n) => n.toString().padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const LogsTableRow = ({ log, index, searchTerm }) => {
    const logStyle = getLogTypeStyle(log.logsType)

    // Check if log type is error OR message contains error-related keywords
    const isError = log.logsType === 'error' ||
        /error|fail|cannot read|undefined|exception|crash/i.test(log.message)

    return (
        <div className="group flex items-start gap-3 py-2 px-4 hover:bg-white/5 font-mono text-sm border-b border-gray-800/50 transition-colors">
            {/* Line Number */}
            <span className="text-gray-600 select-none w-8 text-right flex-shrink-0">
                {(index + 1).toString().padStart(3, '0')}
            </span>

            {/* Timestamp */}
            <span className="text-gray-500 flex-shrink-0">
                [{formatTimestamp(log.createdAt)}]
            </span>

            {/* Log Type */}
            <span
                className="flex-shrink-0 font-bold"
                style={{ color: logStyle.color }}
            >
                {logStyle.prefix}
            </span>

            {/* Message */}
            <span className={`break-all ${isError ? 'text-red-400' : 'text-gray-300'}`}>
                {formatMessageWithHighlights(log.message, searchTerm)}
            </span>
        </div>
    )
}

export default LogsTableRow
