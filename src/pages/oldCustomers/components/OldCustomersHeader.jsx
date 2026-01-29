import React from 'react';

const OldCustomersHeader = () => {
    return (
        <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-3 rounded-xl"
                            style={{
                                background: 'linear-gradient(135deg, var(--warning) 0%, var(--warning-light) 100%)',
                                boxShadow: '0 8px 20px -8px rgba(245, 158, 11, 0.5)',
                            }}
                        >
                            <span className="w-6 h-6 text-white font-bold text-xl flex items-center justify-center">O</span>
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                                Old Customers
                            </h1>
                            <p className="text-[var(--text-tertiary)] mt-1">
                                Manage customers who have not renewed their subscription
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OldCustomersHeader;
