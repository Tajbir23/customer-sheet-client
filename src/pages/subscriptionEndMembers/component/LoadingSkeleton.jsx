import React from "react";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
      >
        <div className="bg-gray-100 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-16 bg-gray-100 rounded-xl" />
            <div className="h-16 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
