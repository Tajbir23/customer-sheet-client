import React, { useEffect, useState } from 'react'
import UploadGptAccount from './components/UploadGptAccount'
import handleApi from '../../libs/handleAPi'
import GptAccountCard from './components/GptAccountCard'
import { Helmet } from 'react-helmet'

const GptAccounts = () => {
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

  // Debounce search input
  useEffect(() => {
    setIsSearching(true)
    const id = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // Reset to first page on search
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
        const response = await handleApi(`/gpt-account/get?search=${debouncedSearch}&page=${page}`, 'GET')
        console.log(response)
        
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

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      setPage(newPage)
    }
  }

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
        <Helmet>
          <title>GPT Accounts</title>
        </Helmet>
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">GPT Accounts</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all GPT accounts</p>
              </div>
              <button 
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <div className="p-1 bg-white/20 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Upload Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue border-t-transparent"></div>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!isLoading && data?.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-4 w-4 text-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {search ? `Search results for "${search}"` : 'All GPT Accounts'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Showing {data?.length} of {totalItems} accounts
                  </p>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {isOpen && <UploadGptAccount setIsOpen={setIsOpen} />}

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading accounts...</p>
              </div>
            </div>
          ) : data?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {data.map((account) => (
                  <GptAccountCard key={account._id} account={account} />
                ))}
              </div>
              
              {/* Pagination */}
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {search ? 'No Results Found' : 'No Accounts Available'}
              </h3>
              <p className="text-gray-600 text-center">
                {search 
                  ? `No accounts found matching "${search}". Try adjusting your search terms.`
                  : 'No GPT accounts are currently available. Upload your first account to get started.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GptAccounts