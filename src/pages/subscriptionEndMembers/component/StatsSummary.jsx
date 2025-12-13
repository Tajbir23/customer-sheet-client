import React from "react";

const StatsSummary = ({ totalCount, currentPage, totalPages }) => (
  <div className="mb-6 flex items-center gap-4">
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
      <span className="text-gray-600">Total Records:</span>
      <span className="ml-2 font-bold text-gray-900">{totalCount}</span>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
      <span className="text-gray-600">Page:</span>
      <span className="ml-2 font-bold text-gray-900">
        {currentPage} of {totalPages}
      </span>
    </div>
  </div>
);

export default StatsSummary;
