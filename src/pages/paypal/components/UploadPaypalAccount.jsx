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

    const handleSubmit = async(e) => {
        e.preventDefault()
        // TODO: Handle form submission
        try {
            const response = await handleApi('/gpt-account/add', 'POST', formData)
            if(response.success){
                toast.success('Account added successfully')
                setIsOpen(false)
            }else{
                toast.error('Failed to add account')
            }
        } catch (error) {
            toast.error(error.message)
        }
        setIsOpen(false)
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
                {/* Modal Header - Fixed */}
                <div className="flex justify-between items-center p-6 border-b shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Upload GPT Account</h2>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {totpCode && (
                            <div className="p-4 bg-blue-50 rounded-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            2FA Code
                                        </label>
                                        <div className="text-2xl font-mono font-bold text-blue-700 tracking-wider">
                                            {totpCode}
                                        </div>
                                    </div>
                                    <div className="text-sm text-blue-600 font-medium">
                                        Refreshes in: {timeLeft}s
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                QR Code
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="qr-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
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
                                    <p className="text-xs text-gray-500">
                                        You can also paste an image directly (Ctrl+V)
                                    </p>
                                </div>
                            </div>
                            {selectedFile && (
                                <p className="mt-2 text-sm text-green-600">
                                    File selected: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 rounded-md">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="flex justify-end gap-4 p-6 border-t shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Upload Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UploadGptAccount