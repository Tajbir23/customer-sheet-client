import React, { useState } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="page-wrapper">
      {/* Ambient Background Effects Removed */}

      {/* Navigation */}
      <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="page-content min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout