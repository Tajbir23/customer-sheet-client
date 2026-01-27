import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useNavigate } from 'react-router-dom'

const SearchInvoice = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    if (searchTerm.length < 6) {
      setError('Please enter at least 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to invoice details page
      navigate(`/invoice/${searchTerm}`)
    } catch (err) {
      setError('Failed to search invoice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Search Invoice</title>
      </Helmet>
      <div className="min-h-screen bg-[var(--bg-deepest)]">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="glass rounded-2xl border border-[var(--border-subtle)] p-8 max-w-md w-full animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Search Invoice
              </h1>
              <p className="text-[var(--text-secondary)]">
                Enter your invoice number or last 6 digits to find your invoice details
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your last 6 digit number..."
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all duration-200"
                  disabled={loading}
                />
                {error && (
                  <p className="text-[var(--error)] text-sm mt-2 flex items-center gap-1 animate-fade-in">
                    <span>•</span> {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-[var(--accent-blue)] text-white py-3 px-4 rounded-xl hover:bg-[var(--accent-blue)]/90 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Invoice'
                )}
              </button>
            </div>

            <div className="mt-8 text-center pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-sm text-[var(--text-tertiary)]">
                Need help? <a href="#" className="text-[var(--accent-blue)] hover:underline">Contact support</a> for assistance with your invoice search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchInvoice