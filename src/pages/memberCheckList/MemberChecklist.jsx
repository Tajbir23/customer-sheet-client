import React, { useEffect, useState, useCallback } from 'react'
import handleApi from '../../libs/handleAPi'
import GptAccountCard from './components/GptAccountCard'
import { FaSearch, FaTimes, FaUsers, FaChartBar, FaFilter, FaDownload, FaCog } from 'react-icons/fa'

const MemberChecklist = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [isSearching, setIsSearching] = useState(false)

    const fetchData = useCallback(async (searchEmail = '', page = 1) => {
        try {
            setLoading(true)
            const response = await handleApi(`/gpt-account/member-checklist?page=${page}&email=${searchEmail}`)
            if (response.memberChecklist) {
                setData(response.memberChecklist)
                setTotalPages(response.pagination?.totalPages || 1)
                setTotalItems(response.pagination?.totalItems || 0)
                setCurrentPage(response.pagination?.currentPage || page)
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
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

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
    const totalMembers = data.reduce((sum, account) => sum + account.members.length, 0)
    const activeAccounts = data.filter(account => account.members.length > 0).length

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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-blue hover:bg-blue-50'
                    }`}
                >
                    Previous
                </button>

                {visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${
                                    currentPage === page
                                        ? 'bg-blue text-white'
                                        : 'text-gray-600 hover:text-blue hover:bg-blue-50'
                                }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage >= totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-blue hover:bg-blue-50'
                    }`}
                >
                    Next
                </button>
            </div>
        )
    }

    if (loading && currentPage === 1) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading member checklist...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Title Section */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaUsers className="h-6 w-6 text-blue" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Member Checklist</h1>
                                    <p className="text-gray-600 text-sm">Manage and monitor all member accounts</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <FaChartBar className="h-4 w-4 text-blue" />
                                    <div>
                                        <p className="text-xs text-gray-600">Total Accounts</p>
                                        <p className="text-lg font-semibold text-gray-900">{data.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                                <div className="flex items-center gap-2">
                                    <FaUsers className="h-4 w-4 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Total Members</p>
                                        <p className="text-lg font-semibold text-gray-900">{totalMembers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg px-4 py-3 border border-orange-100">
                                <div className="flex items-center gap-2">
                                    <FaCog className="h-4 w-4 text-orange-600" />
                                    <div>
                                        <p className="text-xs text-gray-600">Active Accounts</p>
                                        <p className="text-lg font-semibold text-gray-900">{activeAccounts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters Section */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Form */}
                        <div className="flex-1">
                            <form onSubmit={handleSearchSubmit} className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaSearch className="h-5 w-5 text-gray-400 group-focus-within:text-blue transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by email address..."
                                        className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red transition-colors"
                                        >
                                            <FaTimes className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-blue-500 transition-all duration-200 ${
                                            isSearching
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue hover:bg-blue-600'
                                        }`}
                                    >
                                        {isSearching ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <FaSearch className="h-4 w-4" />
                                                Search
                                            </>
                                        )}
                                    </button>

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                            Clear
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <FaFilter className="h-4 w-4" />
                                        Filter
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <FaDownload className="h-4 w-4" />
                                        Export
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Search Suggestions */}
                        <div className="lg:w-80">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Search</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => {
                                                setSearch(suggestion)
                                                handleSearch(suggestion)
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 hover:bg-blue-50 hover:text-blue transition-colors border border-gray-200 hover:border-blue-200"
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
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FaUsers className="text-blue h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {search ? `Search results for "${search}"` : 'All Member Accounts'}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {data.length} account{data.length !== 1 ? 's' : ''} found
                                            {totalMembers > 0 && ` • ${totalMembers} total members`}
                                        </p>
                                    </div>
                                </div>
                                {totalPages > 1 && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            Page {currentPage} of {totalPages}
                                        </p>
                                        <p className="text-xs text-gray-600">
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
                            <div key={index} className="card">
                                <div className="card-body">
                                    <div className="animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="card max-w-lg mx-auto">
                            <div className="card-body text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FaUsers className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {search ? 'No Results Found' : 'No Accounts Available'}
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {search 
                                        ? `We couldn't find any accounts matching "${search}". Try adjusting your search terms or browse all accounts.`
                                        : 'No member checklists are currently available. Check back later or contact support if this seems incorrect.'
                                    }
                                </p>
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="btn btn-primary"
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
                                <div key={account._id} className="fade-in">
                                    <GptAccountCard accountData={account} />
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