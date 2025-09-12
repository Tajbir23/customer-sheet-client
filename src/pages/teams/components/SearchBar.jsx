import React from 'react'
import { FaSearch, FaTimes, FaFilter, FaUsers } from 'react-icons/fa'

const SearchBar = ({ search, onSearchChange, isLoading }) => {
  const handleClear = () => {
    onSearchChange({ target: { value: '' } })
  }

  return (
    <div className="relative mb-8">
      {/* Main Search Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center shadow-sm">
                <FaSearch className="text-white text-sm" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Search Teams</h3>
                <p className="text-sm text-gray-600">Find teams by account or member email</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaUsers className="text-blue" />
              <span>Team Explorer</span>
            </div>
          </div>
        </div>

        {/* Search Input Section */}
        <div className="p-6 bg-gray-50">
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            
            {/* Main Search Input */}
            <input
              id="search"
              type="text"
              placeholder="Type to search teams, GPT accounts, or member emails..."
              value={search}
              onChange={onSearchChange}
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue focus:ring-4 focus:ring-blue/10 transition-all duration-200 bg-white focus:bg-white placeholder-gray-400"
            />
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-y-0 right-12 flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-blue border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {/* Clear Button */}
            {search && !isLoading && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red transition-colors duration-200"
                title="Clear search"
              >
                <div className="w-8 h-8 rounded-full bg-white hover:bg-red-50 flex items-center justify-center transition-colors duration-200 border border-gray-200 hover:border-red-200">
                  <FaTimes className="text-sm" />
                </div>
              </button>
            )}
          </div>

          {/* Search Suggestions/Hints */}
          {!search && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Quick search:</span>
              <button 
                onClick={() => onSearchChange({ target: { value: 'active' }})}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-green border border-green-200 hover:bg-green-50 transition-colors duration-200"
              >
                Active teams
              </button>
              <button 
                onClick={() => onSearchChange({ target: { value: 'inactive' }})}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-red border border-red-200 hover:bg-red-50 transition-colors duration-200"
              >
                Inactive teams
              </button>
              <button 
                onClick={() => onSearchChange({ target: { value: '@gmail.com' }})}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
              >
                Gmail users
              </button>
            </div>
          )}
        </div>
        
        {/* Active Search Display */}
        {search && (
          <div className="px-6 pb-6 bg-gray-50">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                    <FaFilter className="text-blue text-sm" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Active Search Filter
                    </div>
                    <div className="text-sm text-gray-600">
                      Searching for: <span className="font-semibold text-blue">"{search}"</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors duration-200"
                >
                  <FaTimes className="mr-2 text-xs" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {!search && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">K</kbd>
              <span className="ml-1">to focus</span>
            </span>
            <span>•</span>
            <span>Search is case-insensitive</span>
            <span>•</span>
            <span>Real-time filtering</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar 