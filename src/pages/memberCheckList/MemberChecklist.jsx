import React, { useEffect, useState, useCallback } from 'react'
import handleApi from '../../libs/handleAPi'
import GptAccountCard from './components/GptAccountCard'
import { Helmet } from 'react-helmet'

const MemberChecklist = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [totalGptAccounts, setTotalGptAccounts] = useState(0)
    const [totalMembers, setTotalMembers] = useState(0)
    const [isSearching, setIsSearching] = useState(false)

    const [reference, setReference] = useState('')
    const [references, setReferences] = useState([]) // Store fetched references

    console.log(data)

    const fetchData = useCallback(async (searchEmail = '', page = 1) => {
        try {
            setLoading(true)
            const response = await handleApi(`/gpt-account/member-checklist?page=${page}&email=${searchEmail}&reference=${reference}`)
            console.log(response)
            if (response.memberChecklist) {
                setData(response.memberChecklist)
                setTotalPages(response.pagination?.totalPages || 1)
                setTotalItems(response.pagination?.totalItems || 0)
                setCurrentPage(response.pagination?.currentPage || page)
                setTotalGptAccounts(response.pagination?.totalGptAccounts || 0)
                setTotalMembers(response.pagination?.totalMembers || 0)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            setData([])
            setTotalPages(1)
            setTotalItems(0)
        } finally {
            setLoading(false)
            setIsSearching(false)
        }
    }, [reference]) // Added reference dependency


    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            if (!isMounted) return
            await fetchData()
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [fetchData])

    // Fetch references on component mount
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


    const handleSearch = useCallback((searchValue) => {
        setIsSearching(true)
        setCurrentPage(1)
        fetchData(searchValue, 1)
    }, [fetchData])

    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            fetchData(search, page)
        }
    }

    const clearSearch = () => {
        setSearch('')
        setCurrentPage(1)
        handleSearch('')
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        handleSearch(search)
    }

    // Calculate stats

    const activeAccounts = totalGptAccounts

    // Pagination Component
    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null

        const getVisiblePages = () => {
            const pages = []
            const showPages = 5

            if (totalPages <= showPages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i)
                    }
                    if (totalPages > 5) {
                        pages.push('...')
                        pages.push(totalPages)
                    }
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    if (totalPages > 5) {
                        pages.push('...')
                    }
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push('...')
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages)
                }
            }

            return pages
        }

        const visiblePages = getVisiblePages()

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === 1
                        ? 'text-[var(--text-muted)] cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
                        }`}
                    style={{ border: '1px solid var(--border-subtle)' }}
                >
                    Previous
                </button>

                {visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2 text-[var(--text-muted)]">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-300 ${currentPage === page
                                    ? 'text-white shadow-lg'
                                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
                                    }`}
                                style={{
                                    background: currentPage === page
                                        ? 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)'
                                        : undefined,
                                    border: currentPage === page ? 'none' : '1px solid var(--border-subtle)',
                                    boxShadow: currentPage === page ? '0 4px 15px rgba(139, 92, 246, 0.4)' : undefined,
                                }}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage >= totalPages
                        ? 'text-[var(--text-muted)] cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
                        }`}
                    style={{ border: '1px solid var(--border-subtle)' }}
                >
                    Next
                </button>
            </div>
        )
    }

    if (loading && currentPage === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="mx-auto font-bold text-lg text-[var(--accent-blue)]">Loading...</div>
                    <p className="mt-4 text-[var(--text-secondary)] font-medium">Loading member checklist...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Member Checklist</title>
            </Helmet>
            {/* Page Header */}
            <div className="mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Title Section */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                                    <span className="h-6 w-6 text-[var(--accent-blue)] font-bold text-xl">#</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Member Checklist</h1>
                                    <p className="text-[var(--text-secondary)] text-sm">Manage and monitor team member status</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex flex-wrap gap-4">
                            <div className="rounded-xl px-5 py-3 glass shadow-sm hover:border-[var(--accent-blue)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--accent-blue)]/10">
                                        <span className="h-4 w-4 text-[var(--accent-blue)] font-bold text-xs">A</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">Total Accounts</p>
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{totalGptAccounts}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl px-5 py-3 glass shadow-sm hover:border-[var(--accent-green)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--accent-green)]/10">
                                        <span className="h-4 w-4 text-[var(--accent-green)] font-bold text-xs">M</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">Total Members</p>
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{totalMembers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl px-5 py-3 border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--accent-orange)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[var(--accent-orange)]/10">
                                        <span className="h-4 w-4 text-[var(--accent-orange)] font-bold text-xs">AC</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">Active Accounts</p>
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{activeAccounts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters Section */}
            <div className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Form */}
                        <div className="flex-1">
                            <form onSubmit={handleSearchSubmit} className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="h-5 w-5 text-[var(--text-muted)] font-bold text-sm">Q</span>
                                    </div>
                                    <input
                                        type="email"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by email address..."
                                        className="block w-full pl-12 pr-12 py-3 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all duration-200 placeholder-[var(--text-muted)]"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-white transition-colors"
                                        >
                                            <span className="h-5 w-5 font-bold text-sm">X</span>
                                        </button>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm text-white transition-all duration-200 ${isSearching
                                            ? 'bg-[var(--bg-elevated)] cursor-not-allowed text-[var(--text-muted)]'
                                            : 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] hover:shadow-lg hover:shadow-blue-500/20'
                                            }`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Search</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="relative">
                                        <select
                                            value={reference}
                                            onChange={(e) => {
                                                setReference(e.target.value)
                                                // Trigger search/filter update logic if needed immediately or rely on fetchData dependency (if implemented)
                                                // Ideally, we might want to manually trigger a refetch here or let a useEffect handle it if reference is in dependency
                                                // But fetchData is useCallback dependent on nothing currently in original code, 
                                                // and we updated fetchData to include reference in URL but we need to ensure it re-runs.
                                                // However, since fetchData is passed to useEffect, we should adding reference to its dependency or rely on a separate effect.
                                                // Given the existing pattern, let's just update the state.
                                                // Wait... the original fetchData didn't depend on reference.
                                                // We need to update fetchData dependency array or call it explicitly.
                                                // Let's call fetchData explicitly here for immediate reaction, similar to handleSearch.
                                                // Actually, better to just update state and let a useEffect or similar handle it, 
                                                // BUT existing code structure relies on manual calls mostly + one initial useEffect.
                                                // So I will fix fetchData dependency below as well. 
                                            }}
                                            className="appearance-none pl-4 pr-10 py-2 rounded-xl font-medium text-sm bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-white transition-colors focus:outline-none focus:border-[var(--accent-blue)]"
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


                                    {search && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--text-secondary)] hover:text-white transition-colors"
                                        >
                                            <span className="font-bold text-sm">X</span>
                                            Clear
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--text-secondary)] hover:text-white transition-colors"
                                    >
                                        <span className="font-bold text-sm">F</span>
                                        Filter
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--text-secondary)] hover:text-white transition-colors"
                                    >
                                        <span className="font-bold text-sm">D</span>
                                        Export
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Search Suggestions */}
                        <div className="lg:w-80">
                            <div className="glass rounded-xl p-4">
                                <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Quick Search</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => {
                                                setSearch(suggestion)
                                                handleSearch(suggestion)
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {(search || data.length > 0) && (
                        <div className="mt-4 px-4 py-3 bg-[var(--accent-blue)]/5 rounded-xl border border-[var(--accent-blue)]/20">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-[var(--accent-blue)]/20 rounded-lg">
                                        <span className="text-[var(--accent-blue)] font-bold text-xs">M</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--text-primary)]">
                                            {search ? `Search results for "${search}"` : 'All Member Accounts'}
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            {data.length} account{data.length !== 1 ? 's' : ''} found
                                            {totalMembers > 0 && ` • ${totalMembers} total members`}
                                        </p>
                                    </div>
                                </div>
                                {totalPages > 1 && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-[var(--text-secondary)]">
                                            Page <span className="text-[var(--text-primary)] font-bold">{currentPage}</span> of {totalPages}
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)]">
                                            Showing {Math.min(((currentPage - 1) * 10) + 1, totalItems)}-{Math.min(currentPage * 10, totalItems)} of {totalItems}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="rounded-xl glass p-6">
                                <div className="card-body">
                                    <div>
                                        <div className="h-6 bg-[var(--bg-surface)] rounded mb-4 w-1/3"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-[var(--bg-surface)] rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="max-w-lg mx-auto p-8 rounded-2xl glass">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-[var(--bg-surface)] rounded-full flex items-center justify-center">
                                    <span className="text-[var(--text-muted)] font-bold text-2xl">?</span>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                    {search ? 'No Results Found' : 'No Accounts Available'}
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-6">
                                    {search
                                        ? `We couldn't find any accounts matching "${search}". Try adjusting your search terms or browse all accounts.`
                                        : 'No member checklists are currently available. Check back later or contact support if this seems incorrect.'
                                    }
                                </p>
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="px-6 py-2 rounded-xl font-bold text-sm bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90 transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        View All Accounts
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Account Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {data.map((account) => (
                                <div key={account._id}>
                                    <GptAccountCard accountData={account} data={data} setData={setData} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default MemberChecklist