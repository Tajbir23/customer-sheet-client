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
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Search Invoice
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            Enter your invoice number or last 6 digits to find your invoice details
          </p>
          
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </div>
              ) : (
                'Search Invoice'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team for assistance with your invoice search.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SearchInvoice