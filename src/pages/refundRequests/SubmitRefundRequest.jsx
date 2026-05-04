import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FaPlus, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { baseUrl } from '../../libs/baseUrl'

const emptyRow = () => ({
    email: '',
    daysUsed: '',
    bkashPaymentNumber: '',
    bkashRefundNumber: '',
    whatsappNumber: ''
})

const SubmitRefundRequest = () => {
    const { uid } = useParams()
    const [items, setItems] = useState([emptyRow()])
    const [submitting, setSubmitting] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState('')

    const updateItem = (idx, field, value) => {
        setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)))
    }

    const addRow = () => setItems((prev) => [...prev, emptyRow()])
    const removeRow = (idx) => setItems((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResults(null)

        for (const it of items) {
            if (!it.email || !it.daysUsed || !it.bkashPaymentNumber || !it.bkashRefundNumber || !it.whatsappNumber) {
                setError('Please fill all fields in every row.')
                return
            }
        }

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
        setItems([emptyRow()])
    }

    return (
        <div className="min-h-screen bg-[var(--bg-deepest)] p-4 sm:p-6 lg:p-10">
            <Helmet>
                <title>Submit Refund Request</title>
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                        Refund Request
                    </h1>
                    <p className="text-[var(--text-tertiary)] mt-2">
                        Fill the form below to request a refund. You can add multiple emails.
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
                        {items.map((it, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                        Email #{idx + 1}
                                    </h3>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRow(idx)}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                                            aria-label="Remove row"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                            Email having issue
                                        </label>
                                        <input
                                            type="email"
                                            value={it.email}
                                            onChange={(e) => updateItem(idx, 'email', e.target.value)}
                                            placeholder="user@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                            Days used
                                        </label>
                                        <input
                                            type="text"
                                            value={it.daysUsed}
                                            onChange={(e) => updateItem(idx, 'daysUsed', e.target.value)}
                                            placeholder="e.g. 5"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                            WhatsApp number
                                        </label>
                                        <input
                                            type="text"
                                            value={it.whatsappNumber}
                                            onChange={(e) => updateItem(idx, 'whatsappNumber', e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                            Paid from bKash number
                                        </label>
                                        <input
                                            type="text"
                                            value={it.bkashPaymentNumber}
                                            onChange={(e) => updateItem(idx, 'bkashPaymentNumber', e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                                            Refund to bKash number
                                        </label>
                                        <input
                                            type="text"
                                            value={it.bkashRefundNumber}
                                            onChange={(e) => updateItem(idx, 'bkashRefundNumber', e.target.value)}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-dashed border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                        >
                            <FaPlus />
                            <span>Add another email</span>
                        </button>

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
