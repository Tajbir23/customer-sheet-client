import React, { useState, useEffect } from 'react'
import CustomerTable from './components/CustomerTable'
import { FaSearch, FaUserPlus, FaCalendarAlt } from 'react-icons/fa'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Customers</title>
      </Helmet>
      {/* Modal Overlay */}
      {isOpen && (
        <AddCustomerForm 
          setIsOpen={setIsOpen} 
          className="w-full fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 overflow-auto"
        />
      )}

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Customer Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your customer database with ease
              </p>
            </div>

            {/* Add Customer Button */}
            <button 
              onClick={() => setIsOpen(true)} 
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
            >
              <FaUserPlus className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span>Add New Customer</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 text-gray-700 placeholder-gray-400 group-hover:border-gray-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="lg:w-80">
              <div className="relative group">
                <input
                  type="date"
                  placeholder="Filter by subscription end date"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 text-gray-700 group-hover:border-gray-300"
                  value={searchSubscriptionEndDate}
                  onChange={(e) => setSearchSubscriptionEndDate(e.target.value)}
                />
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(search || searchSubscriptionEndDate) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 font-medium">
                {search && `Searching for: "${search}"`}
                {search && searchSubscriptionEndDate && " • "}
                {searchSubscriptionEndDate && `End date: ${searchSubscriptionEndDate}`}
              </p>
              <button 
                onClick={() => {
                  setSearch('')
                  setSearchSubscriptionEndDate('')
                }}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Customer Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <CustomerTable 
            className={`${isOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-all duration-300`}
            setIsLoading={setIsLoading} 
            isLoading={isLoading} 
            search={debouncedSearch} 
            searchSubscriptionEndDate={searchSubscriptionEndDate} 
          />
        </div>
      </div>
    </div>
  )
}

export default Customers