import React, { useEffect, useState } from 'react'
import UploadPaypalAccount from './components/UploadPaypalAccount'
import handleApi from '../../libs/handleAPi'
import PaypalAccountCard from './components/PaypalAccountCard'
import { Helmet } from 'react-helmet'


const PaypalAccounts = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setIsSearching(true)
    const id = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
      setPage(1)
      setIsSearching(false)
    }, 1000)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!isMounted) return

      setIsLoading(true)
      try {
        const response = await handleApi(`/paypal-account/get?search=${debouncedSearch}&page=${page}`, 'GET')

        if (isMounted) {
          setData(response.data)
          setTotalPages(response.pagination?.totalPages || 1)
          setTotalItems(response.pagination?.totalItems || 0)
          setCurrentPage(response.pagination?.currentPage || page)
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setData([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [debouncedSearch, page])

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      setPage(newPage)
    }
  }

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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage === 1
            ? 'text-[var(--text-muted)] cursor-not-allowed'
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
            }`}
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          <span className="w-3 h-3 font-bold">&lt;</span>
          Previous
        </button>

        {visiblePages.map((p, index) => (
          <React.Fragment key={index}>
            {p === '...' ? (
              <span className="px-3 py-2 text-[var(--text-muted)]">...</span>
            ) : (
              <button
                onClick={() => onPageChange(p)}
                className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-300 ${currentPage === p
                  ? 'text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
                  }`}
                style={{
                  background: currentPage === p
                    ? 'linear-gradient(135deg, #0070ba 0%, #003087 100%)'
                    : undefined,
                  border: currentPage === p ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: currentPage === p ? '0 4px 15px rgba(0, 112, 186, 0.4)' : undefined,
                }}
              >
                {p}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${currentPage >= totalPages
            ? 'text-[var(--text-muted)] cursor-not-allowed'
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
            }`}
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          Next
          <span className="w-3 h-3 font-bold">&gt;</span>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>PayPal Accounts - Customer Sheet</title>
      </Helmet>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)',
                boxShadow: '0 10px 25px -10px rgba(0, 112, 186, 0.5)',
              }}
            >
              <span className="w-8 h-8 text-white font-bold text-center flex items-center justify-center text-xl">P</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PayPal Accounts</h1>
              <p className="text-[var(--text-tertiary)] mt-1">Manage and monitor all PayPal accounts</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)',
              boxShadow: '0 10px 30px -10px rgba(0, 112, 186, 0.5)',
            }}
          >
            <span className="group-hover:scale-110 transition-transform duration-200 font-bold">+</span>
            <span>Upload Account</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div
        className="rounded-2xl p-6 mb-8 animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <div className="animate-rotate w-5 h-5 border-2 border-[#0070ba] border-t-transparent rounded-full" />
            ) : (
              <span className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[#0070ba] transition-colors font-bold pl-1">Q</span>
            )}
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-[var(--text-muted)] transition-all duration-300"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0070ba';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 112, 186, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Results Info */}
      {!isLoading && data?.length > 0 && (
        <div
          className="rounded-xl p-4 mb-8 animate-fade-in flex flex-wrap items-center justify-between gap-4"
          style={{
            background: 'rgba(0, 112, 186, 0.1)',
            border: '1px solid rgba(0, 112, 186, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: 'rgba(0, 112, 186, 0.2)' }}
            >
              <span className="h-4 w-4 text-[#00b0f4] font-bold">P</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {search ? `Search results for "${search}"` : 'All PayPal Accounts'}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Showing {data?.length} of {totalItems} accounts
              </p>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      )}

      {isOpen && <UploadPaypalAccount setIsOpen={setIsOpen} />}

      {/* Content Section */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-rotate w-12 h-12 border-4 border-[#0070ba] border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-[var(--text-tertiary)] font-medium">Loading accounts...</p>
            </div>
          </div>
        ) : data?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {data.map((account, index) => (
                <PaypalAccountCard key={account._id} account={account} index={index} />
              ))}
            </div>

            <div className="px-6 pb-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--bg-surface)' }}
            >
              <span className="h-8 w-8 text-[var(--text-muted)] font-bold text-2xl text-center">P</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search ? 'No Results Found' : 'No Accounts Available'}
            </h3>
            <p className="text-[var(--text-tertiary)] text-center">
              {search
                ? `No accounts found matching "${search}". Try adjusting your search terms.`
                : 'No PayPal accounts are currently available. Upload your first account to get started.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaypalAccounts