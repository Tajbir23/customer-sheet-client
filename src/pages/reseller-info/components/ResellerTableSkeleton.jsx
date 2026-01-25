import React from 'react'

const ResellerTableSkeleton = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] overflow-hidden animate-pulse">
            {/* Card Header Skeleton */}
            <div className="bg-[var(--bg-surface)] p-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[var(--bg-hover)] rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--bg-hover)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--bg-hover)] rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Card Body Skeleton */}
            <div className="p-4 space-y-4">
              {/* Info Items */}
              {[1, 2, 3, 4].map((infoItem) => (
                <div key={infoItem} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--bg-hover)] rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-[var(--bg-hover)] rounded w-1/4" />
                    <div className="h-3 bg-[var(--bg-hover)] rounded w-3/4" />
                  </div>
                </div>
              ))}

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex-1 h-10 bg-[var(--bg-hover)] rounded-lg" />
                <div className="flex-1 h-10 bg-[var(--bg-hover)] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResellerTableSkeleton
