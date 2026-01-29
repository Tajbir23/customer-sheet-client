import React, { useRef, useEffect } from 'react';

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
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowColumnToggle(false);
            }
        };

        if (showColumnToggle) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColumnToggle, setShowColumnToggle]);

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
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowColumnToggle(!showColumnToggle)}
                        className={`px-4 py-2.5 rounded-lg font-medium text-[var(--text-primary)] flex items-center gap-2 transition-all ${showColumnToggle ? 'bg-[var(--bg-surface)] ring-2 ring-[var(--border-subtle)]' : 'hover:bg-[var(--bg-surface)]'}`}
                        style={{ border: '1px solid var(--border-subtle)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        Columns
                        <svg className={`w-4 h-4 transition-transform duration-200 ${showColumnToggle ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-20 p-2 transform origin-top-right transition-all duration-200 ease-out ${showColumnToggle ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        <div className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)] mb-2">
                            Toggle Columns
                        </div>
                        {Object.keys(visibleColumns).map(key => (
                            <button
                                key={key}
                                onClick={() => toggleColumn(key)}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors group"
                            >
                                <span className="capitalize group-hover:text-[var(--accent-purple)] transition-colors">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${visibleColumns[key] ? 'bg-[var(--accent-purple)] border-[var(--accent-purple)]' : 'border-[var(--border-subtle)]'}`}>
                                    {visibleColumns[key] && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
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
