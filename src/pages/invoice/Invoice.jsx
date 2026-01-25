import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import handleApi from '../../libs/handleAPi'

import ExportButtons from './ExportButtons'
import { exportToPDF, exportToExcel } from './exportUtils'

const Invoice = () => {
  const { id } = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const invoiceRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await handleApi(`/get-invoice?waOrFbId=${id}`, 'GET')
        if (isMounted && response.data) {
          setData(response.data)
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [id])

  // Sort data: pending first, then by date
  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return [...data].sort((a, b) => {
      // Pending payments first
      if (a.paymentStatus === 'pending' && b.paymentStatus !== 'pending') return -1
      if (a.paymentStatus !== 'pending' && b.paymentStatus === 'pending') return 1
      // Then sort by updatedAt (newest first)
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }, [data])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <span className="text-6xl text-gray-400 mb-4 block">!</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Invoices Found</h2>
          <p className="text-gray-600">No invoice data available for this customer.</p>
        </div>
      </div>
    )
  }

  const pendingCount = sortedData.filter(item => item.paymentStatus === 'pending').length
  const paidCount = sortedData.filter(item => item.paymentStatus === 'paid').length

  // Handle PDF export
  const handleExportPDF = async () => {
    setExporting(true)
    const success = await exportToPDF(invoiceRef, id)
    if (!success) {
      alert('Failed to export PDF. Please try again.')
    }
    setExporting(false)
  }

  // Handle Excel export
  const handleExportExcel = () => {
    setExporting(true)
    const success = exportToExcel(sortedData, id, paidCount, pendingCount)
    if (!success) {
      alert('Failed to export Excel. Please try again.')
    }
    setExporting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Export Buttons */}
        <ExportButtons
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          isExporting={exporting}
        />

        {/* Invoice Content - This will be captured for PDF */}
        <div ref={invoiceRef}>
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Details</h1>
                <p className="text-gray-600">Customer ID: <span className="font-semibold">{id}</span></p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="text-xs text-gray-600">Paid</p>
                      <p className="text-lg font-bold text-green-600">{paidCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg px-4 py-3 border border-red-200">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-bold">!</span>
                    <div>
                      <p className="text-xs text-gray-600">Pending</p>
                      <p className="text-lg font-bold text-red-600">{pendingCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">U</span>
                        Customer Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">@</span>
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">D</span>
                        Order Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">End</span>
                        Subscription End
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">$</span>
                        Payment Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">T</span>
                        Last Update
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`transition-colors hover:bg-gray-50 ${item.paymentStatus === 'pending'
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'bg-white'
                        }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {item.customerName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.customerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{item.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium">
                          {formatDate(item.orderDate)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 font-medium">
                          {formatDate(item.subscriptionEnd)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${item.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                        >
                          {item.paymentStatus === 'paid' ? (
                            <span className="w-3 h-3 font-bold">✓</span>
                          ) : (
                            <span className="w-3 h-3 font-bold">!</span>
                          )}
                          {item.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          {item.paidAmount && (
                            <span className="ml-1">৳{item.paidAmount}</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDateTime(item.updatedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600">
                Total Records: <span className="font-semibold text-gray-900">{sortedData.length}</span>
              </p>
              <p className="text-gray-600">
                Generated on: <span className="font-semibold text-gray-900">{formatDateTime(new Date())}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice