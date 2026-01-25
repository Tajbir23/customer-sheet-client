import React from 'react'


const ExportButtons = ({ onExportPDF, onExportExcel, isExporting }) => {
  return (
    <div className="mb-6 flex justify-end gap-3">
      <button
        onClick={onExportPDF}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-bold">PDF</span>
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </button>

      <button
        onClick={onExportExcel}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-bold">XLS</span>
        {isExporting ? 'Exporting...' : 'Export Excel'}
      </button>
    </div>
  )
}

export default ExportButtons

