import React, { useState, useEffect } from 'react'
import CustomerTable from './components/CustomerTable'
import { FaSearch, FaUserPlus, FaCalendarAlt } from 'react-icons/fa'
import AddCustomerForm from './components/AddCustomerForm'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modal Overlay */}
      {isOpen && (
        <AddCustomerForm 
          setIsOpen={setIsOpen} 
          className="w-full fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 overflow-auto"
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage and track your customer database with ease</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="mt-4 = sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md  bg-blue bg-blue-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue transition-colors duration-200"
        >
          <FaUserPlus className="-ml-1 mr-2 h-4 w-4" />
          Add New Customer
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="focus:ring-blue focus:border-blue block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="lg:w-80">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                placeholder="Filter by subscription end date"
                className="focus:ring-blue focus:border-blue block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm"
                value={searchSubscriptionEndDate}
                onChange={(e) => setSearchSubscriptionEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(search || searchSubscriptionEndDate) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
              className="text-blue hover:text-blue-600 font-medium text-sm underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Customer Table Container */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
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