import QrScanner from 'qr-scanner'
import React, { useState, useEffect } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'

const UploadGptAccount = () => {
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
        window.addEventListener('paste', handlePaste)
        return () => {
            window.removeEventListener('paste', handlePaste)
        }
    }, [])

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

    const handlePaste = async (e) => {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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

    return (
        <div>
            <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <input 
                    type="text" 
                    name='gptAccount' 
                    required 
                    placeholder='Enter your email' 
                    value={formData.gptAccount} 
                    onChange={handleChange}
                    onPaste={handleTextPaste}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name='password' 
                    required 
                    placeholder='Enter your password' 
                    value={formData.password} 
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="text" 
                    name='secret' 
                    required 
                    placeholder='Enter Chat gpt secret' 
                    value={formData.secret} 
                    onChange={handleChange}
                    onPaste={handleTextPaste}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {totpCode && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">{totpCode}</div>
                            <div className="text-sm text-gray-500">
                                Refreshes in: {timeLeft}s
                            </div>
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <input 
                        type="file" 
                        name='qr-code' 
                        required 
                        onChange={handleQrChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                        You can also paste an image directly (Ctrl+V) or paste the TOTP URL
                    </p>
                    {selectedFile && (
                        <p className="mt-2 text-sm text-green-600">
                            File selected: {selectedFile.name}
                        </p>
                    )}
                    {error && (
                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </div>
                <button 
                    type='submit'
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Upload
                </button>
            </form>
        </div>
    )
}

export default UploadGptAccount