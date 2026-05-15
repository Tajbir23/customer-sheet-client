import React, { useState } from 'react';

const SwitchPlanModal = ({ customer, onClose, onConfirm }) => {
    const [isSwitching, setIsSwitching] = useState(false);

    if (!customer) return null;

    const currentPlan = customer.plan === 'plus' ? 'plus' : 'business';
    const targetPlan = currentPlan === 'plus' ? 'business' : 'plus';

    const currentLabel = currentPlan === 'plus' ? 'ChatGPT Plus' : 'ChatGPT Business';
    const targetLabel = targetPlan === 'plus' ? 'ChatGPT Plus' : 'ChatGPT Business';

    const handleConfirm = async () => {
        try {
            setIsSwitching(true);
            await onConfirm(customer._id, targetPlan);
        } finally {
            setIsSwitching(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="rounded-2xl shadow-2xl p-6 max-w-md w-full border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                            background: targetPlan === 'plus'
                                ? 'rgba(139, 92, 246, 0.15)'
                                : 'rgba(6, 182, 212, 0.15)'
                        }}
                    >
                        <span className="text-lg font-bold"
                            style={{ color: targetPlan === 'plus' ? 'var(--accent-purple-light)' : 'var(--accent-cyan-light)' }}
                        >
                            ⇄
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">Move Customer</h2>
                </div>

                {/* Customer info */}
                <div className="mb-5 rounded-xl p-4 border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
                    <div className="mb-2 truncate">
                        <span className="text-[var(--text-secondary)] font-medium">Name:</span>
                        <span className="text-white ml-2 font-semibold">{customer.customerName}</span>
                    </div>
                    <div className="truncate">
                        <span className="text-[var(--text-secondary)] font-medium">Email:</span>
                        <span className="text-[var(--text-primary)] ml-2">{customer.email}</span>
                    </div>
                </div>

                {/* From -> To visual */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="flex-1 rounded-xl p-3 text-center border"
                        style={{
                            background: currentPlan === 'plus' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(6, 182, 212, 0.08)',
                            borderColor: currentPlan === 'plus' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.3)',
                        }}
                    >
                        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">From</p>
                        <p className="text-sm font-bold"
                            style={{ color: currentPlan === 'plus' ? 'var(--accent-purple-light)' : 'var(--accent-cyan-light)' }}
                        >
                            {currentLabel}
                        </p>
                    </div>
                    <span className="text-2xl text-[var(--text-muted)] font-bold">→</span>
                    <div className="flex-1 rounded-xl p-3 text-center border"
                        style={{
                            background: targetPlan === 'plus' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            borderColor: targetPlan === 'plus' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)',
                        }}
                    >
                        <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">To</p>
                        <p className="text-sm font-bold"
                            style={{ color: targetPlan === 'plus' ? 'var(--accent-purple-light)' : 'var(--accent-cyan-light)' }}
                        >
                            {targetLabel}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        disabled={isSwitching}
                        className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            borderColor: 'var(--border-subtle)'
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isSwitching}
                        className="px-5 py-2.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                            background: targetPlan === 'plus'
                                ? 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)'
                                : 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)'
                        }}
                        onClick={handleConfirm}
                    >
                        {isSwitching ? (
                            <>
                                <span className="w-3.5 h-3.5 animate-spin font-bold">...</span>
                                Moving...
                            </>
                        ) : (
                            <>
                                <span className="w-3.5 h-3.5 font-bold">⇄</span>
                                Move to {targetLabel}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwitchPlanModal;
