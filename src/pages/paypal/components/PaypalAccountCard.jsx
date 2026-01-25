import React, { useEffect, useState } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'
import { toast } from 'react-toastify'

const PaypalAccountCard = ({ account }) => {
    const [code, setCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(30)
    const [showPassword, setShowPassword] = useState(false)
    const [showSecret, setShowSecret] = useState(false)

    // Effect for TOTP code generation and countdown
    useEffect(() => {
        let intervalId
        let countdownId

        const generateCode = async () => {
            if (account.secret) {
                try {
                    const token = await gptSecretToCode(account.secret)
                    setCode(token)
                    setTimeLeft(30)
                } catch (error) {
                    console.log(error)
                }
            }
        }

        if (account.secret) {
            generateCode()
            intervalId = setInterval(generateCode, 30000)
            countdownId = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        generateCode()
                        return 30
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
            if (countdownId) clearInterval(countdownId)
        }
    }, [account.secret])

    const formattedCode = code ? `${code.slice(0, 3)} ${code.slice(3)}` : ''

    const copy = async (text, label = 'Copied') => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(label)
        } catch (e) {
            toast.error('Copy failed')
        }
    }

    return (
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-white truncate">{account.paypalAccount}</h2>
                        <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">Paypal • 2FA enabled</p>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-2 py-1">
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* TOTP Code */}
                <div className="p-4 rounded-xl border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/10">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-[var(--accent-blue)]">2FA Code</p>
                            <div className="mt-1 text-2xl md:text-3xl font-mono font-bold text-[var(--accent-blue)] tracking-widest">
                                {formattedCode || '------'}
                            </div>
                        </div>
                        <button
                            onClick={() => copy(code, 'Code copied')}
                            disabled={!code}
                            className={`px-3 py-1.5 text-xs rounded-md border transition ${code ? 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue)]/90 border-transparent' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] cursor-not-allowed'}`}
                        >
                            Copy
                        </button>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent-blue)] transition-all"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <div className="px-3 pt-2 text-xs font-medium text-[var(--text-tertiary)]">Password</div>
                    <div className="px-3 pb-3 mt-1 flex items-center justify-between gap-2">
                        <div className="font-mono text-sm text-white truncate pr-2">
                            {showPassword ? account.password : '•'.repeat(Math.max(8, (account.password || '').length))}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setShowPassword(s => !s)}
                                className="px-2.5 py-1 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => copy(account.password || '', 'Password copied')}
                                className="px-2.5 py-1 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secret */}
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <div className="px-3 pt-2 text-xs font-medium text-[var(--text-tertiary)]">Secret Key</div>
                    <div className="px-3 pb-3 mt-1 flex items-center justify-between gap-2">
                        <div className="font-mono text-sm text-white truncate pr-2">
                            {showSecret ? account.secret : `${(account.secret || '').slice(0, 4)}••••••••••`}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setShowSecret(s => !s)}
                                className="px-2.5 py-1 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            >
                                {showSecret ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => copy(account.secret || '', 'Secret copied')}
                                className="px-2.5 py-1 text-xs rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaypalAccountCard