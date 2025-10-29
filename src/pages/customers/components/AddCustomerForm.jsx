import React, { useEffect, useState, useRef } from 'react'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'
import { FaUser, FaShoppingCart, FaCreditCard, FaStickyNote, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa'

const AddCustomerForm = ({ setIsOpen, className }) => {
  const isMountedRef = useRef(true)
  const [references, setReferences] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true
    
    const fetchReferences = async () => {
      const response = await handleApi("/references", "GET")
      if (isMounted && response?.success) {
        setReferences(response.data)
      }
    }
    
    fetchReferences()
    
    return () => {
      isMounted = false
      isMountedRef.current = false
    }
  }, [])

  const calculateSubscriptionEndDate = (orderDate, durationInDays) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + parseInt(durationInDays));
    return date.toISOString().split('T')[0];
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = e.target
    const data = {
      customerName: formData.customerName.value,
      email: formData.email.value,
      orderFrom: formData.orderFrom.value,
      waOrFbId: formData.waOrFbId.value,
      orderDate: formData.orderDate.value,
      gptAccount: formData.gptAccount.value,
      subscriptionEnd: calculateSubscriptionEndDate(formData.orderDate.value, formData.subscriptionEnd.value),
      paymentStatus: formData.paymentStatus.value,
      note: formData.note.value,
      reminderDate: formData.reminderDate.value,
      reminderNote: formData.reminderNote.value,
      reference: formData.reference.value,
      paidAmount: formData.paidAmount.value,
      paymentMethod: formData.paymentMethod.value,
      paymentDate: formData.paymentDate.value
    }

    try {
      const response = await handleApi("/customers/add", "POST", data)
      
      if (isMountedRef.current && response?.success) {
        e.target.reset()
        toast.success("Customer added successfully")
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      if (isMountedRef.current) {
        toast.error("Failed to add customer")
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto ${className}`}>
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-lg border border-gray-200 my-8">
        {/* Header */}
        <div className="bg-blue p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Add New Customer</h2>
              <p className="text-white/80 text-sm">Fill in the customer information below</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              title="Close"
            >
              <FaTimes className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <FaUser className="w-4 h-4 text-blue" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-600">Customer personal details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Reference</label>
                <select
                  name="reference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                >
                  <option value="">Select reference</option>
                  {references.map((reference) => (
                    <option key={reference._id} value={reference._id}>{reference.username}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <FaShoppingCart className="w-4 h-4 text-green" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Order Information</h3>
                <p className="text-sm text-gray-600">Order source and subscription details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order Source *</label>
                <select
                  name="orderFrom"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                >
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact ID</label>
                <input
                  type="text"
                  name="waOrFbId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  placeholder="Facebook/WhatsApp ID"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Order Date *</label>
                <input
                  type="date"
                  name="orderDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">GPT Account</label>
                <input
                  type="text"
                  name="gptAccount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  placeholder="GPT account identifier"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subscription Duration (Days) *</label>
                <input
                  type="number"
                  name="subscriptionEnd"
                  min="1"
                  required
                  placeholder="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                <FaCreditCard className="w-4 h-4 text-orange" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                <p className="text-sm text-gray-600">Payment details and status</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Status *</label>
                <select
                  name="paymentStatus"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                <input
                  type="number"
                  name="paidAmount"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notes & Reminders */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <FaStickyNote className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notes & Reminders</h3>
                <p className="text-sm text-gray-600">Additional information and reminders</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Customer Notes</label>
                <textarea
                  name="note"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors resize-none"
                  placeholder="Add any additional notes about the customer..."
                ></textarea>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Reminder Date</label>
                  <input
                    type="date"
                    name="reminderDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Reminder Notes</label>
                  <textarea
                    name="reminderNote"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:ring-opacity-20 focus:border-blue transition-colors resize-none"
                    placeholder="What to remember about this customer..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue text-white hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Adding Customer...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  Add Customer
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={() => setIsOpen(false)} 
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}   

export default AddCustomerForm