import React from 'react';

const ResellerLoadingCard = ({ delay = 0 }) => {
    return (
        <div
            className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Header Skeleton */}
            <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

                <div className="relative z-10">
                    {/* Account Info Skeleton */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gray-300/50 rounded-xl"></div>
                            <div className="flex-1">
                                <div className="w-3/4 h-5 bg-gray-300/50 rounded-lg mb-2"></div>
                                <div className="w-1/2 h-4 bg-gray-300/50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-16 bg-gray-300/50 rounded-2xl"></div>
                            <div className="w-28 h-10 bg-gray-300/50 rounded-xl"></div>
                        </div>
                        <div className="w-32 h-10 bg-gray-300/50 rounded-xl"></div>
                    </div>
                </div>
            </div>

            {/* Body Skeleton */}
            <div className="p-6 border-t-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-28 h-5 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                </div>

                {/* Member Skeletons */}
                <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="w-3/4 h-4 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="w-20 h-8 bg-gray-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ResellerLoadingGrid = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {Array.from({ length: count }, (_, index) => (
                <ResellerLoadingCard key={index} delay={index * 100} />
            ))}
        </div>
    );
};

export default ResellerLoadingGrid;
