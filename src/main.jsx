import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './router/Routes.jsx'
import { ToastContainer } from 'react-toastify'
import { SocketProvider } from './context/SocketContext.jsx'
import { FontProvider } from './context/FontContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <ThemeProvider>
        <FontProvider>
          <RouterProvider router={Routes} />
          <ToastContainer />
        </FontProvider>
      </ThemeProvider>
    </SocketProvider>
  </StrictMode>,
)
