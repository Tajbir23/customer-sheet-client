import React from 'react';
import { FaSearch, FaExclamationCircle, FaUsers } from 'react-icons/fa';

const ResellerEmptyState = ({ type = 'default', message = 'No teams found' }) => {
    const configs = {
        default: {
            icon: FaUsers,
            color: 'text-gray-400',
            bgColor: 'bg-gray-100',
            title: 'No Teams Available',
            description: message,
        },
        search: {
            icon: FaSearch,
            color: 'text-blue-400',
            bgColor: 'bg-blue-50',
            title: 'No Results Found',
            description: message,
        },
        error: {
            icon: FaExclamationCircle,
            color: 'text-red-400',
            bgColor: 'bg-red-50',
            title: 'Something Went Wrong',
            description: message,
        },
    };

    const config = configs[type] || configs.default;
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className={`${config.bgColor} rounded-3xl p-8 text-center max-w-md mx-auto`}>
                <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`${config.color} text-4xl`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
                <p className="text-gray-600">{config.description}</p>
            </div>
        </div>
    );
};

export default ResellerEmptyState;
