import React from 'react';
import { FaInfoCircle, FaSearch } from 'react-icons/fa';

const ResultsSummary = ({ searchEmail, membersCount, loading }) => {
    if (loading) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {searchEmail ? (
                                <FaSearch className="w-4 h-4 text-blue" />
                            ) : (
                                <FaInfoCircle className="w-4 h-4 text-blue" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-700">
                                {searchEmail ? (
                                    <>Search results for "<span className="font-bold text-blue">{searchEmail}</span>"</>
                                ) : (
                                    <>All removed members</>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {searchEmail ? 'Filtered results' : 'Complete dataset'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {membersCount}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                            Result{membersCount !== 1 ? 's' : ''} Found
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsSummary; 