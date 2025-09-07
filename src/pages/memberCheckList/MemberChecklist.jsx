import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import GptAccountCard from './components/GptAccountCard'

const MemberChecklist = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await handleApi('/gpt-account/member-checklist')
            if (response.memberChecklist) {
                setData(response.memberChecklist)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 mx-auto"></div>
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mx-auto absolute top-0"></div>
                    </div>
                    <p className="mt-6 text-gray-600 text-lg font-medium">Loading member checklist...</p>
                    <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch your data</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Member Checklist
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            View and manage member information across all GPT accounts
                        </p>
                        <div className="mt-6 flex justify-center">
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {data.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="text-gray-300 text-8xl mb-6">📋</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Accounts Found</h3>
                            <p className="text-gray-600 text-lg">
                                No member checklists are available at the moment
                            </p>
                            <div className="mt-6 h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Info */}
                        <div className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex flex-col sm:flex-row items-center justify-between">
                                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {data.length} GPT Account{data.length !== 1 ? 's' : ''}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Total members: {data.reduce((sum, account) => sum + account.members.length, 0)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-600 font-medium">Live Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Cards Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {data.map((account, index) => (
                                <div
                                    key={account._id}
                                    className="transform transition-all duration-300 hover:scale-[1.02]"
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    <GptAccountCard accountData={account} />
                                </div>
                            ))}
                        </div>

                        {/* Footer Info */}
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-gray-100">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    Last updated: {new Date().toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MemberChecklist