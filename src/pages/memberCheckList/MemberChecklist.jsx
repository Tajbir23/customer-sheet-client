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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-lg font-medium">Loading member checklist...</p>
                        <p className="mt-1 text-gray-500 text-sm">Please wait while we fetch your data</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Checklist</h1>
                    <p className="text-gray-600">View and manage member information across all GPT accounts</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2">
                    <div className="h-3 w-3 bg-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Live Data</span>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="bg-white rounded-lg shadow">
                    <div className="flex flex-col items-center justify-center p-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No Accounts Found</p>
                        <p className="text-gray-400 text-sm mt-1">No member checklists are available at the moment</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary Info */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {data.length} GPT Account{data.length !== 1 ? 's' : ''}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Total members: {data.reduce((sum, account) => sum + account.members.length, 0)}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Cards */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
                            {data.map((account) => (
                                <GptAccountCard key={account._id} accountData={account} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default MemberChecklist