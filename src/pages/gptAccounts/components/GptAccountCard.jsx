import React, { useEffect, useState } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'
import { toast } from 'react-toastify'
import { FaCopy, FaEye, FaEyeSlash, FaKey, FaLock } from 'react-icons/fa'

const GptAccountCard = ({ account }) => {
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
                    setTimeLeft(30) // Reset countdown
                } catch (error) {
                    console.log(error)
                }
            }
        }

        if (account.secret) {
            // Generate initial code
            generateCode()

            // Set up auto-refresh
            intervalId = setInterval(generateCode, 30000) // Refresh every 30 seconds

            // Set up countdown
            countdownId = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        generateCode() // Generate new code when countdown reaches 0
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
        <div className="rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--accent-purple)]/30 group"
            style={{ background: 'var(--bg-card)' }}>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]"
                style={{ background: 'linear-gradient(to right, var(--bg-surface), var(--bg-card))' }}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-[var(--text-primary)] truncate" title={account.gptAccount}>
                            {account.gptAccount}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--accent-green)]"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]"></span>
                            </span>
                            <p className="text-xs text-[var(--text-secondary)]">OpenAI • 2FA enabled</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono font-medium rounded-md px-2 py-1 border border-[var(--border-subtle)]"
                        style={{ background: 'var(--bg-elevated)', color: timeLeft < 10 ? 'var(--error)' : 'var(--text-secondary)' }}>
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* TOTP Code */}
                <div className="p-4 rounded-xl border relative overflow-hidden group/totp"
                    style={{
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderColor: 'rgba(59, 130, 246, 0.2)'
                    }}>
                    <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
                        <div>
                            <p className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider mb-1">2FA Code</p>
                            <div className="text-2xl md:text-3xl font-mono font-bold tracking-[0.2em] text-[var(--text-primary)] transition-all duration-300">
                                {formattedCode || '------'}
                            </div>
                        </div>
                        <button
                            onClick={() => copy(code, 'Code copied')}
                            disabled={!code}
                            className="p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{
                                background: code ? 'var(--accent-blue)' : 'var(--bg-surface)',
                                color: code ? '#fff' : 'var(--text-muted)',
                                opacity: code ? 1 : 0.5,
                                cursor: code ? 'pointer' : 'not-allowed'
                            }}
                            title="Copy Code"
                        >
                            <FaCopy />
                        </button>
                    </div>

                    {/* Progress Bar background */}
                    <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden relative z-10">
                        <div
                            className="h-full transition-all duration-1000 ease-linear"
                            style={{
                                width: `${(timeLeft / 30) * 100}%`,
                                background: timeLeft < 10 ? 'var(--error)' : 'var(--accent-blue)'
                            }}
                        />
                    </div>

                    {/* Decorative glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-blue)] opacity-5 blur-3xl rounded-full pointer-events-none group-hover/totp:opacity-10 transition-opacity duration-500"></div>
                </div>

                {/* Password */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
                    <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
                        <FaLock className="w-2.5 h-2.5 opacity-70" /> Password
                    </div>
                    <div className="px-3 pb-2.5 flex items-center justify-between gap-2 mt-0.5">
                        <div className="font-mono text-sm text-[var(--text-secondary)] truncate pr-2 select-none group-hover:text-[var(--text-primary)] transition-colors">
                            {showPassword ? account.password : '•'.repeat(Math.max(8, (account.password || '').length))}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => setShowPassword(s => !s)}
                                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                title={showPassword ? 'Hide' : 'Show'}
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                            <button
                                onClick={() => copy(account.password || '', 'Password copied')}
                                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                title="Copy Password"
                            >
                                <FaCopy size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secret */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
                    <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] flex items-center gap-1.5">
                        <FaKey className="w-2.5 h-2.5 opacity-70" /> Secret Key
                    </div>
                    <div className="px-3 pb-2.5 flex items-center justify-between gap-2 mt-0.5">
                        <div className="font-mono text-sm text-[var(--text-secondary)] truncate pr-2 select-none group-hover:text-[var(--text-primary)] transition-colors">
                            {showSecret ? account.secret : `${(account.secret || '').slice(0, 6)}••••••••••`}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => setShowSecret(s => !s)}
                                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                title={showSecret ? 'Hide' : 'Show'}
                            >
                                {showSecret ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                            <button
                                onClick={() => copy(account.secret || '', 'Secret copied')}
                                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                title="Copy Secret"
                            >
                                <FaCopy size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GptAccountCard