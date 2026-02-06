import React, { useState } from "react"
import handleApi from "../../../libs/handleAPi"
import { toast } from "react-toastify"


const ProxyUploadForm = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        location: '',
        proxyUrl: ''
    })
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.location) {
            newErrors.location = 'Please select a location'
        }

        if (!formData.proxyUrl) {
            newErrors.proxyUrl = 'Proxy URL is required'
        } else if (!isValidUrl(formData.proxyUrl)) {
            newErrors.proxyUrl = 'Please enter a valid URL'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const res = await handleApi("/upload-proxy", "POST", {
                location: formData.location,
                proxyUrl: formData.proxyUrl
            })

            if (res.success) {
                toast.success(res.message || 'Proxy uploaded successfully!')
                setFormData({ location: '', proxyUrl: '' })
                if (onClose) onClose()
            } else {
                toast.error(res.message || 'Failed to upload proxy')
            }
        } catch (error) {
            toast.error('An error occurred while uploading proxy')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Select */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                </label>
                <select
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.location
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                >
                    <option value="">Select location</option>
                    <option value="netherlands">Netherlands</option>
                    <option value="ireland">Ireland</option>
                    <option value="switzerland">Switzerland</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="united-kingdom">United Kingdom</option>
                    <option value="korea">Korea</option>
                </select>
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
            </div>

            {/* Proxy URL Input */}
            <div>
                <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Proxy URL *
                </label>
                <input
                    type="text"
                    name="proxyUrl"
                    id="proxyUrl"
                    value={formData.proxyUrl}
                    onChange={handleInputChange}
                    placeholder="https://proxy.example.com:8080"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.proxyUrl
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                />
                {errors.proxyUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.proxyUrl}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                    Enter the complete proxy URL including protocol and port
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin font-bold">...</span>
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <span className="font-bold">↑</span>
                            <span>Upload Proxy</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default ProxyUploadForm