import React, { useState } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="page-wrapper">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Left Gradient Orb */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Top Right Gradient Orb */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Bottom Gradient */}
        <div
          className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

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