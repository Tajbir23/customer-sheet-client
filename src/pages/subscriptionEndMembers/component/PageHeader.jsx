import React from "react";


const PageHeader = () => (
  <div className="mb-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-2">
      <div
        className="p-4 rounded-2xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          boxShadow: '0 10px 25px -10px rgba(245, 158, 11, 0.5)',
        }}
      >
        <span className="w-8 h-8 text-white font-bold text-xl flex items-center justify-center">H</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Subscription End History
        </h1>
        <p className="text-[var(--text-tertiary)] mt-1">
          Track members removed due to subscription expiration
        </p>
      </div>
    </div>
  </div>
);

export default PageHeader;
