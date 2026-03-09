import React, { useState, useEffect, useRef } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"
import SettingsModal from "./components/SettingsModal/SettingsModal"
import DraggableScreenshotPreview from "./components/DraggableScreenshotPreview"
import { useSocket } from "./context/SocketContext"
import { toast } from "react-toastify"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Screenshot preview state (global - persists across route changes)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [removeScreenshotPreview, setRemoveScreenshotPreview] = useState(null)
  const [inviteWaiting, setInviteWaiting] = useState(false)
  const [removeWaiting, setRemoveWaiting] = useState(false)
  const inviteWaitingTimeoutRef = useRef(null)
  const removeWaitingTimeoutRef = useRef(null)

  const { subscribe, socket, isConnected } = useSocket()

  // Listen for invite-monitoring-response event (global)
  useEffect(() => {
    if (!socket || !isConnected) return

    const unsubscribe = subscribe('invite-monitoring-response', (data) => {
      console.log('Received invite-monitoring-response:', data) 
      // Handle browser closed status
      if (data.status === 'invite_completed_browser_closed') {
        setScreenshotPreview(prev => {
          if (prev?.image) URL.revokeObjectURL(prev.image)
          return null
        })
        setInviteWaiting(false)
        toast.info('✅ Invite completed - Browser closed')
        return
      }

      // Handle screenshot preview
      if (data.status === 'screenshot' && data.screenshot) {
        if (inviteWaitingTimeoutRef.current) {
          clearTimeout(inviteWaitingTimeoutRef.current)
        }

        const blob = new Blob([data.screenshot], { type: 'image/webp' })
        const blobUrl = URL.createObjectURL(blob)

        setScreenshotPreview(prev => {
          if (prev?.image) URL.revokeObjectURL(prev.image)
          return null
        })

        setInviteWaiting(false)
        setScreenshotPreview({
          id: Date.now() + Math.random(),
          image: blobUrl,
          gptAccount: data.gptAccount,
          memberEmail: data.memberEmail,
          timestamp: data.timestamp
        })

        inviteWaitingTimeoutRef.current = setTimeout(() => {
          setInviteWaiting(true)
        }, 100)
      }

      if (data.success && data.message) {
        toast.success(data.message)
      } else if (!data.success && data.message) {
        toast.error(data.message)
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [subscribe, socket, isConnected])

  // Listen for remove-monitoring-response event (global)
  useEffect(() => {
    if (!socket || !isConnected) return

    const unsubscribe = subscribe('remove-monitoring-response', (data) => {
      if (data.status === 'removed') {
        toast.success('✅ Remove member successful')
        return
      }
      if (data.status === 'remove_failed') {
        toast.error('❌ Remove failed')
        return
      }
      if (data.status === 'error') {
        toast.error('⚠️ Something went wrong')
        return
      }
      if (data.status === 'removed_browser_closed') {
        setRemoveScreenshotPreview(prev => {
          if (prev?.image) URL.revokeObjectURL(prev.image)
          return null
        })
        setRemoveWaiting(false)
        toast.info('🔒 Browser closing')
        return
      }

      // Handle screenshot preview
      if (data.status === 'screenshot' && data.screenshot) {
        if (removeWaitingTimeoutRef.current) {
          clearTimeout(removeWaitingTimeoutRef.current)
        }

        const blob = new Blob([data.screenshot], { type: 'image/webp' })
        const blobUrl = URL.createObjectURL(blob)

        setRemoveScreenshotPreview(prev => {
          if (prev?.image) URL.revokeObjectURL(prev.image)
          return null
        })

        setRemoveWaiting(false)
        setRemoveScreenshotPreview({
          id: Date.now() + Math.random(),
          image: blobUrl,
          gptAccount: data.gptAccount,
          email: data.email,
          timestamp: data.timestamp
        })

        removeWaitingTimeoutRef.current = setTimeout(() => {
          setRemoveWaiting(true)
        }, 100)
      }

      if (data.success && data.message) {
        toast.success(data.message)
      } else if (!data.success && data.message) {
        toast.error(data.message)
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [subscribe, socket, isConnected])

  return (
    <div className="page-wrapper">
      {/* Navigation */}
      <Navbar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content */}
      <main className="page-content min-h-screen">
        <Outlet />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Screenshot Preview - Global, persists across all routes */}
      <DraggableScreenshotPreview
        preview={screenshotPreview}
        onClose={() => {
          if (screenshotPreview?.image) URL.revokeObjectURL(screenshotPreview.image)
          setScreenshotPreview(null)
          setInviteWaiting(false)
        }}
        isWaiting={inviteWaiting}
        type="invite"
      />

      <DraggableScreenshotPreview
        preview={removeScreenshotPreview}
        onClose={() => {
          if (removeScreenshotPreview?.image) URL.revokeObjectURL(removeScreenshotPreview.image)
          setRemoveScreenshotPreview(null)
          setRemoveWaiting(false)
        }}
        isWaiting={removeWaiting}
        type="remove"
      />
    </div>
  )
}

export default Layout