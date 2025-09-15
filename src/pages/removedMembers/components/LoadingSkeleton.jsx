import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    {/* Header Skeleton */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded-lg w-48 mb-2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-16"></div>
                            </div>
                        </div>
                    </div>

                    {/* Body Skeleton */}
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-100 rounded w-20"></div>
                            </div>
                            
                            <div className="space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                                        </div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-100 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton; 