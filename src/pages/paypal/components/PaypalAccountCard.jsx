import React, { useEffect, useState } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'
import { toast } from 'react-toastify'

const PaypalAccountCard = ({account}) => {
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

    const formattedCode = code ? `${code.slice(0,3)} ${code.slice(3)}` : ''

    const copy = async (text, label = 'Copied') => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(label)
        } catch (e) {
            toast.error('Copy failed')
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-gray-900 truncate">{account.paypalAccount}</h2>
                        <p className="mt-0.5 text-xs text-gray-500">Paypal • 2FA enabled</p>
                    </div>
                    <div className="text-xs text-gray-600 bg-white/70 border border-gray-200 rounded-md px-2 py-1">
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* TOTP Code */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-blue-700">2FA Code</p>
                            <div className="mt-1 text-2xl md:text-3xl font-mono font-bold text-blue-700 tracking-widest">
                                {formattedCode || '------'}
                            </div>
                        </div>
                        <button
                            onClick={() => copy(code, 'Code copied')}
                            disabled={!code}
                            className={`px-3 py-1.5 text-xs rounded-md border transition ${code ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
                        >
                            Copy
                        </button>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="rounded-lg border bg-gray-50/60">
                    <div className="px-3 pt-2 text-xs font-medium text-gray-600">Password</div>
                    <div className="px-3 pb-3 mt-1 flex items-center justify-between gap-2">
                        <div className="font-mono text-sm text-gray-800 truncate pr-2">
                            {showPassword ? account.password : '•'.repeat(Math.max(8, (account.password || '').length))}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setShowPassword(s => !s)}
                                className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => copy(account.password || '', 'Password copied')}
                                className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secret */}
                <div className="rounded-lg border bg-gray-50/60">
                    <div className="px-3 pt-2 text-xs font-medium text-gray-600">Secret Key</div>
                    <div className="px-3 pb-3 mt-1 flex items-center justify-between gap-2">
                        <div className="font-mono text-sm text-gray-800 truncate pr-2">
                            {showSecret ? account.secret : `${(account.secret || '').slice(0,4)}••••••••••`}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => setShowSecret(s => !s)}
                                className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white"
                            >
                                {showSecret ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => copy(account.secret || '', 'Secret copied')}
                                className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white"
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