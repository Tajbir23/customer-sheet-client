import React from 'react'

const ErrorMessage = ({ error }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                {error}
            </div>
        </div>
    )
}

export default ErrorMessage
