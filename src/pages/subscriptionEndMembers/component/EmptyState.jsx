import React from "react";


const EmptyState = () => (
  <div className="text-center py-16 animate-fade-in">
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span className="w-10 h-10 text-[var(--text-muted)] font-bold text-4xl block">H</span>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">
      No Subscription End History
    </h3>
    <p className="text-[var(--text-tertiary)]">
      There are no records of expired subscriptions yet.
    </p>
  </div>
);

export default EmptyState;
