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
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--border-subtle)]">
                    <CustomerTableHeader
                        isAllSelected={isAllSelected}
                        onSelectAll={onSelectAll}
                    />
                    <tbody className="divide-y divide-[var(--border-subtle)]">
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
                        <FaUser className="mx-auto text-4xl text-[var(--text-muted)] mb-4" />
                        <p className="text-[var(--text-secondary)] text-lg">No customers found</p>
                        <p className="text-[var(--text-tertiary)] text-sm">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerTable
