import React from 'react'
import { FaSearch, FaTimesCircle, FaUsersCog } from 'react-icons/fa';


const SearchBar = ({ search, onSearchChange, isLoading }) => {
  const handleClear = () => {
    onSearchChange({ target: { value: '' } })
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <FaUsersCog className="w-8 h-8 text-[var(--accent-purple)]" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[var(--text-primary)]">
          Team Management
        </h1>
        <p className="text-[var(--text-secondary)] text-lg font-medium">Search and manage your GPT teams</p>
      </div>

      <div className="relative group max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-[var(--text-tertiary)] w-5 h-5" />
        </div>

        <input
          id="search"
          type="text"
          placeholder="Search by GPT account or member email..."
          value={search}
          onChange={onSearchChange}
          disabled={isLoading}
          className="
            w-full pl-11 pr-12 py-3.5 
            bg-[var(--bg-card)] 
            border border-[var(--border-subtle)] 
            rounded-xl 
            text-[var(--text-primary)] 
            placeholder-[var(--text-muted)]
            focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)]
            transition-all duration-200
            shadow-sm hover:border-[var(--border-default)]
          "
        />

        {search && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              <FaTimesCircle className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar