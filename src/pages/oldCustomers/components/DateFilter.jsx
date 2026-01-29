import React from 'react';

const DateFilter = ({ firstSelect, setFirstSelect, secondSelect, setSecondSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Start Date (First Select)</label>
                <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] transition-all duration-300"
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        colorScheme: 'dark',
                    }}
                    value={firstSelect}
                    onChange={(e) => setFirstSelect(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">End Date (Second Select)</label>
                <input
                    type="date"
                    disabled={!firstSelect}
                    className={`w-full px-4 py-3 rounded-xl text-[var(--text-primary)] transition-all duration-300 ${!firstSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        colorScheme: 'dark',
                    }}
                    value={secondSelect}
                    onChange={(e) => setSecondSelect(e.target.value)}
                />
            </div>
        </div>
    );
};

export default DateFilter;
