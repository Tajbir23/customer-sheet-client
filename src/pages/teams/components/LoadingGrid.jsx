import React from 'react'

const LoadingCard = ({ delay = 0 }) => {
  return (
    <div
      className="rounded-3xl overflow-hidden border border-[var(--border-subtle)]"
      style={{
        background: 'var(--bg-card)',
      }}
    >
      {/* Header */}
      <div className="p-8 relative border-b border-[var(--border-subtle)]">
        <div className="relative z-10">
          {/* Status Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 skeleton rounded-full" />
              <div className="w-20 h-4 skeleton rounded-full" />
            </div>
            <div className="w-16 h-8 skeleton rounded-xl" />
          </div>

          {/* Account Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 skeleton rounded-xl" />
              <div className="flex-1">
                <div className="w-3/4 h-6 skeleton rounded-lg mb-2" />
                <div className="w-1/2 h-4 skeleton rounded-lg" />
              </div>
            </div>
            <div className="ml-16">
              <div className="w-1/3 h-4 skeleton rounded-lg" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-full h-12 skeleton rounded-xl" />
            <div className="w-full h-12 skeleton rounded-xl" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 skeleton rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="w-16 h-6 skeleton rounded-full" />
            <div className="w-24 h-8 skeleton rounded-xl" />
          </div>
        </div>

        {/* Member Skeleton */}
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)]"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="w-10 h-10 skeleton rounded-full" />
              <div className="flex-1">
                <div className="w-3/4 h-4 skeleton rounded-lg mb-2" />
                <div className="w-1/2 h-3 skeleton rounded-lg" />
              </div>
              <div className="w-8 h-8 skeleton rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LoadingGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <LoadingCard key={index} delay={index * 100} />
      ))}
    </div>
  )
}

export default LoadingGrid