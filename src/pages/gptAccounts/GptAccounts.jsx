import React, { useEffect, useState } from 'react'
import UploadGptAccount from './components/UploadGptAccount'
import handleApi from '../../libs/handleAPi'
import GptAccountCard from './components/GptAccountCard'

const GptAccounts = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await handleApi('/gpt-account/get', 'GET')
      setData(response.data)
    }
    fetchData()
  }, [])
  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">GPT Accounts</h1>
            <button 
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Upload Account
            </button>
        </div>

        {isOpen && <UploadGptAccount setIsOpen={setIsOpen} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.length > 0 ? (
                data.map((account) => (
                    <GptAccountCard key={account._id} account={account} />
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-600 text-lg">No accounts found</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default GptAccounts