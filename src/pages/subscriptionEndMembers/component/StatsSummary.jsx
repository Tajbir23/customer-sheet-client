import React from "react";

const StatsSummary = ({ totalCount, currentPage, totalPages }) => (
  <div className="mb-6 flex flex-wrap items-center gap-4 animate-fade-in">
    <div
      className="rounded-xl px-5 py-3"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span className="text-[var(--text-tertiary)]">Total Records:</span>
      <span
        className="ml-2 font-bold"
        style={{
          background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {totalCount}
      </span>
    </div>
    <div
      className="rounded-xl px-5 py-3"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span className="text-[var(--text-tertiary)]">Page:</span>
      <span className="ml-2 font-bold text-white">
        {currentPage} of {totalPages}
      </span>
    </div>
  </div>
);

export default StatsSummary;
