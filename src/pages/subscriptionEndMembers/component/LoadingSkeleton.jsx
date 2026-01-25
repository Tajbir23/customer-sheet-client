import React from "react";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-2xl overflow-hidden animate-fade-in"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          animationDelay: `${i * 100}ms`,
        }}
      >
        <div
          className="px-6 py-5"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 skeleton rounded-2xl" />
            <div className="flex-1">
              <div className="h-5 skeleton rounded w-48 mb-2" />
              <div className="h-4 skeleton rounded w-24" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 skeleton rounded-xl" />
            <div className="h-20 skeleton rounded-xl" />
            <div className="h-20 skeleton rounded-xl" />
            <div className="h-20 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
