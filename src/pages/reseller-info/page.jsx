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
    <div className="min-h-screen bg-[var(--bg-deepest)]">
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
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <FaUsers className="h-6 w-6 text-[var(--accent-purple)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                  Reseller Management
                </h1>
                <p className="text-[var(--text-secondary)] text-sm">
                  Manage your reseller accounts and their access
                </p>
              </div>
            </div>

            {/* Add Reseller Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group flex items-center gap-3 bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-white px-6 py-3 rounded-xl transition-all duration-200 font-bold"
            >
              <FaUserPlus className="text-lg group-hover:scale-110 transition-transform duration-200" />
              <span>Add New Reseller</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6 mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search resellers by name, email, phone or GPT account..."
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] transition-all duration-200 text-white placeholder-[var(--text-muted)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          </div>
        </div>

        {/* Results Summary */}
        {debouncedSearch && (
          <div className="mb-6 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-[var(--text-secondary)] font-medium">
                Searching for: "<span className="text-white">{debouncedSearch}</span>" • Found <span className="text-[var(--accent-purple)]">{filteredResellers.length}</span> reseller(s)
              </p>
              <button
                onClick={() => setSearch('')}
                className="text-[var(--accent-purple)] hover:text-[var(--accent-purple-light)] font-medium text-sm hover:underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--accent-purple)]/10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-[var(--accent-purple)] text-xl" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-tertiary)]">Total Resellers</p>
                <p className="text-2xl font-bold text-white">{resellers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--success)]/10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-[var(--success)] text-xl" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-tertiary)]">With GPT Account</p>
                <p className="text-2xl font-bold text-white">
                  {resellers.filter(r => r.gptAccount).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--warning)]/10 rounded-xl flex items-center justify-center">
                <FaUsers className="text-[var(--warning)] text-xl" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-tertiary)]">Without GPT Account</p>
                <p className="text-2xl font-bold text-white">
                  {resellers.filter(r => !r.gptAccount).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resellers Grid */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
          {isLoading ? (
            <ResellerTableSkeleton />
          ) : filteredResellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-surface)] rounded-full flex items-center justify-center">
                <FaUsers className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {debouncedSearch ? 'No resellers found' : 'No resellers yet'}
              </h3>
              <p className="text-[var(--text-tertiary)] mb-6">
                {debouncedSearch
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first reseller'}
              </p>
              {!debouncedSearch && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-purple)] text-white rounded-lg hover:bg-[var(--accent-purple)]/90 transition-colors"
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