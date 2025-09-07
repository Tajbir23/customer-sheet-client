import React, { useState, useEffect } from "react"
import { FaTrash } from "react-icons/fa"
import handleApi from "../../../libs/handleAPi"
import { toast } from "react-toastify"

const Proxies = () => {
  const [proxies, setProxies] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call

  useEffect(() => {
    fetchProxies()
  }, [])

  const fetchProxies = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      const response = await handleApi("/proxies", "GET")
      setProxies(response.data || [])
      setLoading(false)
      
    } catch (error) {
      toast.error("Failed to fetch proxies")
      setProxies([])
      setLoading(false)
    }
  }

  

  const getLocationFlag = (location) => {
    const flags = {
      'netherlands': '🇳🇱',
      'ireland': '🇮🇪',
      'switzerland': '🇨🇭',
      'germany': '🇩🇪',
      'france': '🇫🇷',
      'united-kingdom': '🇬🇧'
    }
    return flags[location] || '🌍'
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading proxies...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Proxies Table */}
      {proxies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proxies found</h3>
          <p className="text-gray-600">Get started by adding your first proxy server</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Proxy Link</th>
                
              </tr>
            </thead>
            <tbody>
              {proxies.map((proxy) => (
                <tr key={proxy._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLocationFlag(proxy.location)}</span>
                      <span className="capitalize font-medium">{proxy.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono text-blue-600">
                      {proxy.proxyUrl}
                    </code>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Proxies