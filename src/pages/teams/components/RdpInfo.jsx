import React, { useState, useEffect } from 'react'
import { FaDesktop, FaNetworkWired, FaSpinner, FaPlay, FaStop } from 'react-icons/fa'
import handleApi from '../../../libs/handleAPi'
import { toast } from 'react-toastify'

const RdpInfo = ({ team, onRdpOpen, onRdpClose }) => {
  const [rdpData, setRdpData] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let isMounted = true

    const fetchRdpData = async () => {
      try {
        setLoading(true)
        const response = await handleApi('/gptTeam/rdp-info', 'GET')
        
        if (isMounted && response.success) {
          setRdpData(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching RDP data:', error)
        if (isMounted) {
          setRdpData([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRdpData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleAction = async(action, hostname) => {
    try {
      const data = {
          action,
          rdpId: hostname,
          location: team.location,
          gptAccount: team.gptAccount
      }
      
      console.log('RDP Action:', action, 'Hostname:', hostname)
      
      const response = await handleApi('/rc-gpt-account', 'POST', data)
      
      console.log('API Response:', response)
      
      if (response.success) {
        toast.success(response.message)
        
        // Update openOn list in parent component
        if (action === 'open' && onRdpOpen) {
          console.log('Calling onRdpOpen with:', hostname)
          onRdpOpen(hostname)
        } else if (action === 'close' && onRdpClose) {
          console.log('Calling onRdpClose with:', hostname)
          onRdpClose(hostname)
        }
      } else {
        toast.error(response.message || 'Action failed')
      }
    } catch (error) {
      console.error('Error in handleAction:', error)
      toast.error('An error occurred')
    }
  }
  // Generate avatar color from hostname
  const getAvatarColor = (hostname) => {
    let hash = 0
    for (let i = 0; i < hostname.length; i++) {
      hash = hostname.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ]
    return colors[Math.abs(hash) % colors.length]
  }

  // Get initials from hostname
  const getInitials = (hostname) => {
    return hostname.slice(0, 2).toUpperCase()
  }

  return (
    <div>
      {/* RDP Data Display */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-gray-400" />
        </div>
      ) : rdpData.length > 0 ? (
        <div className="grid gap-4">
          {rdpData.map((rdp) => (
            <div
              key={rdp._id}
              className={`
                relative p-4 rounded-lg border transition-all duration-200 group hover:shadow-md
                ${team?.isActive 
                  ? 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200' 
                  : 'bg-white/95 border-white/50 hover:bg-white shadow-sm backdrop-blur-sm'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold
                  ${getAvatarColor(rdp.hostname)}
                  ${team?.isActive ? '' : 'opacity-75'}
                `}>
                  {getInitials(rdp.hostname)}
                  
                  {/* Status Indicator */}
                  <div className={`
                    absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
                    ${team?.isActive ? 'bg-green-500' : 'bg-red-500'}
                  `} />
                </div>

                {/* RDP Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FaDesktop className={`w-4 h-4 flex-shrink-0 ${
                      team?.isActive 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                    }`} />
                    <span className="text-sm truncate font-semibold text-gray-900">
                      {rdp.hostname}
                    </span>
                  </div>
                  
                  {/* IP Address */}
                  <div className="flex items-center gap-2">
                    <FaNetworkWired className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {rdp.ipAddress}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Open Button */}
                  <button
                    onClick={() => handleAction('open', rdp.hostname)}
                    className={`
                      opacity-0 group-hover:opacity-100 transition-all duration-200 
                      p-2 rounded-lg hover:scale-105 active:scale-95
                      ${team?.isActive 
                        ? 'hover:bg-green-100 text-green-600 hover:text-green-700'
                        : 'hover:bg-green-200 text-green-700 hover:text-green-800'
                      }
                      focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-green-500/20
                    `}
                    title="Open RDP"
                  >
                    <FaPlay className="w-3.5 h-3.5" />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => handleAction('close', rdp.hostname)}
                    className={`
                      opacity-0 group-hover:opacity-100 transition-all duration-200 
                      p-2 rounded-lg hover:scale-105 active:scale-95
                      ${team?.isActive 
                        ? 'hover:bg-orange-100 text-orange-600 hover:text-orange-700'
                        : 'hover:bg-orange-200 text-orange-700 hover:text-orange-800'
                      }
                      focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-orange-500/20
                    `}
                    title="Close RDP"
                  >
                    <FaStop className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-3xl p-8 max-w-sm mx-auto">
            <FaDesktop className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No RDP Information</h4>
            <p className="text-gray-600">No RDP servers are currently configured for this team</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RdpInfo

