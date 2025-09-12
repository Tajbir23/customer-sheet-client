import React, { useEffect, useState } from 'react'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'
import { FaUser, FaShoppingCart, FaCreditCard, FaStickyNote, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa'

const AddCustomerForm = ({ setIsOpen, className }) => {
  const [references, setReferences] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchReferences = async () => {
      const response = await handleApi("/references", "GET")
      if (response?.success) {
        setReferences(response.data)
      }
    }
    fetchReferences()
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
      
      if (response?.success) {
        e.target.reset()
        toast.success("Customer added successfully")
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      toast.error("Failed to add customer")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto ${className}`}>
      <div className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto my-6">
        {/* Header */}
        <div className="card-header bg-blue text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Add New Customer</h2>
              <p className="text-white/90">Fill in the customer information below</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary text-blue bg-white hover:bg-gray-100 p-2 rounded"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="card-body space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <FaUser className="w-5 h-5 text-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <p className="text-gray-500">Customer personal details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="form-input"
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order From *</label>
                <select
                  name="orderFrom"
                  required
                  className="form-input"
                >
                  <option value="">Select platform</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="telegram">Telegram</option>
                  <option value="website">Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp/FB ID</label>
                <input
                  type="text"
                  name="waOrFbId"
                  className="form-input"
                  placeholder="Customer contact ID"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reference</label>
                <select
                  name="reference"
                  className="form-input"
                >
                  <option value="">Select reference</option>
                  {references.map((reference) => (
                    <option key={reference._id} value={reference._id}>
                      {reference.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4 border-t border-gray-200 pt-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <FaShoppingCart className="w-5 h-5 text-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Order Details</h3>
                <p className="text-gray-500">Subscription and service information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Order Date *</label>
                <input
                  type="date"
                  name="orderDate"
                  required
                  className="form-input"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GPT Account *</label>
                <input
                  type="email"
                  name="gptAccount"
                  required
                  className="form-input"
                  placeholder="gpt@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subscription Duration (days) *</label>
                <input
                  type="number"
                  name="subscriptionEnd"
                  required
                  min="1"
                  className="form-input"
                  placeholder="30"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reminder Date</label>
                <input
                  type="date"
                  name="reminderDate"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4 border-t border-gray-200 pt-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                <FaCreditCard className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Payment Information</h3>
                <p className="text-gray-500">Billing and payment details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Payment Status *</label>
                <select
                  name="paymentStatus"
                  required
                  className="form-input"
                >
                  <option value="">Select status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="form-input"
                >
                  <option value="">Select method</option>
                  <option value="creditCard">Credit Card</option>
                  <option value="payPal">PayPal</option>
                  <option value="bankTransfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Paid Amount</label>
                <input
                  type="number"
                  name="paidAmount"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 border-t border-gray-200 pt-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <FaStickyNote className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Additional Notes</h3>
                <p className="text-gray-500">Any additional information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Customer Notes</label>
                <textarea
                  name="note"
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Any notes about this customer..."
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Reminder Notes</label>
                <textarea
                  name="reminderNote"
                  rows="3"
                  className="form-input resize-none"
                  placeholder="What to remember about this customer..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary flex-1 py-3 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                  Adding Customer...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4 mr-2" />
                  Add Customer
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="btn btn-secondary flex-1 py-3"
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