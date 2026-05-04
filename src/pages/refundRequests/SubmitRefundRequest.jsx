import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { baseUrl } from '../../libs/baseUrl'

const SubmitRefundRequest = () => {
    const { uid } = useParams()

    const [emails, setEmails] = useState([''])
    const [daysUsed, setDaysUsed] = useState('')
    const [bkashPaymentNumber, setBkashPaymentNumber] = useState('')
    const [bkashRefundNumber, setBkashRefundNumber] = useState('')
    const [whatsappNumber, setWhatsappNumber] = useState('')

    const [submitting, setSubmitting] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState('')

    const updateEmail = (idx, value) => {
        setEmails((prev) => prev.map((e, i) => (i === idx ? value : e)))
    }
    const addEmail = () => setEmails((prev) => [...prev, ''])
    const removeEmail = (idx) => setEmails((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev))

    const resetForm = () => {
        setEmails([''])
        setDaysUsed('')
        setBkashPaymentNumber('')
        setBkashRefundNumber('')
        setWhatsappNumber('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResults(null)

        if (!daysUsed || !bkashPaymentNumber || !bkashRefundNumber || !whatsappNumber) {
            setError('Please fill all the common fields.')
            return
        }
        const cleanedEmails = emails.map((em) => em.trim()).filter(Boolean)
        if (cleanedEmails.length === 0) {
            setError('Please add at least one email.')
            return
        }

        const items = cleanedEmails.map((email) => ({
            email,
            daysUsed,
            bkashPaymentNumber,
            bkashRefundNumber,
            whatsappNumber
        }))

        try {
            setSubmitting(true)
            const res = await fetch(`${baseUrl}/refund-request/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminUid: uid, items })
            })
            const data = await res.json()
            if (data?.success) {
                setResults(data.results || [])
            } else {
                setError(data?.message || 'Failed to submit refund request')
            }
        } catch (err) {
            console.error(err)
            setError('Network error. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const submitAgain = () => {
        setResults(null)
        resetForm()
    }

    return (
        <div className="min-h-screen bg-[var(--bg-deepest)] p-4 sm:p-6 lg:p-10">
            <Helmet>
                <title>Submit Refund Request</title>
            </Helmet>

            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                        Refund Request
                    </h1>
                    <p className="text-[var(--text-tertiary)] mt-2">
                        Fill out the form below. You can add multiple emails for the same refund request.
                    </p>
                </div>

                {results ? (
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                                Submission Result
                            </h2>
                            <div className="space-y-3">
                                {results.map((r, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl border flex items-start gap-3 ${
                                            r.success
                                                ? 'bg-green-500/10 border-green-500/40'
                                                : 'bg-red-500/10 border-red-500/40'
                                        }`}
                                    >
                                        {r.success ? (
                                            <FaCheckCircle className="text-green-400 mt-1 shrink-0" />
                                        ) : (
                                            <FaTimesCircle className="text-red-400 mt-1 shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-[var(--text-primary)] break-all">{r.email}</p>
                                            <p className={`text-sm mt-1 ${r.success ? 'text-green-400' : 'text-red-400'}`}>
                                                {r.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={submitAgain}
                            className="w-full px-5 py-3 rounded-xl font-semibold text-white bg-[var(--accent-blue)] hover:opacity-90"
                        >
                            Submit Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Emails */}
                        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                                Email(s) having issue
                            </label>
                            <div className="space-y-2">
                                {emails.map((em, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            value={em}
                                            onChange={(e) => updateEmail(idx, e.target.value)}
                                            placeholder={idx === 0 ? 'user@example.com' : 'Another email'}
                                            className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required={idx === 0}
                                        />
                                        {emails.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEmail(idx)}
                                                className="p-3 rounded-xl text-red-400 hover:bg-red-500/10"
                                                aria-label="Remove email"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addEmail}
                                className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] text-sm"
                            >
                                <FaPlus />
                                <span>Add another email</span>
                            </button>
                        </div>

                        {/* Common fields */}
                        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Days used</label>
                                <input
                                    type="text"
                                    value={daysUsed}
                                    onChange={(e) => setDaysUsed(e.target.value)}
                                    placeholder="e.g. 5"
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">WhatsApp number</label>
                                <input
                                    type="text"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Paid from bKash number</label>
                                    <input
                                        type="text"
                                        value={bkashPaymentNumber}
                                        onChange={(e) => setBkashPaymentNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Refund to bKash number</label>
                                    <input
                                        type="text"
                                        value={bkashRefundNumber}
                                        onChange={(e) => setBkashRefundNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full px-5 py-3.5 rounded-xl font-semibold text-white bg-[var(--accent-blue)] hover:opacity-90 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Refund Request'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SubmitRefundRequest
