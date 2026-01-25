import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import { Helmet } from 'react-helmet'
import { FaUsers, FaKeyboard } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Components
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import PageHeader from './components/PageHeader'
import SearchBox from './components/SearchBox'
import ResultsSummary from './components/ResultsSummary'
import CustomerTable from './components/CustomerTable'
import SendMessageModal from './components/SendMessageModal'
import CustomNumberInput from './components/CustomNumberInput'

const SendCustomMessage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [customNumbers, setCustomNumbers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('customers') // 'customers' or 'custom'

    useEffect(() => {
        const fetchUserPhones = async () => {
            try {
                setLoading(true)
                const data = await handleApi(`/get-user-phones`)
                if (data.success) {
                    setUsers(data.users)
                } else {
                    setError('Failed to fetch users')
                }
            } catch (err) {
                setError('Error fetching users: ' + err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUserPhones()
    }, [])

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        user.waOrFbId?.includes(search)
    )

    // Handle user selection
    const handleSelectUser = (waOrFbId) => {
        setSelectedUsers(prev =>
            prev.includes(waOrFbId)
                ? prev.filter(id => id !== waOrFbId)
                : [...prev, waOrFbId]
        )
    }

    // Handle select all
    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map(u => u.waOrFbId))
        }
    }

    // Get active numbers based on tab
    const getActiveNumbers = () => {
        if (activeTab === 'customers') {
            return selectedUsers
        }
        return customNumbers
    }

    // Handle send message - open modal
    const handleSendMessage = () => {
        setIsModalOpen(true)
    }

    // Handle actual message send
    const handleSendActualMessage = async (message) => {
        const phones = getActiveNumbers()
        console.log('Sending message to:', phones)
        console.log('Message:', message)
        try {
            await handleApi(`/send-custom-message`, 'POST', { phones, message })
            toast.success('Message sent successfully')
            setIsModalOpen(false)
            if (activeTab === 'customers') {
                setSelectedUsers([])
            } else {
                setCustomNumbers([])
            }
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Failed to send message')
        }
    }

    // Handle clear selection
    const handleClearSelection = () => {
        setSelectedUsers([])
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return <ErrorMessage error={error} />
    }

    const activeNumbers = getActiveNumbers()

    return (
        <div className="min-h-screen bg-[var(--bg-deepest)]">
            <Helmet>
                <title>Send Custom Message</title>
            </Helmet>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    selectedCount={activeNumbers.length}
                    onSendClick={handleSendMessage}
                />

                {/* Tab Navigation */}
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-2 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'customers'
                                ? 'bg-[var(--accent-blue)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white'
                                }`}
                        >
                            <FaUsers />
                            <span>Select from Customers</span>
                            {selectedUsers.length > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'customers' ? 'bg-white/20' : 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                                    }`}>
                                    {selectedUsers.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'custom'
                                ? 'bg-[var(--success)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white'
                                }`}
                        >
                            <FaKeyboard />
                            <span>Enter Custom Numbers</span>
                            {customNumbers.length > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'custom' ? 'bg-white/20' : 'bg-[var(--success)]/20 text-[var(--success)]'
                                    }`}>
                                    {customNumbers.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'customers' ? (
                    <>
                        <SearchBox
                            search={search}
                            setSearch={setSearch}
                        />

                        <ResultsSummary
                            totalCount={filteredUsers.length}
                            selectedCount={selectedUsers.length}
                            onClearSelection={handleClearSelection}
                        />

                        <CustomerTable
                            users={filteredUsers}
                            selectedUsers={selectedUsers}
                            onSelectUser={handleSelectUser}
                            onSelectAll={handleSelectAll}
                        />
                    </>
                ) : (
                    <CustomNumberInput
                        customNumbers={customNumbers}
                        setCustomNumbers={setCustomNumbers}
                    />
                )}
            </div>

            {/* Send Message Modal */}
            <SendMessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCount={activeNumbers.length}
                onSend={handleSendActualMessage}
            />
        </div>
    )
}

export default SendCustomMessage