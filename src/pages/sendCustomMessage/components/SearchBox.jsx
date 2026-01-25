import React from 'react'
import { FaSearch } from 'react-icons/fa'


const SearchBox = ({ search, setSearch }) => {
    return (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search customers by name or phone..."
                            className="w-full pl-12 pr-4 py-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all duration-200 text-white placeholder-[var(--text-muted)]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBox
