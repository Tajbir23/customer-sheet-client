import React from 'react';
import { FaHome, FaChevronRight, FaTrash } from 'react-icons/fa';

const PageHeader = () => {
    return (
        <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <FaHome className="w-4 h-4" />
                <FaChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium">Removed Members</span>
            </nav>
            
            {/* Header Content */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <FaTrash className="w-6 h-6 text-red" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Removed Members</h1>
                        <p className="text-gray-600 mt-1">Manage and track removed team members</p>
                    </div>
                </div>
                
                {/* Quick Stats */}
                <div className="hidden lg:flex items-center space-x-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">--</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Total Accounts</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red">--</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Removed Members</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader; 