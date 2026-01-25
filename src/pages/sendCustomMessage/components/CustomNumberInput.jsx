import React, { useState } from 'react'


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
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6">
            <div className="mb-4">
                <label className="block text-sm font-semibold text-white mb-2">
                    Enter Phone Numbers
                </label>
                <p className="text-xs text-[var(--text-tertiary)] mb-4">
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
                            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--success)] focus:ring-1 focus:ring-[var(--success)] transition-all duration-200 text-white placeholder-[var(--text-muted)]"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--success)] text-lg font-bold">WA</span>
                    </div>
                    <button
                        onClick={handleAddNumber}
                        disabled={!inputValue.trim()}
                        className="px-4 py-3 bg-[var(--success)] hover:bg-[var(--success)]/90 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="font-bold">+</span>
                    </button>
                </div>
            </div>

            {/* Number Tags */}
            {customNumbers.length > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                            Added Numbers ({customNumbers.length})
                        </span>
                        <button
                            onClick={() => setCustomNumbers([])}
                            className="text-xs text-[var(--error)] hover:text-[var(--error-light)] font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)]">
                        {customNumbers.map((number, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full text-sm font-mono text-white"
                            >
                                <span className="text-[var(--success)] text-xs font-bold">WA</span>
                                <span>{number}</span>
                                <button
                                    onClick={() => handleRemoveNumber(number)}
                                    className="text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
                                >
                                    <span className="text-xs font-bold">X</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {customNumbers.length === 0 && (
                <div className="mt-4 p-6 bg-[var(--bg-surface)] rounded-xl text-center border border-[var(--border-subtle)]">
                    <span className="mx-auto text-3xl text-[var(--text-muted)] mb-2 font-bold block">WA</span>
                    <p className="text-[var(--text-tertiary)] text-sm">No numbers added yet</p>
                </div>
            )}
        </div>
    )
}

export default CustomNumberInput
