import React, { useEffect, useState } from 'react'
import gptSecretToCode from '../../../libs/gptSecretToCode'

const GptAccountCard = ({account}) => {
    const [code, setCode] = useState('')
    const [timeLeft, setTimeLeft] = useState(30)

     // Effect for TOTP code generation and countdown
    useEffect(() => {
        let intervalId
        let countdownId

        const generateCode = async () => {
            if (account.secret) {
                try {
                    const code = await gptSecretToCode(account.secret)
                    setCode(code)
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

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{account.gptAccount}</h2>
                <span className="text-sm text-gray-500">Time left: {timeLeft}s</span>
            </div>
            
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">2FA Code</label>
                    <div className="text-2xl font-mono tracking-wider text-center">{code}</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                        {account.password}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                    <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded truncate">
                        {account.secret}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GptAccountCard