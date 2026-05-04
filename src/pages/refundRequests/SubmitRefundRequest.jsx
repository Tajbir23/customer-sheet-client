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
    const [paidAmount, setPaidAmount] = useState('')

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
        setPaidAmount('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResults(null)

        if (!daysUsed || !bkashPaymentNumber || !bkashRefundNumber || !whatsappNumber || !paidAmount) {
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
            whatsappNumber,
            paidAmount
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
                        নিচের ফর্মটি পূরণ করে আপনার রিফান্ড রিকোয়েস্ট জমা দিন।
                    </p>
                </div>

                {!results && (
                    <div className="mb-6 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                            📋 বিস্তারিত নির্দেশনা — অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন
                        </h2>
                        <ol className="list-decimal list-inside space-y-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                            <li>
                                <strong className="text-[var(--text-primary)]">Email(s) having issue:</strong>{' '}
                                যে ChatGPT মেইল(গুলো)তে সমস্যা হচ্ছে সেটি লিখুন। একাধিক মেইল থাকলে{' '}
                                <em className="text-[var(--accent-blue)]">"Add another email"</em> বাটনে ক্লিক করে নতুন
                                মেইল যোগ করুন। ভুল বা বানান ভুল মেইল দিলে রিকোয়েস্ট রিজেক্ট হয়ে যাবে।
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Days used:</strong>{' '}
                                সাবস্ক্রিপশন কেনার পর কত দিন ব্যবহার করেছেন সেই সংখ্যাটি লিখুন (যেমন: <code>5</code> অথবা{' '}
                                <code>12</code>)।
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Paid amount (৳):</strong>{' '}
                                আপনি কত টাকা পেমেন্ট করেছিলেন সেই পরিমাণ লিখুন (যেমন: <code>500</code>)। সঠিক
                                অ্যামাউন্ট দিন, এটি পেমেন্ট ভেরিফাই করতে ব্যবহৃত হবে।
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">WhatsApp number:</strong>{' '}
                                আপনার সচল WhatsApp নম্বরটি দিন। প্রয়োজনে আমরা এই নম্বরে যোগাযোগ করব।
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Paid from bKash number:</strong>{' '}
                                যে bKash নম্বর থেকে আপনি পেমেন্ট করেছিলেন সেই নম্বরটি দিন। (পেমেন্ট ভেরিফাই করার জন্য
                                জরুরি)
                            </li>
                            <li>
                                <strong className="text-[var(--text-primary)]">Refund to bKash number:</strong>{' '}
                                যে bKash নম্বরে রিফান্ড নিতে চান সেই নম্বরটি দিন। পেমেন্ট নম্বর ও রিফান্ড নম্বর একই হলেও সমস্যা নেই।
                            </li>
                            <li>
                                সব ঠিক থাকলে <em className="text-[var(--accent-blue)]">"Submit Refund Request"</em>{' '}
                                বাটনে ক্লিক করুন। প্রতিটি মেইলের রেজাল্ট আলাদা ভাবে দেখানো হবে।
                            </li>
                        </ol>

                        <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 text-xs leading-relaxed">
                            <strong>⚠️ লক্ষ্য করুন:</strong> একই মেইল দ্বিতীয়বার সাবমিট করলে অথবা যে মেইলটি আমাদের সিস্টেমে
                            খুঁজে পাওয়া যাবে না, সেটি স্বয়ংক্রিয়ভাবে রিজেক্ট হয়ে যাবে। তাই সঠিক মেইল ঠিকানা দিন।
                        </div>
                    </div>
                )}

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
                                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Paid amount (৳)</label>
                                <input
                                    type="text"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    placeholder="e.g. 500"
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
