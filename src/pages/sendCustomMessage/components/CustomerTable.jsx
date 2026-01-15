import React from 'react'
import { FaUser } from 'react-icons/fa'
import CustomerTableHeader from './CustomerTableHeader'
import CustomerTableRow from './CustomerTableRow'

const CustomerTable = ({
    users,
    selectedUsers,
    onSelectUser,
    onSelectAll
}) => {
    const isAllSelected = selectedUsers.length === users.length && users.length > 0

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <CustomerTableHeader
                        isAllSelected={isAllSelected}
                        onSelectAll={onSelectAll}
                    />
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <CustomerTableRow
                                key={user._id}
                                user={user}
                                index={index}
                                isSelected={selectedUsers.includes(user.waOrFbId)}
                                onSelect={() => onSelectUser(user.waOrFbId)}
                            />
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No customers found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerTable
