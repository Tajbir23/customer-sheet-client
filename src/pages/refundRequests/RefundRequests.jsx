import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { FaCopy, FaCheck, FaExternalLinkAlt, FaSearch } from 'react-icons/fa'
import handleApi from '../../libs/handleAPi'

const STATUS_COLORS = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    approved: 'bg-green-500/20 text-green-400 border-green-500/40',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/40'
}

const LOCATION_COLORS = {
    customers: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    checklist: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    team: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
}

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')

const RefundRequests = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const decoded = token ? jwtDecode(token) : {}
    const adminUid = decoded?.id

    const refundLink = `${window.location.origin}/refund-request/${adminUid}`

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(t)
    }, [search])

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append('page', page)
            if (statusFilter) params.append('status', statusFilter)
            if (debouncedSearch) params.append('search', debouncedSearch)

            const res = await handleApi(`/refund-request/list?${params.toString()}`, 'GET', null, navigate)
            if (res?.success) {
                setRequests(res.data || [])
                setTotalPages(res.totalPages || 1)
                setTotal(res.total || 0)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter, debouncedSearch, navigate])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(refundLink)
            setCopied(true)
            toast.success('Link copied to clipboard')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Failed to copy link')
        }
    }

    const handleStatusChange = async (id, status) => {
        const res = await handleApi(`/refund-request/${id}/status`, 'PUT', { status }, navigate)
        if (res?.success) {
            toast.success(`Marked as ${status}`)
            fetchRequests()
        } else {
            toast.error(res?.message || 'Failed to update')
        }
    }

    return (
        <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
            <Helmet>
                <title>Refund Requests - Customer Sheet</title>
            </Helmet>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                    Refund Requests
                </h1>
                <p className="text-[var(--text-tertiary)] mt-1">
                    Share your refund link and review submissions from customers
                </p>
            </div>

            {/* Link card */}
            <div className="mb-8 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] truncate flex items-center">
                        {refundLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-[var(--accent-blue)] hover:opacity-90"
                    >
                        {copied ? <FaCheck /> : <FaCopy />}
                        <span>{copied ? 'Copied' : 'Copy Link'}</span>
                    </button>
                    <a
                        href={refundLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                    >
                        <FaExternalLinkAlt />
                        <span>Open</span>
                    </a>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-3">
                    This link is unique to your account. Anyone visiting it can submit a refund request.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search by email, bkash, whatsapp..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                    className="px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="text-sm text-[var(--text-tertiary)] mb-3">
                {loading ? 'Loading...' : `${total} request${total === 1 ? '' : 's'}`}
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] animate-pulse" />
                    ))
                ) : requests.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center">
                        <p className="text-[var(--text-tertiary)]">No refund requests yet</p>
                    </div>
                ) : (
                    requests.map((r) => (
                        <div key={r._id} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-lg font-semibold text-[var(--text-primary)]">{r.email}</span>
                                        <span className={`px-2.5 py-0.5 text-xs rounded-full border capitalize ${STATUS_COLORS[r.status] || ''}`}>
                                            {r.status}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Found in database
                                        </p>
                                        {(!r.locations || r.locations.length === 0) ? (
                                            <span className="inline-block px-2.5 py-1 text-xs rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
                                                Not found anywhere
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {r.locations.map((loc, i) => (
                                                    <div
                                                        key={i}
                                                        className={`px-3 py-2 rounded-lg border text-xs ${LOCATION_COLORS[loc.collection] || ''}`}
                                                    >
                                                        <div className="font-semibold mb-1">{loc.label}</div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--text-secondary)]">
                                                            {loc.details?.gptAccount && (
                                                                <span><span className="text-[var(--text-tertiary)]">GPT:</span> {loc.details.gptAccount}</span>
                                                            )}
                                                            {loc.details?.customerName && (
                                                                <span><span className="text-[var(--text-tertiary)]">Name:</span> {loc.details.customerName}</span>
                                                            )}
                                                            {loc.details?.subscriptionEnd && (
                                                                <span><span className="text-[var(--text-tertiary)]">Sub end:</span> {formatDate(loc.details.subscriptionEnd)}</span>
                                                            )}
                                                            {loc.details?.orderDate && (
                                                                <span><span className="text-[var(--text-tertiary)]">Order:</span> {formatDate(loc.details.orderDate)}</span>
                                                            )}
                                                            {typeof loc.details?.isChecked === 'boolean' && (
                                                                <span><span className="text-[var(--text-tertiary)]">Checked:</span> {loc.details.isChecked ? 'Yes' : 'No'}</span>
                                                            )}
                                                            {typeof loc.details?.isResell === 'boolean' && (
                                                                <span><span className="text-[var(--text-tertiary)]">Resell:</span> {loc.details.isResell ? 'Yes' : 'No'}</span>
                                                            )}
                                                            {loc.details?.reseller && (
                                                                <span><span className="text-[var(--text-tertiary)]">Reseller:</span> {loc.details.reseller}</span>
                                                            )}
                                                            {loc.details?.admin && (
                                                                <span><span className="text-[var(--text-tertiary)]">Admin:</span> {loc.details.admin}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                        <div>
                                            <span className="text-[var(--text-tertiary)]">Days used: </span>
                                            <span className="text-[var(--text-primary)]">{r.daysUsed}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--text-tertiary)]">Paid amount: </span>
                                            <span className="text-[var(--text-primary)]">৳{r.paidAmount}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--text-tertiary)]">WhatsApp: </span>
                                            <span className="text-[var(--text-primary)]">{r.whatsappNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--text-tertiary)]">Paid via bKash: </span>
                                            <span className="text-[var(--text-primary)]">{r.bkashPaymentNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--text-tertiary)]">Refund to bKash: </span>
                                            <span className="text-[var(--text-primary)]">{r.bkashRefundNumber}</span>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <span className="text-[var(--text-tertiary)]">Submitted: </span>
                                            <span className="text-[var(--text-primary)]">{new Date(r.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                                    {r.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(r._id, 'approved')}
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {r.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleStatusChange(r._id, 'rejected')}
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    {r.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusChange(r._id, 'pending')}
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30"
                                        >
                                            Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[var(--text-tertiary)]">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default RefundRequests
