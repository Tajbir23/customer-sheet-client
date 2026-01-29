import React, { useState, useEffect, useCallback } from 'react'
import handleApi from '../../libs/handleAPi'
import { Helmet } from 'react-helmet'

// Import components
import LogsHeader from './components/LogsHeader'
import LogsFilters from './components/LogsFilters'
import LogsTable from './components/LogsTable'
import LogsPagination from './components/LogsPagination'

const MonitorLogs = () => {
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    // Filter states
    const [logsType, setLogsType] = useState('')
    const [messageSearch, setMessageSearch] = useState('')
    const [debouncedMessage, setDebouncedMessage] = useState('')
    const [dateFilter, setDateFilter] = useState('')

    // Debounce message search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMessage(messageSearch)
            setCurrentPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [messageSearch])

    const fetchLogs = useCallback(async (page = 1) => {
        try {
            setIsLoading(true)
            setError(null)

            // Build query params
            const params = new URLSearchParams()
            params.append('page', page)
            if (logsType) params.append('logsType', logsType)
            if (debouncedMessage) params.append('message', debouncedMessage)
            if (dateFilter) params.append('date', dateFilter)

            const response = await handleApi(`/gptTeam/monitor-logs?${params.toString()}`, 'GET')

            if (response.success) {
                setLogs(response.data || [])
                setTotalPages(response.totalPages || 1)
                setTotal(response.total || 0)
                setCurrentPage(page)
            } else {
                setError(response.message || 'Failed to fetch logs')
            }
        } catch (err) {
            setError('An error occurred while fetching logs')
            console.error('Error fetching monitor logs:', err)
        } finally {
            setIsLoading(false)
        }
    }, [logsType, debouncedMessage, dateFilter])

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchLogs(1)
    }, [logsType, debouncedMessage, dateFilter])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchLogs(page)
        }
    }

    const handleClearFilters = () => {
        setLogsType('')
        setMessageSearch('')
        setDateFilter('')
        setCurrentPage(1)
    }

    const handleLogsTypeChange = (value) => {
        setLogsType(value)
        setCurrentPage(1)
    }

    const handleDateFilterChange = (value) => {
        setDateFilter(value)
        setCurrentPage(1)
    }

    const hasActiveFilters = logsType || messageSearch || dateFilter

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Monitor Logs - Customer Sheet</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LogsHeader total={total} />

                <LogsFilters
                    logsType={logsType}
                    setLogsType={handleLogsTypeChange}
                    messageSearch={messageSearch}
                    setMessageSearch={setMessageSearch}
                    dateFilter={dateFilter}
                    setDateFilter={handleDateFilterChange}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                <LogsTable
                    logs={logs}
                    isLoading={isLoading}
                    error={error}
                    hasActiveFilters={hasActiveFilters}
                    currentPage={currentPage}
                    searchTerm={debouncedMessage}
                />

                {!isLoading && !error && logs.length > 0 && (
                    <LogsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    )
}

export default MonitorLogs