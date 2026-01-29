import React from 'react';

const OldCustomerTable = ({
    isLoading,
    data,
    firstSelect,
    secondSelect,
    selectedIds,
    handleSelectAll,
    handleSelectRow,
    visibleColumns,
    expandedRows,
    toggleRow
}) => {
    return (
        <div
            className="rounded-2xl overflow-hidden animate-fade-in-up"
            style={{
                background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
                border: '1px solid var(--border-subtle)',
                animationDelay: '200ms',
            }}
        >
            {isLoading ? (
                <div className="p-12 flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : data.length === 0 ? (
                <div className="p-12 text-center text-[var(--text-muted)]">
                    {firstSelect && secondSelect ? 'No customers found for this date range' : 'Select a date range to view customers'}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                                <th className="px-6 py-4 text-left">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all checked:border-[var(--accent-purple)] checked:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                                            checked={selectedIds.size === data.length && data.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                        <svg
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.5 6L5 7.5L8.5 4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"></th>
                                {visibleColumns.customerName && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Name</th>}
                                {visibleColumns.whatsapp && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">WhatsApp</th>}
                                {visibleColumns.email && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email</th>}
                                {visibleColumns.gptAccount && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">GPT Account</th>}
                                {visibleColumns.subscriptionEnd && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Sub End</th>}
                                {visibleColumns.paymentStatus && <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ divideColor: 'var(--border-subtle)' }}>
                            {data.map((customer) => (
                                <React.Fragment key={customer._id}>
                                    <tr className="hover:bg-[var(--bg-surface)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all checked:border-[var(--accent-purple)] checked:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                                                    checked={selectedIds.has(customer._id)}
                                                    onChange={() => handleSelectRow(customer._id)}
                                                />
                                                <svg
                                                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M3.5 6L5 7.5L8.5 4"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleRow(customer._id)}
                                                className="p-1 rounded hover:bg-[var(--border-subtle)] transition-colors text-[var(--text-secondary)]"
                                            >
                                                <svg
                                                    className={`w-4 h-4 transition-transform ${expandedRows.has(customer._id) ? 'rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </td>
                                        {visibleColumns.customerName && (
                                            <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">
                                                {customer.customerName}
                                            </td>
                                        )}
                                        {visibleColumns.whatsapp && (
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                {customer.waOrFbId}
                                            </td>
                                        )}
                                        {visibleColumns.email && (
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                {customer.email}
                                            </td>
                                        )}
                                        {visibleColumns.gptAccount && (
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                {customer.gptAccount}
                                            </td>
                                        )}
                                        {visibleColumns.subscriptionEnd && (
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                {new Date(customer.subscriptionEnd).toLocaleDateString()}
                                            </td>
                                        )}
                                        {visibleColumns.paymentStatus && (
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${customer.paymentStatus === 'paid'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {customer.paymentStatus}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                    {/* Expanded Content */}
                                    {expandedRows.has(customer._id) && (
                                        <tr style={{ background: 'var(--bg-surface)' }}>
                                            <td colSpan="100%" className="px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                                    <div>
                                                        <p className="text-[var(--text-muted)] text-xs mb-1">Additional Info</p>
                                                        <div className="space-y-2 text-[var(--text-secondary)]">
                                                            <p><span className="font-medium text-[var(--text-primary)]">Payment Method:</span> {customer.paymentMethod}</p>
                                                            <p><span className="font-medium text-[var(--text-primary)]">Amount:</span> {customer.paidAmount}</p>
                                                            <p><span className="font-medium text-[var(--text-primary)]">Order Date:</span> {new Date(customer.orderDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[var(--text-muted)] text-xs mb-1">Notes</p>
                                                        <p className="text-[var(--text-secondary)] italic">
                                                            {customer.note || 'No notes available'}
                                                        </p>
                                                        {customer.reminderNote && (
                                                            <div className="mt-2 text-yellow-500/80">
                                                                <p className="text-xs font-bold uppercase">Reminder</p>
                                                                <p>{customer.reminderNote}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[var(--text-muted)] text-xs mb-1">System Info</p>
                                                        <div className="space-y-1 text-xs text-[var(--text-tertiary)]">
                                                            <p>Created: {new Date(customer.createdAt).toLocaleString()}</p>
                                                            <p>Last Updated: {new Date(customer.updatedAt).toLocaleString()}</p>
                                                            <p>ID: {customer._id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OldCustomerTable;
