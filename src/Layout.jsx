import React, { useState } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"
import SettingsModal from "./components/SettingsModal/SettingsModal"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="page-wrapper">
      {/* Ambient Background Effects Removed */}

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
    </div>
  )
}

export default Layout