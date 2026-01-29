import React from 'react';

const ActionToolbar = ({
    search,
    setSearch,
    showColumnToggle,
    setShowColumnToggle,
    visibleColumns,
    toggleColumn,
    selectedCount,
    handleSend
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            {/* Search */}
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-[var(--text-primary)]"
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                {/* Column Toggle */}
                <div className="relative">
                    <button
                        onClick={() => setShowColumnToggle(!showColumnToggle)}
                        className="px-4 py-2.5 rounded-lg font-medium text-[var(--text-primary)] flex items-center gap-2 transition-colors hover:bg-[var(--bg-surface)]"
                        style={{ border: '1px solid var(--border-subtle)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        Columns
                    </button>
                    {showColumnToggle && (
                        <div
                            className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-10 p-2"
                            style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            {Object.keys(visibleColumns).map(key => (
                                <button
                                    key={key}
                                    onClick={() => toggleColumn(key)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                >
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    {visibleColumns[key] && (
                                        <svg className="w-4 h-4 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={selectedCount === 0}
                    className={`px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 transition-all ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                    style={{
                        background: selectedCount > 0 ? 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)' : 'var(--bg-surface)',
                        boxShadow: selectedCount > 0 ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                    }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message ({selectedCount})
                </button>
            </div>
        </div>
    );
};

export default ActionToolbar;
