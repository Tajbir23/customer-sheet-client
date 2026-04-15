import React, { useEffect, useState, useCallback } from 'react'
import handleApi from '../../libs/handleAPi'
import { Helmet } from 'react-helmet'
import { FaExclamationTriangle, FaSearch, FaSync, FaChevronDown, FaChevronUp, FaCopy, FaCheck } from 'react-icons/fa'

const MissingMembers = () => {
    const [missingMembers, setMissingMembers] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [expandedCards, setExpandedCards] = useState(new Set())
    const [copiedEmail, setCopiedEmail] = useState(null)
    const [references, setReferences] = useState([])
    const [reference, setReference] = useState('')

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await handleApi('/gpt-account/missing-members', 'GET')
            if (response.success) {
                setMissingMembers(response.missingMembers || [])
                setStats(response.stats || null)
            } else {
                setError(response.message || 'Failed to fetch data')
            }
        } catch (err) {
            console.error('Error fetching missing members:', err)
            setError('An error occurred while fetching data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const response = await handleApi('/references')
                if (response.success && response.data) {
                    setReferences(response.data)
                }
            } catch (error) {
                console.error('Error fetching references:', error)
            }
        }
        fetchReferences()
    }, [])

    const toggleCard = (id) => {
        setExpandedCards(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedEmail(text)
            setTimeout(() => setCopiedEmail(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const searchLower = search.toLowerCase().trim()

    const filteredMembers = missingMembers.map(entry => {
        if (!reference) return entry
        // Filter missing members by reference
        const filtered = entry.missingMembers.filter(m =>
            m.reference?._id === reference
        )
        if (filtered.length === 0) return null
        return { ...entry, missingMembers: filtered, missingCount: filtered.length }
    }).filter(entry => {
        if (!entry) return false
        if (!searchLower) return true
        return entry.gptAccount.toLowerCase().includes(searchLower) ||
            entry.missingMembers.some(m => m.email.toLowerCase().includes(searchLower))
    })

    const totalMissingMemberCount = filteredMembers.reduce((sum, e) => sum + e.missingCount, 0)

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Missing Members - Customer Sheet</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20">
                                    <FaExclamationTriangle className="w-6 h-6 text-[var(--error)]" />
                                </div>
                                Missing Members
                            </h1>
                            <p className="text-sm text-[var(--text-secondary)] mt-2">
                                Members in checklist but missing from monitoring server
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90 transition-colors disabled:opacity-50"
                        >
                            <FaSync className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && !loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        <StatCard label="Checklist Accounts" value={stats.totalChecklistAccounts} color="blue" />
                        <StatCard label="Monitor Accounts" value={stats.totalMonitorAccounts} color="purple" />
                        <StatCard label="Matched Accounts" value={stats.matchedAccounts} color="green" />
                        <StatCard label="Accounts w/ Missing" value={stats.accountsWithMissing} color="orange" />
                        <StatCard label="Total Missing Members" value={stats.totalMissingMembers} color="red" />
                    </div>
                )}

                {/* Search & Reference Filter */}
                <div className="mb-6">
                    <div className="flex gap-3 flex-col sm:flex-row">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type="text"
                                placeholder="Search by GPT account or member email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3 rounded-xl font-medium text-sm bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-white transition-colors focus:outline-none focus:border-[var(--accent-blue)] w-full sm:w-auto"
                            >
                                <option value="">All References</option>
                                {references.map((ref) => (
                                    <option key={ref._id} value={ref._id}>
                                        {ref.username || ref.email}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--text-secondary)]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {!loading && !error && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-2">
                            {filteredMembers.length} accounts • {totalMissingMemberCount} missing members
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[var(--border-subtle)] border-t-[var(--accent-blue)] rounded-full animate-spin mb-4"></div>
                        <p className="text-[var(--text-secondary)] font-medium">Comparing checklist with monitoring server...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="rounded-2xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-6 text-center">
                        <FaExclamationTriangle className="w-8 h-8 text-[var(--error)] mx-auto mb-3" />
                        <p className="text-[var(--text-primary)] font-bold mb-2">Error</p>
                        <p className="text-[var(--text-secondary)] text-sm">{error}</p>
                        <button onClick={fetchData} className="mt-4 px-4 py-2 rounded-xl bg-[var(--accent-blue)] text-white text-sm font-bold">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {filteredMembers.length === 0 ? (
                            <div className="rounded-2xl border border-[var(--success)]/20 bg-[var(--success)]/5 p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                                    <FaCheck className="w-8 h-8 text-[var(--success)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                    {search ? 'No Results Found' : 'All Synced!'}
                                </h3>
                                <p className="text-[var(--text-secondary)]">
                                    {search
                                        ? `No missing members matching "${search}".`
                                        : 'All checklist members are present in the monitoring server.'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredMembers.map(entry => (
                                    <MissingMemberCard
                                        key={entry._id}
                                        entry={entry}
                                        expanded={expandedCards.has(entry._id)}
                                        onToggle={() => toggleCard(entry._id)}
                                        onCopy={handleCopy}
                                        copiedEmail={copiedEmail}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Footer */}
                {!loading && !error && filteredMembers.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)]"
                            style={{ background: 'var(--bg-card)' }}>
                            <div className="h-2 w-2 rounded-full bg-[var(--error)]"></div>
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                                Last checked: {new Date().toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Sub Components ──────────────────────────────────────────

const StatCard = ({ label, value, color }) => {
    const colorMap = {
        blue: 'var(--accent-blue)',
        purple: 'var(--accent-purple)',
        red: 'var(--error)',
        orange: 'var(--warning)',
        green: 'var(--success)'
    }
    const c = colorMap[color] || colorMap.blue

    return (
        <div className="rounded-xl border border-[var(--border-subtle)] glass p-4">
            <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color: c }}>{value}</p>
        </div>
    )
}

const MissingMemberCard = ({ entry, expanded, onToggle, onCopy, copiedEmail }) => {
    return (
        <div className="rounded-2xl border border-[var(--warning)]/30 overflow-hidden glass">
            <div
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[var(--warning)]/5 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/20 shrink-0">
                        <span className="text-[var(--warning)] font-bold text-sm">@</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[var(--text-primary)] truncate">{entry.gptAccount}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); onCopy(entry.gptAccount); }}
                                className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors shrink-0"
                                title="Copy GPT account"
                            >
                                {copiedEmail === entry.gptAccount ? <FaCheck className="w-3 h-3 text-[var(--success)]" /> : <FaCopy className="w-3 h-3" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-[var(--text-tertiary)]">
                                Checklist: <span className="text-[var(--text-secondary)] font-medium">{entry.totalChecklistMembers}</span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                                Monitor: <span className="text-[var(--text-secondary)] font-medium">{entry.totalMonitorMembers}</span>
                            </span>
                            {entry.monitorServer && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                                    <span className="text-xs text-[var(--accent-blue)] font-medium">{entry.monitorServer}</span>
                                </>
                            )}
                            {entry.monitorIsActive !== undefined && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                                    <span className={`text-xs font-medium ${entry.monitorIsActive ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                                        {entry.monitorIsActive ? 'Active' : 'Inactive'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20">
                        {entry.missingCount} missing
                    </span>
                    {expanded ? <FaChevronUp className="text-[var(--text-tertiary)]" /> : <FaChevronDown className="text-[var(--text-tertiary)]" />}
                </div>
            </div>

            {expanded && (
                <div className="border-t border-[var(--warning)]/20 px-5 py-4 space-y-2">
                    {entry.missingMembers.map((m, i) => (
                        <MemberRow key={i} email={m.email} reference={m.reference} isChecked={m.isChecked} gptAccount={entry.monitorGptAccount || entry.gptAccount} onCopy={onCopy} copiedEmail={copiedEmail} />
                    ))}
                </div>
            )}
        </div>
    )
}

const MemberRow = ({ email, reference, isChecked, gptAccount, onCopy, copiedEmail }) => (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-2 h-2 rounded-full shrink-0 ${isChecked ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`}></div>
            <div className="min-w-0 flex-1">
                <span className="text-sm text-[var(--text-primary)] truncate font-medium block">{email}</span>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {reference && (
                        <span className="text-[10px] font-bold text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-1.5 py-0.5 rounded">
                            {reference.username || reference.email || 'N/A'}
                        </span>
                    )}
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                        missing in <span className="font-medium text-[var(--warning)]">{gptAccount}</span>
                    </span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(email); }}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
                {copiedEmail === email ? <FaCheck className="w-3 h-3 text-[var(--success)]" /> : <FaCopy className="w-3 h-3" />}
            </button>
        </div>
    </div>
)

export default MissingMembers
