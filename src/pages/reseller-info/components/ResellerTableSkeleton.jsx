import React from 'react'

const ResellerTableSkeleton = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            {/* Card Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Card Body Skeleton */}
            <div className="p-4 space-y-4">
              {/* Info Items */}
              {[1, 2, 3, 4].map((infoItem) => (
                <div key={infoItem} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResellerTableSkeleton
