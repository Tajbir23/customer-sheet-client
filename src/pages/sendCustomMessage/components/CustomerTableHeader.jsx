import React from 'react'

const CustomerTableHeader = ({ isAllSelected, onSelectAll }) => {
    return (
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
                <th scope="col" className="px-6 py-4 text-left">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={onSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    WhatsApp / Phone
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Status
                </th>
            </tr>
        </thead>
    )
}

export default CustomerTableHeader
