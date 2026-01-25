import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden animate-pulse">
                    {/* Header Skeleton */}
                    <div className="bg-[var(--bg-surface)] px-6 py-5 border-b border-[var(--border-subtle)]">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-[var(--bg-hover)] rounded-2xl"></div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--bg-elevated)] rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-5 bg-[var(--bg-hover)] rounded-lg w-48 mb-2"></div>
                                    <div className="h-4 bg-[var(--bg-elevated)] rounded w-24"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="h-5 bg-[var(--bg-hover)] rounded w-20 mb-2"></div>
                                <div className="h-3 bg-[var(--bg-elevated)] rounded w-16"></div>
                            </div>
                        </div>
                    </div>

                    {/* Body Skeleton */}
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-4 bg-[var(--bg-hover)] rounded w-32"></div>
                                <div className="h-4 bg-[var(--bg-elevated)] rounded w-20"></div>
                            </div>

                            <div className="space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center justify-between p-3 bg-[var(--bg-surface)] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[var(--bg-hover)] rounded-lg"></div>
                                            <div className="h-4 bg-[var(--bg-hover)] rounded w-40"></div>
                                        </div>
                                        <div className="w-6 h-6 bg-[var(--bg-hover)] rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="bg-[var(--bg-surface)] px-6 py-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-[var(--bg-hover)] rounded w-32"></div>
                            <div className="h-4 bg-[var(--bg-elevated)] rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;