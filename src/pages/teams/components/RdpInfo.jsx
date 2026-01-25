import React, { useState, useEffect } from 'react'

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

  const handleAction = async (action, hostname) => {
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
      'bg-indigo-500', 'bg-amber-500', 'bg-red-500', 'bg-teal-500'
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
          <span className="text-[var(--text-tertiary)] font-bold">Loading...</span>
        </div>
      ) : rdpData.length > 0 ? (
        <div className="grid gap-4">
          {rdpData.map((rdp) => (
            <div
              key={rdp._id}
              className={`
                relative p-4 rounded-xl border transition-all duration-300 group hover:scale-[1.01] hover:shadow-lg
                ${team?.isActive
                  ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent-blue)] hover:bg-[var(--bg-elevated)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] opacity-90'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md
                  ${getAvatarColor(rdp.hostname)}
                  ${team?.isActive ? '' : 'opacity-75'}
                `}>
                  {getInitials(rdp.hostname)}

                  {/* Status Indicator */}
                  <div className={`
                    absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-card)]
                    ${team?.isActive ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}
                  `} />
                </div>

                {/* RDP Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${team?.isActive
                      ? 'text-[var(--text-secondary)]'
                      : 'text-[var(--text-tertiary)]'
                      }`}>RDP</span>
                    <span className="text-sm truncate font-semibold text-white">
                      {rdp.hostname}
                    </span>
                  </div>

                  {/* IP Address */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-tertiary)]">IP:</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {rdp.ipAddress}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Open Button */}
                  <button
                    onClick={() => handleAction('open', rdp.hostname)}
                    className="
                      opacity-0 group-hover:opacity-100 transition-all duration-200 
                      p-2 rounded-lg hover:scale-110 active:scale-95
                      hover:bg-[var(--success-bg)] text-[var(--text-tertiary)] hover:text-[var(--success-light)]
                      focus:outline-none focus:opacity-100
                    "
                    title="Open RDP"
                  >
                    <span className="text-xs font-bold">Start</span>
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => handleAction('close', rdp.hostname)}
                    className="
                      opacity-0 group-hover:opacity-100 transition-all duration-200 
                      p-2 rounded-lg hover:scale-110 active:scale-95
                      hover:bg-[var(--warning-bg)] text-[var(--text-tertiary)] hover:text-[var(--warning-light)]
                      focus:outline-none focus:opacity-100
                    "
                    title="Close RDP"
                  >
                    <span className="text-xs font-bold">Stop</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-[var(--bg-card)] rounded-3xl p-8 max-w-sm mx-auto border border-[var(--border-subtle)] border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] flex items-center justify-center font-bold text-2xl border-2 border-[var(--text-muted)] rounded-lg">RDP</div>
            <h4 className="text-lg font-semibold text-white mb-2">No RDP Information</h4>
            <p className="text-[var(--text-tertiary)]">No RDP servers are currently configured for this team</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RdpInfo
