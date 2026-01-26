import React, { useState } from 'react'
import { toast } from 'react-toastify'

import handleApi from '../../../libs/handleAPi'
import removeDataFromCheckList from './removeDataFromChecklist'

const AddMember = ({ member, gptAccount, setIsOpen, className, reference, memberData, setData }) => {
  console.log(memberData)
  const [isSubmitting, setIsSubmitting] = useState(false)


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
      reference: reference,
      paidAmount: formData.paidAmount.value,
      paymentMethod: formData.paymentMethod.value,
      paymentDate: formData.paymentDate.value
    }

    try {
      const response = await handleApi("/customers/add", "POST", data)

      if (response?.success) {
        e.target.reset()
        toast.success("Customer added successfully")
        await removeDataFromCheckList(gptAccount, member.email, memberData, setData)
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
    <div className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto ${className}`}>
      <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl border border-[var(--border-subtle)] my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Add New Customer</h2>
              <p className="text-white/80 text-sm">Fill in the customer information below</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-bold"
              title="Close"
            >
              X
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="p-6 space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[var(--accent-blue)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-blue)]/20">
                <span className="text-[var(--accent-blue)] font-bold text-lg">U</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Basic Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Customer personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Customer Name <span className="text-[var(--error)]">*</span></label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-muted)]"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Email Address <span className="text-[var(--error)]">*</span></label>
                <input
                  value={member?.email}
                  type="email"
                  name="email"
                  disabled
                  className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] cursor-not-allowed opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Reference</label>
                <div className="relative">
                  <select
                    name="reference"
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                  >
                    <option key={reference._id} value={reference._id}>{reference.username}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-green)]/20">
                <span className="text-[var(--accent-green)] font-bold text-lg">O</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Order Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Order source and subscription details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Order Source <span className="text-[var(--error)]">*</span></label>
                <div className="relative">
                  <select
                    name="orderFrom"
                    required
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Contact ID</label>
                <input
                  type="text"
                  name="waOrFbId"
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-muted)]"
                  placeholder="Facebook/WhatsApp ID"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Order Date <span className="text-[var(--error)]">*</span></label>
                <input
                  type="date"
                  name="orderDate"
                  required
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">GPT Account</label>
                <input
                  type="text"
                  name="gptAccount"
                  value={gptAccount}
                  disabled
                  className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-tertiary)] cursor-not-allowed opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Subscription Duration (Days) <span className="text-[var(--error)]">*</span></label>
                <input
                  type="number"
                  name="subscriptionEnd"
                  min="1"
                  required
                  placeholder="30"
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-muted)]"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[var(--accent-orange)]/10 rounded-xl flex items-center justify-center mr-4 border border-[var(--accent-orange)]/20">
                <span className="text-[var(--accent-orange)] font-bold text-lg">$</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Payment Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Payment details and status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Status <span className="text-[var(--error)]">*</span></label>
                <div className="relative">
                  <select
                    name="paymentStatus"
                    required
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="paid">Paid</option>
                    <option selected value="pending">Pending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Amount Paid</label>
                <input
                  type="number"
                  name="paidAmount"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all placeholder-[var(--text-muted)]"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Method</label>
                <div className="relative">
                  <select
                    name="paymentMethod"
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Credit Card</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Notes & Reminders */}
          <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[var(--bg-surface)] rounded-xl flex items-center justify-center mr-4 border border-[var(--border-subtle)]">
                <span className="text-[var(--text-tertiary)] font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Notes & Reminders</h3>
                <p className="text-sm text-[var(--text-secondary)]">Additional information and reminders</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[var(--text-secondary)]">Customer Notes</label>
                <textarea
                  name="note"
                  rows="4"
                  className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all resize-none placeholder-[var(--text-muted)]"
                  placeholder="Add any additional notes about the customer..."
                ></textarea>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">Reminder Date</label>
                  <input
                    type="date"
                    name="reminderDate"
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">Reminder Notes</label>
                  <textarea
                    name="reminderNote"
                    rows="2"
                    className="w-full px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all resize-none placeholder-[var(--text-muted)]"
                    placeholder="What to remember about this customer..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all shadow-lg ${isSubmitting
                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-subtle)]'
                : 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
              {isSubmitting ? (
                <>
                  <span>Adding Customer...</span>
                </>
              ) : (
                <>
                  <span>Add Customer</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white font-bold rounded-xl transition-all border border-[var(--border-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMember