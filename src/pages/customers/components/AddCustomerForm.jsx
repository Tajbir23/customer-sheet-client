import React, { useEffect, useState } from 'react'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'
import { FaUser, FaShoppingCart, FaCreditCard, FaStickyNote, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa'

const AddCustomerForm = ({ setIsOpen, className }) => {
  const [references, setReferences] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  const steps = [
    { id: 1, title: 'Basic Info', icon: FaUser },
    { id: 2, title: 'Order Details', icon: FaShoppingCart },
    { id: 3, title: 'Payment', icon: FaCreditCard },
    { id: 4, title: 'Notes', icon: FaStickyNote }
  ]

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto ${className}`}>
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100 my-8">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Add New Customer</h2>
              <p className="text-blue-100">Fill in the customer information below</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="group p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="Close"
            >
              <FaTimes className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-white text-blue-600 border-white' 
                        : isActive 
                          ? 'bg-white/20 text-white border-white' 
                          : 'bg-transparent text-blue-200 border-blue-300'
                    }`}>
                      {isCompleted ? (
                        <FaCheck className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-blue-200'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-white' : 'bg-blue-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                <p className="text-gray-600">Customer personal details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Reference</label>
                <select
                  name="reference"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
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
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <FaShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Order Information</h3>
                <p className="text-gray-600">Order source and subscription details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Order Source *</label>
                <select
                  name="orderFrom"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                >
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Contact ID</label>
                <input
                  type="text"
                  name="waOrFbId"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                  placeholder="Facebook/WhatsApp ID"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Order Date *</label>
                <input
                  type="date"
                  name="orderDate"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">GPT Account</label>
                <input
                  type="text"
                  name="gptAccount"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                  placeholder="GPT account identifier"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Subscription Duration (Days) *</label>
                <input
                  type="number"
                  name="subscriptionEnd"
                  min="1"
                  required
                  placeholder="30"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <FaCreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Payment Information</h3>
                <p className="text-gray-600">Payment details and status</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Status *</label>
                <select
                  name="paymentStatus"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Amount Paid</label>
                <input
                  type="number"
                  name="paidAmount"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Notes & Reminders */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                <FaStickyNote className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Notes & Reminders</h3>
                <p className="text-gray-600">Additional information and reminders</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Customer Notes</label>
                <textarea
                  name="note"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Add any additional notes about the customer..."
                ></textarea>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Reminder Date</label>
                  <input
                    type="date"
                    name="reminderDate"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Reminder Notes</label>
                  <textarea
                    name="reminderNote"
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400 resize-none"
                    placeholder="What to remember about this customer..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  Adding Customer...
                </>
              ) : (
                <>
                  <FaCheck className="w-5 h-5" />
                  Add Customer
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={() => setIsOpen(false)} 
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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