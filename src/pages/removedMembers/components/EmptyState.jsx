import React from 'react';
import { FaUsers, FaTimes, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const EmptyState = ({ searchEmail, clearSearch }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="text-center py-16 px-8">
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto">
                        {searchEmail ? (
                            <FaSearch className="w-12 h-12 text-gray-400" />
                        ) : (
                            <FaUsers className="w-12 h-12 text-gray-400" />
                        )}
                    </div>
                    {searchEmail && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <FaExclamationTriangle className="w-4 h-4 text-orange" />
                        </div>
                    )}
                </div>
                
                <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {searchEmail ? 'No Results Found' : 'No Removed Members'}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {searchEmail 
                            ? `We couldn't find any removed members matching "${searchEmail}". Try adjusting your search terms or clearing the filter.`
                            : 'Great! There are currently no removed members in your system. All team members are active.'
                        }
                    </p>
                    
                    {searchEmail && (
                        <div className="space-y-3">
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-blue text-white rounded-xl font-medium hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <FaTimes className="w-4 h-4" />
                                Clear Search & Show All
                            </button>
                            
                            <div className="text-sm text-gray-500">
                                or try searching for a different term
                            </div>
                        </div>
                    )}
                    
                    {!searchEmail && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                            <div className="flex items-center justify-center space-x-2 text-green">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">All members are active</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmptyState; 