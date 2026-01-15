import React from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBox = ({ search, setSearch }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search customers by name or phone..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 text-gray-700 placeholder-gray-400 group-hover:border-gray-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBox
