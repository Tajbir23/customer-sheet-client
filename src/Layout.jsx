import React, { useState } from "react"
import Navbar from "./components/Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    
      
      <div className="h-screen">
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="">
          <Outlet />
        </main>
      </div>
    
  )
}

export default Layout