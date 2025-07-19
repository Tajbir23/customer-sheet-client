import React from 'react';

const DeleteCustomerModal = ({ customer, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Delete Customer</h2>
        <div className="mb-4">
          <div className="mb-1"><span className="font-semibold">Name:</span> {customer.customerName}</div>
          <div className="mb-1"><span className="font-semibold">Email:</span> {customer.email}</div>
          <div className="mb-1"><span className="font-semibold">GPT Account:</span> {customer.gptAccount}</div>
        </div>
        <p className="mb-6">Are you sure you want to delete this customer?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onDelete(customer._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomerModal; 