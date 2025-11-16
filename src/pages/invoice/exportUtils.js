import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// Generate filename with ID and date
export const generateFileName = (id, extension) => {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
  return `invoice_${id}_${dateStr}_${timeStr}.${extension}`
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Format datetime helper
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Export to PDF
export const exportToPDF = async (invoiceRef, id) => {
  if (!invoiceRef.current) return false
  
  try {
    const element = invoiceRef.current
    
    // Clone the element to manipulate without affecting the original
    const clonedElement = element.cloneNode(true)
    
    // Create a temporary container with fixed width for proper rendering
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '1920px' // Desktop width for full table
    tempContainer.style.background = '#f9fafb'
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)
    
    // Wait a bit for styles to compute
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Force all responsive containers to full width
    const maxWidthContainers = clonedElement.querySelectorAll('.max-w-7xl, .mx-auto')
    maxWidthContainers.forEach(container => {
      container.style.maxWidth = 'none'
      container.style.width = '100%'
    })
    
    // Force table container to show all content
    const tableContainer = clonedElement.querySelector('.overflow-x-auto')
    if (tableContainer) {
      tableContainer.style.overflow = 'visible'
      tableContainer.style.width = '100%'
    }
    
    // Force table to full width
    const table = clonedElement.querySelector('table')
    if (table) {
      table.style.width = '100%'
      table.style.tableLayout = 'fixed'
    }
    
    // Make all cells visible with proper spacing
    const allCells = clonedElement.querySelectorAll('td, th')
    allCells.forEach(cell => {
      cell.style.whiteSpace = 'normal'
      cell.style.overflow = 'visible'
      cell.style.wordBreak = 'break-word'
    })
    
    // CRITICAL: Convert all computed styles to inline styles
    // This prevents oklch color generation
    const allElements = clonedElement.querySelectorAll('*')
    
    // Color mapping for common Tailwind classes
    const colorMapping = {
      // Background colors
      'rgba(255, 255, 255': '#ffffff',
      'rgba(249, 250, 251': '#f9fafb',
      'rgba(243, 244, 246': '#f3f4f6',
      'rgba(239, 246, 255': '#eff6ff',
      'rgba(219, 234, 254': '#dbeafe',
      'rgba(37, 99, 235': '#2563eb',
      'rgba(29, 78, 216': '#1d4ed8',
      'rgba(240, 253, 244': '#f0fdf4',
      'rgba(220, 252, 231': '#dcfce7',
      'rgba(22, 163, 74': '#16a34a',
      'rgba(21, 128, 61': '#15803d',
      'rgba(254, 242, 242': '#fef2f2',
      'rgba(254, 226, 226': '#fee2e2',
      'rgba(220, 38, 38': '#dc2626',
      'rgba(185, 28, 28': '#b91c1c',
      'rgba(75, 85, 99': '#4b5563',
      'rgba(55, 65, 81': '#374151',
      'rgba(17, 24, 39': '#111827',
      'rgba(229, 231, 235': '#e5e7eb',
      'rgba(187, 247, 208': '#bbf7d0',
      'rgba(254, 202, 202': '#fecaca',
      'rgba(191, 219, 254': '#bfdbfe'
    }
    
    allElements.forEach(el => {
      // Skip SVG elements - they have read-only className
      if (el instanceof SVGElement) {
        return
      }
      
      // Get computed styles
      const computedStyle = window.getComputedStyle(el)
      let bgColor = computedStyle.backgroundColor
      let color = computedStyle.color
      let borderColor = computedStyle.borderColor
      
      // Convert rgba to hex if possible
      for (const [rgba, hex] of Object.entries(colorMapping)) {
        if (bgColor.startsWith(rgba)) bgColor = hex
        if (color.startsWith(rgba)) color = hex
        if (borderColor.startsWith(rgba)) borderColor = hex
      }
      
      // Only fix unsupported colors, keep everything else
      const hasUnsupportedBgColor = bgColor.includes('oklch') || bgColor.includes('oklab')
      const hasUnsupportedColor = color.includes('oklch') || color.includes('oklab')
      const hasUnsupportedBorderColor = borderColor.includes('oklch') || borderColor.includes('oklab')
      
      // Apply inline styles ONLY for problematic colors
      if (hasUnsupportedBgColor) {
        // Map to appropriate color based on element class
        if (el.classList.contains('bg-white')) el.style.backgroundColor = '#ffffff'
        else if (el.classList.contains('bg-gray-50')) el.style.backgroundColor = '#f9fafb'
        else if (el.classList.contains('bg-blue-50')) el.style.backgroundColor = '#eff6ff'
        else if (el.classList.contains('bg-blue-100')) el.style.backgroundColor = '#dbeafe'
        else if (el.classList.contains('bg-blue-600')) el.style.backgroundColor = '#2563eb'
        else if (el.classList.contains('bg-blue-700')) el.style.backgroundColor = '#1d4ed8'
        else if (el.classList.contains('bg-green-50')) el.style.backgroundColor = '#f0fdf4'
        else if (el.classList.contains('bg-green-100')) el.style.backgroundColor = '#dcfce7'
        else if (el.classList.contains('bg-red-50')) el.style.backgroundColor = '#fef2f2'
        else if (el.classList.contains('bg-red-100')) el.style.backgroundColor = '#fee2e2'
        else if (el.classList.contains('from-blue-600') || el.classList.contains('to-blue-700')) el.style.backgroundColor = '#2563eb'
        else if (el.classList.contains('from-gray-50') || el.classList.contains('to-blue-50')) el.style.backgroundColor = '#f9fafb'
        else el.style.backgroundColor = '#ffffff'
      }
      
      if (hasUnsupportedColor) {
        if (el.classList.contains('text-white')) el.style.color = '#ffffff'
        else if (el.classList.contains('text-gray-600')) el.style.color = '#4b5563'
        else if (el.classList.contains('text-gray-900')) el.style.color = '#111827'
        else if (el.classList.contains('text-blue-600')) el.style.color = '#2563eb'
        else if (el.classList.contains('text-green-600')) el.style.color = '#16a34a'
        else if (el.classList.contains('text-green-700')) el.style.color = '#15803d'
        else if (el.classList.contains('text-red-600')) el.style.color = '#dc2626'
        else if (el.classList.contains('text-red-700')) el.style.color = '#b91c1c'
        else el.style.color = '#000000'
      }
      
      if (hasUnsupportedBorderColor) {
        if (el.classList.contains('border-gray-200')) el.style.borderColor = '#e5e7eb'
        else if (el.classList.contains('border-green-200')) el.style.borderColor = '#bbf7d0'
        else if (el.classList.contains('border-red-200')) el.style.borderColor = '#fecaca'
        else if (el.classList.contains('border-blue-200')) el.style.borderColor = '#bfdbfe'
        else el.style.borderColor = '#e5e7eb'
      }
      
      // Remove gradients (they don't work in html2canvas anyway)
      if (el.classList.contains('bg-gradient-to-r') || el.classList.contains('bg-gradient-to-br')) {
        el.style.backgroundImage = 'none'
        // Set solid color for gradient backgrounds
        if (el.classList.contains('from-blue-600')) el.style.backgroundColor = '#2563eb'
        else if (el.classList.contains('from-gray-50')) el.style.backgroundColor = '#f9fafb'
      }
    })
    
    // Capture with ignoreElements to skip problematic elements
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#f9fafb',
      width: 1920,
      ignoreElements: (element) => {
        // Ignore all SVG elements to avoid oklch color parsing issues
        return element.tagName === 'svg' || element.tagName === 'SVG' || 
               element.tagName === 'path' || element.tagName === 'PATH' ||
               element.closest('svg') !== null
      },
      onclone: (clonedDoc, clonedEl) => {
        // Additional safety check - remove any remaining oklch/oklab
        const allEls = clonedEl.querySelectorAll('*')
        allEls.forEach(el => {
          const computedStyle = window.getComputedStyle(el)
          const bgColor = computedStyle.backgroundColor
          const color = computedStyle.color
          const borderColor = computedStyle.borderColor
          
          if (bgColor && (bgColor.includes('oklch') || bgColor.includes('oklab'))) {
            el.style.backgroundColor = '#ffffff'
          }
          if (color && (color.includes('oklch') || color.includes('oklab'))) {
            el.style.color = '#000000'
          }
          if (borderColor && (borderColor.includes('oklch') || borderColor.includes('oklab'))) {
            el.style.borderColor = '#e5e7eb'
          }
        })
      }
    })
    
    // Remove temporary container
    document.body.removeChild(tempContainer)
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 10
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    
    // Add export date and time at the bottom
    const exportDateTime = formatDateTime(new Date())
    
    pdf.setFontSize(10)
    pdf.setTextColor(100)
    pdf.text(`Exported on: ${exportDateTime}`, 10, pdfHeight - 10)
    
    pdf.save(generateFileName(id, 'pdf'))
    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    // Clean up temporary container if it exists
    const tempContainer = document.querySelector('div[style*="-9999px"]')
    if (tempContainer) {
      document.body.removeChild(tempContainer)
    }
    return false
  }
}

// Export to Excel (CSV format that opens in Excel)
export const exportToExcel = (sortedData, id, paidCount, pendingCount) => {
  try {
    const exportDateTime = formatDateTime(new Date())
    
    // Create CSV content
    let csvContent = ''
    
    // Add summary
    csvContent += `Customer ID,${id}\n`
    csvContent += `Total Records,${sortedData.length},Paid,${paidCount},Pending,${pendingCount}\n`
    csvContent += '\n' // Empty row
    
    // Add headers
    csvContent += 'No.,Customer Name,Email,Order Date,Subscription End,Payment Status,Amount,Last Update\n'
    
    // Add data rows
    sortedData.forEach((item, index) => {
      const row = [
        index + 1,
        `"${item.customerName}"`,
        `"${item.email}"`,
        formatDate(item.orderDate),
        formatDate(item.subscriptionEnd),
        item.paymentStatus === 'paid' ? 'Paid' : 'Pending',
        item.paidAmount || 'N/A',
        `"${formatDateTime(item.updatedAt)}"`
      ]
      csvContent += row.join(',') + '\n'
    })
    
    // Add footer
    csvContent += '\n' // Empty row
    csvContent += `Exported on,${exportDateTime}\n`
    
    // Create blob and download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', generateFileName(id, 'csv'))
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return true
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return false
  }
}

