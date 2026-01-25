import React, { useState } from 'react'
import ProxyUploadForm from './components/ProxyUploadForm'
import Proxies from './components/Proxies'
import { FaPlus, FaTimes, FaServer } from 'react-icons/fa'
import { Helmet } from 'react-helmet'

const Asocks = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false)

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Asocks - Customer Sheet</title>
      </Helmet>

      {/* Upload Form Modal */}
      {isUploadFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="rounded-2xl shadow-2xl max-w-md w-full animate-scale-in"
            style={{
              background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Add New Proxy</h2>
                <button
                  onClick={() => setIsUploadFormOpen(false)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.color = 'var(--error)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <ProxyUploadForm onClose={() => setIsUploadFormOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                boxShadow: '0 10px 25px -10px rgba(16, 185, 129, 0.5)',
              }}
            >
              <FaServer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Proxy Management</h1>
              <p className="text-[var(--text-tertiary)] mt-1">Manage your ASOCKS proxy servers</p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadFormOpen(true)}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto justify-center"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.5)',
            }}
          >
            <FaPlus className="group-hover:scale-110 transition-transform duration-200" />
            <span>Add Proxy</span>
          </button>
        </div>
      </div>

      {/* Proxies Section */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <h2 className="text-xl font-bold text-white">Proxy Servers</h2>
          <p className="text-[var(--text-tertiary)] mt-1">Monitor and manage your proxy servers</p>
        </div>
        <Proxies />
      </div>
    </div>
  )
}

export default Asocks