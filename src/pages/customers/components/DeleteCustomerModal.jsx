import React from 'react';


const DeleteCustomerModal = ({ customer, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="rounded-2xl shadow-2xl p-6 max-w-sm w-full border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--error-bg)' }}>
            <span className="w-5 h-5 font-bold" style={{ color: 'var(--error)' }}>🗑</span>
          </div>
          <h2 className="text-xl font-bold text-white">Delete Customer</h2>
        </div>

        {/* Content */}
        <div className="mb-6 rounded-xl p-4 border"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <div className="mb-2 truncate">
            <span className="text-[var(--text-secondary)] font-medium">Name:</span>
            <span className="text-white ml-2 font-semibold">{customer.customerName}</span>
          </div>
          <div className="mb-2 truncate">
            <span className="text-[var(--text-secondary)] font-medium">Email:</span>
            <span className="text-[var(--text-primary)] ml-2">{customer.email}</span>
          </div>
          <div className="truncate">
            <span className="text-[var(--text-secondary)] font-medium">GPT Account:</span>
            <span className="text-[var(--text-primary)] ml-2 font-mono text-sm">{customer.gptAccount}</span>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg p-3"
          style={{ background: 'var(--warning-bg)', borderColor: 'var(--warning)/20' }}>
          <span className="text-lg">⚠️</span>
          <p className="text-sm font-medium pt-0.5" style={{ color: 'var(--warning-light)' }}>
            Are you sure you want to delete this customer? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--error) 0%, var(--error-dark) 100%)' }}
            onClick={() => onDelete(customer._id)}
          >
            <span className="w-3.5 h-3.5 font-bold">🗑</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerModal; 