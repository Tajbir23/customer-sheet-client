import React from 'react'

const LoadingCard = () => {
  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 skeleton rounded-lg"></div>
            <div>
              <div className="w-32 h-4 skeleton mb-2"></div>
              <div className="w-20 h-3 skeleton"></div>
            </div>
          </div>
          <div className="w-16 h-6 skeleton rounded-full"></div>
        </div>
      </div>
      
      {/* Body */}
      <div className="card-body">
        <div className="space-y-4">
          {/* Members Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-24 h-4 skeleton"></div>
              <div className="w-16 h-6 skeleton rounded"></div>
            </div>
            
            {/* Member Skeletons */}
            <div className="space-y-2">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 skeleton rounded-full"></div>
                  <div className="w-24 h-3 skeleton"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="w-8 h-6 skeleton mx-auto mb-1"></div>
              <div className="w-12 h-3 skeleton mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="w-8 h-6 skeleton mx-auto mb-1"></div>
              <div className="w-12 h-3 skeleton mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="flex items-center justify-between">
          <div className="w-24 h-8 skeleton rounded"></div>
          <div className="w-28 h-8 skeleton rounded"></div>
        </div>
      </div>
    </div>
  )
}

const LoadingGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  )
}

export default LoadingGrid 