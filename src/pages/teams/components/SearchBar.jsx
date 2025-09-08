import React from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'

const SearchBar = ({ search, onSearchChange, isLoading }) => {
  const handleClear = () => {
    onSearchChange({ target: { value: '' } })
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Team Management
        </h1>
        <p className="text-gray-600 text-lg">Search and manage your GPT teams</p>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg">
          <div className="flex items-center p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
              <FaSearch className="text-white text-lg" />
            </div>
            
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-bold text-gray-700 mb-1">
                Search Teams
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by GPT account or member email..."
                value={search}
                onChange={onSearchChange}
                disabled={isLoading}
                className="w-full text-lg font-medium text-gray-900 placeholder-gray-500 border-none outline-none bg-transparent disabled:opacity-50"
              />
            </div>
            
            {search && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 ml-2"
                title="Clear search"
              >
                <FaTimes className="text-gray-600 text-sm" />
              </button>
            )}
          </div>
          
          {search && (
            <div className="px-4 pb-3">
              <div className="text-sm text-gray-600">
                Searching for: <span className="font-semibold text-gray-900">"{search}"</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar 