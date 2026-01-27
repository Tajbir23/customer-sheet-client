import QrScanner from 'qr-scanner'
import React, { useState, useEffect } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'


const UploadGptAccount = ({ setIsOpen }) => {
    const [formData, setFormData] = useState({
        gptAccount: '',
        password: '',
        secret: ''
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState('')
    const [totpCode, setTotpCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(30)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Effect for TOTP code generation and countdown
    useEffect(() => {
        let intervalId
        let countdownId

        const generateCode = async () => {
            if (formData.secret) {
                try {
                    const code = await gptSecretToCode(formData.secret)
                    setTotpCode(code)
                    setTimeLeft(30) // Reset countdown
                } catch (error) {
                    setError(error.message)
                }
            }
        }

        if (formData.secret) {
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
    }, [formData.secret])

    useEffect(() => {
        const handlePasteEvent = async (e) => {
            const items = e.clipboardData.items
            const imageItem = Array.from(items).find(item => item.type.indexOf('image') !== -1)

            if (imageItem) {
                const file = imageItem.getAsFile()
                setSelectedFile(file)

                try {
                    const result = await QrScanner.scanImage(file)
                    parseOtpAuthUrl(result)
                } catch (error) {
                    setError('Failed to scan QR code from image.')
                    console.log(error)
                }

                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                const fileInput = document.querySelector('input[type="file"]')
                if (fileInput) {
                    fileInput.files = dataTransfer.files
                }
            }
        }

        window.addEventListener('paste', handlePasteEvent)
        return () => {
            window.removeEventListener('paste', handlePasteEvent)
        }
    }, [formData.secret])

    const parseOtpAuthUrl = (url) => {
        try {
            setError('')

            if (!url.startsWith('otpauth://totp/')) {
                throw new Error('Invalid QR code format. Expected Chat gpt QR code')
            }

            const parsedUrl = new URL(url)

            const issuer = parsedUrl.searchParams.get('issuer')
            if (issuer !== 'OpenAI') {
                throw new Error('This QR code is not from Chat gpt.')
            }

            const label = decodeURIComponent(parsedUrl.pathname.split('/')[1])
            const email = label.split(':')[1]
            const secret = parsedUrl.searchParams.get('secret')

            if (!email || !secret) {
                throw new Error('Missing required information in QR code.')
            }

            setFormData(prev => ({
                ...prev,
                gptAccount: email,
                secret: secret
            }))

            return { email, secret }
        } catch (error) {
            setError(error.message)
            console.error('Error parsing TOTP URL:', error)
            return null
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        const fieldMap = {
            'gpt_account_email': 'gptAccount',
            'gpt_account_pass': 'password'
        }
        const formField = fieldMap[name] || name
        setFormData(prev => ({ ...prev, [formField]: value }))
    }

    const handleQrChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            try {
                const result = await QrScanner.scanImage(file)
                parseOtpAuthUrl(result)
            } catch (error) {
                setError('Failed to scan QR code from image.')
                console.log(error)
            }
        }
    }

    const handleTextPaste = (e) => {
        const pastedText = e.clipboardData.getData('text')
        if (pastedText.startsWith('otpauth://')) {
            e.preventDefault()
            parseOtpAuthUrl(pastedText)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await handleApi('/gpt-account/add', 'POST', formData)
            if (response.success) {
                toast.success('Account added successfully')
                setIsOpen(false)
            } else {
                toast.error('Failed to add account')
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputClass = "w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent-purple)] bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-purple)]"
    const labelClass = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90" onClick={() => setIsOpen(false)}></div>
            <div className="relative glass rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-[var(--border-subtle)]">
                {/* Modal Header - Fixed */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-subtle)] bg-transparent rounded-t-2xl">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Upload GPT Account</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                        <span className="w-5 h-5 font-bold">X</span>
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClass}>
                                Email Address
                            </label>
                            <input
                                type="text"
                                name='gpt_account_email'
                                required
                                placeholder='Enter your email'
                                value={formData.gptAccount}
                                onChange={handleChange}
                                onPaste={handleTextPaste}
                                autoComplete="off"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Password
                            </label>
                            <input
                                type="password"
                                name='gpt_account_pass'
                                required
                                placeholder='Enter your password'
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                2FA Secret
                            </label>
                            <input
                                type="text"
                                name='secret'
                                required
                                placeholder='Enter Chat gpt secret'
                                value={formData.secret}
                                onChange={handleChange}
                                onPaste={handleTextPaste}
                                className={inputClass}
                            />
                        </div>

                        {totpCode && (
                            <div className="p-4 rounded-xl border border-[var(--accent-blue)]/20"
                                style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--accent-blue)] mb-1 uppercase tracking-wider">
                                            2FA Code Check
                                        </label>
                                        <div className="text-2xl font-mono font-bold text-[var(--text-primary)] tracking-widest">
                                            {totpCode}
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono font-medium px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                                        style={{ color: timeLeft < 10 ? 'var(--error)' : 'var(--text-secondary)' }}>
                                        {timeLeft}s
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={labelClass}>
                                QR Code
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors hover:border-[var(--accent-purple)] group"
                                style={{
                                    borderColor: 'var(--border-subtle)',
                                    background: 'var(--bg-surface)'
                                }}>
                                <div className="space-y-2 text-center">
                                    <span className="mx-auto text-4xl text-[var(--text-tertiary)] group-hover:text-[var(--accent-purple)] transition-colors font-bold block mb-2">↑</span>
                                    <div className="flex text-sm text-[var(--text-secondary)] justify-center">
                                        <label htmlFor="qr-upload" className="relative cursor-pointer rounded-md font-medium text-[var(--accent-purple)] hover:text-[var(--accent-purple-light)] focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input
                                                id="qr-upload"
                                                type="file"
                                                name='qr-code'
                                                onChange={handleQrChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-[var(--text-tertiary)]">
                                        You can also paste an image directly (Ctrl+V)
                                    </p>
                                </div>
                            </div>
                            {selectedFile && (
                                <p className="mt-2 text-sm text-[var(--success)] flex items-center gap-1">
                                    <span className="font-bold">✓</span> File selected: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error-bg)] flex items-start gap-2">
                                <span className="text-[var(--error)] mt-0.5 shrink-0 font-bold">!</span>
                                <p className="text-sm text-[var(--error)] font-medium">
                                    {error}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-subtle)] bg-transparent rounded-b-2xl">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={isSubmitting}
                        className="px-6 py-2 text-sm font-bold text-white bg-[var(--accent-blue)] border border-transparent rounded-xl hover:bg-[var(--accent-blue-light)] hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center gap-2"
                    >
                        {isSubmitting && <span className="animate-spin font-bold">...</span>}
                        Upload Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UploadGptAccount