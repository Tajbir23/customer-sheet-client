import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const CustomerTableRow = ({ user, index, isSelected, onSelect }) => {
    return (
        <tr
            className={`group hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                } ${isSelected ? 'bg-blue-50' : ''}`}
            onClick={onSelect}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-sm font-semibold text-white">
                                {user.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                            {user.customerName}
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                            {user.waOrFbId}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-green-500 text-lg" />
                    <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                        {user.waOrFbId}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                </div>
            </td>
        </tr>
    )
}

export default CustomerTableRow
