import React from 'react'

const LoadingCard = ({ delay = 0 }) => {
  return (
    <div 
      className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Status Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="w-16 h-8 bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
          
          {/* Account Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="w-3/4 h-6 bg-gray-300 rounded-lg mb-2 animate-pulse"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="ml-16">
              <div className="w-1/3 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="w-24 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Member Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LoadingGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {Array.from({ length: count }, (_, index) => (
        <LoadingCard key={index} delay={index * 100} />
      ))}
    </div>
  )
}

export default LoadingGrid 