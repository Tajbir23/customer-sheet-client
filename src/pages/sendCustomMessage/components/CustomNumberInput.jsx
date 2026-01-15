import React, { useState } from 'react'
import { FaPlus, FaTimes, FaWhatsapp } from 'react-icons/fa'

const CustomNumberInput = ({ customNumbers, setCustomNumbers }) => {
    const [inputValue, setInputValue] = useState('')

    const handleAddNumber = () => {
        const number = inputValue.trim()
        if (number && !customNumbers.includes(number)) {
            setCustomNumbers([...customNumbers, number])
            setInputValue('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddNumber()
        }
    }

    const handleRemoveNumber = (numberToRemove) => {
        setCustomNumbers(customNumbers.filter(n => n !== numberToRemove))
    }

    const handlePasteMultiple = (e) => {
        const pastedText = e.clipboardData.getData('text')
        // Split by comma, newline, or space and filter valid numbers
        const numbers = pastedText
            .split(/[,\n\s]+/)
            .map(n => n.trim())
            .filter(n => n && !customNumbers.includes(n))

        if (numbers.length > 1) {
            e.preventDefault()
            setCustomNumbers([...customNumbers, ...numbers])
            setInputValue('')
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Phone Numbers
                </label>
                <p className="text-xs text-gray-500 mb-4">
                    Add multiple numbers manually. You can paste multiple numbers separated by comma or newline.
                </p>

                <div className="flex gap-2">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onPaste={handlePasteMultiple}
                            placeholder="Enter phone number (e.g., 01712345678)"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 text-gray-700 placeholder-gray-400"
                        />
                        <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
                    </div>
                    <button
                        onClick={handleAddNumber}
                        disabled={!inputValue.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>

            {/* Number Tags */}
            {customNumbers.length > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Added Numbers ({customNumbers.length})
                        </span>
                        <button
                            onClick={() => setCustomNumbers([])}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                        {customNumbers.map((number, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-mono text-gray-700 shadow-sm"
                            >
                                <FaWhatsapp className="text-green-500 text-xs" />
                                <span>{number}</span>
                                <button
                                    onClick={() => handleRemoveNumber(number)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {customNumbers.length === 0 && (
                <div className="mt-4 p-6 bg-gray-50 rounded-xl text-center">
                    <FaWhatsapp className="mx-auto text-3xl text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">No numbers added yet</p>
                </div>
            )}
        </div>
    )
}

export default CustomNumberInput
