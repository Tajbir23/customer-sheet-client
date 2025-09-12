import React, { useState } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main>
        <div className={`transition-all duration-200 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } pt-16 p-6`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout