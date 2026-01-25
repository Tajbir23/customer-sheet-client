import React, { useEffect, useState, useRef } from 'react'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'


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

  // Styles for inputs to avoid repetition
  const inputClass = "w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent-purple)] bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-purple)]"
  const labelClass = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5"
  const sectionIconClass = "w-8 h-8 rounded-lg flex items-center justify-center mr-3"

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

      <div className="relative bg-[var(--bg-card)] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border-subtle)] animate-scale-in my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Add New Customer</h2>
            <p className="text-[var(--text-secondary)] text-sm">Enter the details for the new customer</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white transition-colors"
            title="Close"
          >
            <span className="w-5 h-5 font-bold">X</span>
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center pb-2 border-b border-[var(--border-subtle)]">
              <div className={`bg-[var(--accent-blue)]/10 ${sectionIconClass}`}>
                <span className="w-4 h-4 text-[var(--accent-blue)] font-bold text-center">U</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Basic Information</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className={inputClass}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className={inputClass}
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Reference</label>
                <select
                  name="reference"
                  className={inputClass}
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
          <div className="space-y-6">
            <div className="flex items-center pb-2 border-b border-[var(--border-subtle)]">
              <div className={`bg-[var(--success)]/10 ${sectionIconClass}`}>
                <span className="w-4 h-4 text-[var(--success)] font-bold text-center">O</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Order Information</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Source and subscription details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Order Source *</label>
                <select
                  name="orderFrom"
                  required
                  className={inputClass}
                >
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Contact ID</label>
                <input
                  type="text"
                  name="waOrFbId"
                  className={inputClass}
                  placeholder="Facebook/WhatsApp ID"
                />
              </div>

              <div>
                <label className={labelClass}>Order Date *</label>
                <input
                  type="date"
                  name="orderDate"
                  required
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>

              <div>
                <label className={labelClass}>GPT Account</label>
                <input
                  type="text"
                  name="gptAccount"
                  className={inputClass}
                  placeholder="GPT account identifier"
                />
              </div>

              <div>
                <label className={labelClass}>Subscription Duration (Days) *</label>
                <input
                  type="number"
                  name="subscriptionEnd"
                  min="1"
                  required
                  placeholder="30"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            <div className="flex items-center pb-2 border-b border-[var(--border-subtle)]">
              <div className={`bg-[var(--warning)]/10 ${sectionIconClass}`}>
                <span className="w-4 h-4 text-[var(--warning)] font-bold text-center">$</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Payment Information</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Status and method</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Payment Status *</label>
                <select
                  name="paymentStatus"
                  required
                  className={inputClass}
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Amount Paid</label>
                <input
                  type="number"
                  name="paidAmount"
                  step="0.01"
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={labelClass}>Payment Method</label>
                <select
                  name="paymentMethod"
                  className={inputClass}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit Card</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
            </div>
          </div>

          {/* Notes & Reminders */}
          <div className="space-y-6">
            <div className="flex items-center pb-2 border-b border-[var(--border-subtle)]">
              <div className={`bg-[var(--accent-purple)]/10 ${sectionIconClass}`}>
                <span className="w-4 h-4 text-[var(--accent-purple)] font-bold text-center">N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Notes & Reminders</h3>
                <p className="text-sm text-[var(--text-tertiary)]">Additional details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Customer Notes</label>
                <textarea
                  name="note"
                  rows="4"
                  className={`${inputClass} resize-none`}
                  placeholder="Add any additional notes about the customer..."
                ></textarea>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Reminder Date</label>
                  <input
                    type="date"
                    name="reminderDate"
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Reminder Notes</label>
                  <textarea
                    name="reminderNote"
                    rows="2"
                    className={`${inputClass} resize-none`}
                    placeholder="What to remember about this customer..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-[var(--border-subtle)] sticky bottom-0 bg-[var(--bg-card)] -mx-6 px-6 pb-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg ${isSubmitting
                ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] text-white hover:shadow-blue-500/25'
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 animate-spin font-bold">...</span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="w-4 h-4 font-bold">✓</span>
                  Add Customer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] font-bold rounded-xl transition-all duration-200"
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