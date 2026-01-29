import React from 'react'

const LogsPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    return (
        <div
            className="mt-6 flex items-center justify-between p-4 rounded-xl font-mono"
            style={{
                background: '#161b22',
                border: '1px solid #21262d',
            }}
        >
            <p className="text-sm text-gray-500">
                <span className="text-green-500">$</span> page {currentPage}/{totalPages}
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                    style={{
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        color: currentPage === 1 ? '#484f58' : '#58a6ff'
                    }}
                >
                    ← prev
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                            pageNum = i + 1
                        } else if (currentPage <= 3) {
                            pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                        } else {
                            pageNum = currentPage - 2 + i
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className="w-8 h-8 rounded text-sm font-medium transition-all"
                                style={{
                                    background: currentPage === pageNum ? '#238636' : '#0d1117',
                                    border: `1px solid ${currentPage === pageNum ? '#238636' : '#30363d'}`,
                                    color: currentPage === pageNum ? '#fff' : '#8b949e'
                                }}
                            >
                                {pageNum}
                            </button>
                        )
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                    style={{
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        color: currentPage === totalPages ? '#484f58' : '#58a6ff'
                    }}
                >
                    next →
                </button>
            </div>
        </div>
    )
}

export default LogsPagination
