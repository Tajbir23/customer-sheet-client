import React, { useState, useEffect } from 'react'
import CustomerTable from './components/CustomerTable'

import AddCustomerForm from './components/AddCustomerForm'
import { Helmet } from 'react-helmet'

const Customers = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchSubscriptionEndDate, setSearchSubscriptionEndDate] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Customers - Customer Sheet</title>
      </Helmet>

      {/* Modal Overlay */}
      {isOpen && (
        <AddCustomerForm
          setIsOpen={setIsOpen}
          className="modal-overlay"
        />
      )}

      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Title and Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-cyan) 100%)',
                  boxShadow: '0 8px 20px -8px rgba(59, 130, 246, 0.5)',
                }}
              >
                <span className="w-6 h-6 text-white font-bold text-xl flex items-center justify-center">C</span>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                  Customer Management
                </h1>
                <p className="text-[var(--text-tertiary)] mt-1">
                  Manage and track your customer database with ease
                </p>
              </div>
            </div>
          </div>

          {/* Add Customer Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
              boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 15px 40px -10px rgba(139, 92, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(139, 92, 246, 0.5)';
            }}
          >
            <span className="text-xl font-bold group-hover:scale-110 transition-transform duration-200">+</span>
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div
        className="rounded-2xl p-6 mb-8 animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '100ms',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-purple)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-purple)] transition-colors duration-200 font-bold">Q</span>
            </div>
          </div>

          {/* Date Filter */}
          <div className="lg:w-80">
            <div className="relative group">
              <input
                type="date"
                placeholder="Filter by subscription end date"
                className="w-full pl-12 pr-4 py-4 rounded-xl text-[var(--text-primary)] transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  colorScheme: 'dark',
                }}
                value={searchSubscriptionEndDate}
                onChange={(e) => setSearchSubscriptionEndDate(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-cyan)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-cyan)] transition-colors duration-200 font-bold">D</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(search || searchSubscriptionEndDate) && (
        <div
          className="mb-6 p-4 rounded-xl animate-fade-in flex items-center justify-between"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <p className="text-[var(--accent-purple-light)] font-medium flex items-center gap-2">
            <span className="font-bold">?</span>
            {search && `Searching for: "${search}"`}
            {search && searchSubscriptionEndDate && " • "}
            {searchSubscriptionEndDate && `End date: ${searchSubscriptionEndDate}`}
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSearchSubscriptionEndDate('')
            }}
            className="flex items-center gap-2 text-[var(--accent-purple-light)] hover:text-white font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-[var(--accent-purple)]/20 transition-all duration-200"
          >
            <span className="font-bold text-xs">x</span>
            Clear filters
          </button>
        </div>
      )}

      {/* Customer Table Container */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '200ms',
        }}
      >
        <CustomerTable
          className={`${isOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-all duration-300`}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          search={debouncedSearch}
          searchSubscriptionEndDate={searchSubscriptionEndDate}
        />
      </div>
    </div>
  )
}

export default Customers