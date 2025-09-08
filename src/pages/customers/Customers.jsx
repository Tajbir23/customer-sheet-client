import React, { useState, useEffect } from 'react'
import CustomerTable from './components/CustomerTable'
import { FaSearch, FaUserPlus } from 'react-icons/fa'
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
    }, 500) // Wait for 500ms after the user stops typing

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="p-4 sm:p-6 h-screen relative overflow-auto">
      {isOpen && <AddCustomerForm setIsOpen={setIsOpen} className={" w-full fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-50 overflow-auto"} />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Customers</h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              placeholder="Search subscription end date..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchSubscriptionEndDate}
              onChange={(e) => setSearchSubscriptionEndDate(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button onClick={() => setIsOpen(true)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
            <FaUserPlus />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <CustomerTable className={`${isOpen ? 'opacity-50' : 'opacity-100'}`} setIsLoading={setIsLoading} isLoading={isLoading} search={debouncedSearch} searchSubscriptionEndDate={searchSubscriptionEndDate} />
    </div>
  )
}

export default Customers