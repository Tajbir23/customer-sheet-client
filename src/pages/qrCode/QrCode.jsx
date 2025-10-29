import React, { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import handleApi from '../../libs/handleAPi'

const QrCode = () => {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const canvasRef = useRef(null)

    useEffect(() => {
        let isMounted = true
        
        const fetchCode = async () => {
            if (!isMounted) return
            
            setLoading(true)
            try {
                const response = await handleApi('/customers/qr-code', 'GET')
                if (isMounted && response.success) {
                    setCode(response.qrCode.whatsappQr)
                }
            } catch (error) {
                console.error('Error fetching QR code:', error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }
        
        fetchCode()
        
        const interval = setInterval(() => {
            fetchCode()
        }, 7000)
        
        return () => {
            isMounted = false
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if (code && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, code, {
                width: 256,
                margin: 2,
                errorCorrectionLevel: 'H'
            }, (error) => {
                if (error) console.error('Error generating QR code:', error)
            })
        }
    }, [code, loading])

    console.log(code)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    WhatsApp QR Code
                </h1>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : code ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex justify-center">
                            <canvas ref={canvasRef}></canvas>
                        </div>
                        <p className="text-center text-gray-600 text-sm">
                            Scan this QR code with WhatsApp to connect
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-red-600 p-4">
                        <p>No QR code available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QrCode