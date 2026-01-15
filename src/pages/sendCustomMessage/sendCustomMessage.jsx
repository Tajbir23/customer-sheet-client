import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import { Helmet } from 'react-helmet'

// Components
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import PageHeader from './components/PageHeader'
import SearchBox from './components/SearchBox'
import ResultsSummary from './components/ResultsSummary'
import CustomerTable from './components/CustomerTable'
import SendMessageModal from './components/SendMessageModal'
import { toast } from 'react-toastify'

const SendCustomMessage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)


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

    // Handle send message - open modal
    const handleSendMessage = () => {
        setIsModalOpen(true)
    }

    // Handle actual message send
    const handleSendActualMessage = async (message) => {
        console.log('Sending message to:', selectedUsers)
        console.log('Message:', message)
        try {
            await handleApi(`/send-custom-message`, 'POST', { phones: selectedUsers, message })
            toast.success('Message sent successfully')
            setIsModalOpen(false)
            setSelectedUsers([])
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Helmet>
                <title>Send Custom Message</title>
            </Helmet>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    selectedCount={selectedUsers.length}
                    onSendClick={handleSendMessage}
                />

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
            </div>

            {/* Send Message Modal */}
            <SendMessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCount={selectedUsers.length}
                onSend={handleSendActualMessage}
            />
        </div>
    )
}

export default SendCustomMessage