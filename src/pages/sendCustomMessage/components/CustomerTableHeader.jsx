import React from 'react'

const CustomerTableHeader = ({ isAllSelected, onSelectAll }) => {
    return (
        <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
            <tr>
                <th scope="col" className="px-6 py-4 text-left">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={onSelectAll}
                        className="w-4 h-4 text-[var(--accent-blue)] bg-[var(--bg-elevated)] border-[var(--border-subtle)] rounded focus:ring-[var(--accent-blue)] cursor-pointer"
                    />
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Customer
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                    WhatsApp / Phone
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                    Status
                </th>
            </tr>
        </thead>
    )
}

export default CustomerTableHeader
