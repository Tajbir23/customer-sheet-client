import React, { useState } from 'react'
import ProxyUploadForm from './components/ProxyUploadForm'
import Proxies from './components/Proxies'
import { FaPlus } from 'react-icons/fa'
import { Helmet } from 'react-helmet'

const Asocks = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false)

  

  return (
    <div className="p-4 sm:p-6 h-screen relative overflow-auto bg-gray-50">
      <Helmet>
        <title>Asocks</title>
      </Helmet>
      {/* Upload Form Modal */}
      {isUploadFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Proxy</h2>
                <button
                  onClick={() => setIsUploadFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProxyUploadForm onClose={() => setIsUploadFormOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Proxy Management</h1>
          <p className="text-gray-600 mt-1">Manage your ASOCKS proxy servers</p>
        </div>
        
        <button
          onClick={() => setIsUploadFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          <FaPlus />
          <span>Add Proxy</span>
        </button>
      </div>

      

      {/* Proxies Section */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Proxy Servers</h2>
          <p className="text-gray-600 mt-1">Monitor and manage your proxy servers</p>
        </div>
        <Proxies />
      </div>
    </div>
  )
}

export default Asocks