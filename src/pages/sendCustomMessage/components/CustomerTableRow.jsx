import React from 'react'
import { FaWhatsapp, FaCircle } from 'react-icons/fa'


const CustomerTableRow = ({ user, index, isSelected, onSelect }) => {
    return (
        <tr
            className={`group hover:bg-[var(--bg-hover)] transition-all duration-200 cursor-pointer ${isSelected ? 'bg-[var(--accent-blue)]/10' : ''}`}
            onClick={onSelect}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-[var(--accent-blue)] bg-[var(--bg-elevated)] border-[var(--border-subtle)] rounded focus:ring-[var(--accent-blue)] cursor-pointer"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                                {user.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-white group-hover:text-[var(--accent-blue-light)] transition-colors">
                            {user.customerName}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)] md:hidden">
                            {user.waOrFbId}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-[var(--success)] text-xl" />
                    <span className="text-sm font-mono text-white bg-[var(--bg-elevated)] px-2 py-1 rounded-md">
                        {user.waOrFbId}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30">
                    <FaCircle className="w-2 h-2 mr-2" />
                    Active
                </div>
            </td>
        </tr>
    )
}

export default CustomerTableRow
