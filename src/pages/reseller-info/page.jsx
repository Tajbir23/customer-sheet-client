import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FaUserPlus, FaSearch, FaUsers } from 'react-icons/fa'
import { toast } from 'react-toastify'
import handleApi from '../../libs/handleAPi'

// Components
import ResellerCard from './components/ResellerCard'
import AddResellerModal from './components/AddResellerModal'
import EditResellerModal from './components/EditResellerModal'
import DeleteResellerModal from './components/DeleteResellerModal'
import ResellerTableSkeleton from './components/ResellerTableSkeleton'

const ResellerPage = () => {
  const navigate = useNavigate()
  
  // State management
  const [resellers, setResellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editReseller, setEditReseller] = useState(null)
  const [deleteReseller, setDeleteReseller] = useState(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Fetch resellers
  useEffect(() => {
    let isMounted = true

    const fetchResellers = async () => {
      try {
        setIsLoading(true)
        const response = await handleApi('/reseller/get-reseller', 'GET', {}, navigate)
        
        if (response?.success && isMounted) {
          setResellers(response.resellers)
        }
      } catch (error) {
        console.error('Error fetching resellers:', error)
        if (isMounted) {
          toast.error('Failed to fetch resellers')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchResellers()

    return () => {
      isMounted = false
    }
  }, [navigate])

  // Filter resellers based on search
  const filteredResellers = resellers.filter(reseller => {
    const searchLower = debouncedSearch.toLowerCase()
    return (
      reseller.name?.toLowerCase().includes(searchLower) ||
      reseller.email?.toLowerCase().includes(searchLower) ||
      reseller.phone?.toLowerCase().includes(searchLower) ||
      reseller.gptAccount?.toLowerCase().includes(searchLower)
    )
  })

  // Handle add reseller
  const handleAddReseller = (newReseller) => {
    setResellers(prev => [...prev, newReseller])
    setIsAddModalOpen(false)
    toast.success('Reseller added successfully!')
  }

  // Handle update reseller
  const handleUpdateReseller = (updatedReseller) => {
    setResellers(prev => 
      prev.map(reseller => 
        reseller._id === updatedReseller._id ? updatedReseller : reseller
      )
    )
    setEditReseller(null)
    toast.success('Reseller updated successfully!')
  }

  // Handle delete reseller
  const handleDeleteReseller = async (id) => {
    try {
      const response = await handleApi(`/reseller/remove-reseller/${id}`, 'DELETE', {}, navigate)
      
      if (response?.success) {
        setResellers(prev => prev.filter(reseller => reseller._id !== id))
        toast.success('Reseller removed successfully!')
      } else {
        toast.error('Failed to remove reseller')
      }
    } catch (error) {
      console.error('Error deleting reseller:', error)
      toast.error('Failed to remove reseller')
    } finally {
      setDeleteReseller(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Helmet>
        <title>Reseller Management</title>
      </Helmet>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddResellerModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddReseller}
        />
      )}

      {/* Edit Modal */}
      {editReseller && (
        <EditResellerModal
          reseller={editReseller}
          onClose={() => setEditReseller(null)}
          onSuccess={handleUpdateReseller}
        />
      )}

      {/* Delete Modal */}
      {deleteReseller && (
        <DeleteResellerModal
          reseller={deleteReseller}
          onClose={() => setDeleteReseller(null)}
          onDelete={handleDeleteReseller}
        />
      )}

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title and Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    Reseller Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your reseller accounts and their access
                  </p>
                </div>
              </div>
            </div>

            {/* Add Reseller Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
            >
              <FaUserPlus className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span>Add New Reseller</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search resellers by name, email, phone or GPT account..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all duration-200 text-gray-700 placeholder-gray-400 group-hover:border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
          </div>
        </div>

        {/* Results Summary */}
        {debouncedSearch && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-purple-800 font-medium">
                Searching for: "{debouncedSearch}" • Found {filteredResellers.length} reseller(s)
              </p>
              <button
                onClick={() => setSearch('')}
                className="text-purple-600 hover:text-purple-800 font-medium text-sm underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Resellers</p>
                <p className="text-2xl font-bold text-gray-900">{resellers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">With GPT Account</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resellers.filter(r => r.gptAccount).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Without GPT Account</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resellers.filter(r => !r.gptAccount).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resellers Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {isLoading ? (
            <ResellerTableSkeleton />
          ) : filteredResellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {debouncedSearch ? 'No resellers found' : 'No resellers yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {debouncedSearch
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first reseller'}
              </p>
              {!debouncedSearch && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaUserPlus />
                  Add First Reseller
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredResellers.map((reseller) => (
                <ResellerCard
                  key={reseller._id}
                  reseller={reseller}
                  onEdit={setEditReseller}
                  onDelete={setDeleteReseller}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResellerPage