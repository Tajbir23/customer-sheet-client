import React, { useState } from 'react';

const PLAN_META = {
    business: {
        label: 'ChatGPT Business',
        accent: '6, 182, 212',
        textVar: 'var(--accent-cyan-light)',
        gradient: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
    },
    plus: {
        label: 'ChatGPT Plus',
        accent: '139, 92, 246',
        textVar: 'var(--accent-purple-light)',
        gradient: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
    },
    'gemini-pro': {
        label: 'Gemini Pro',
        accent: '16, 185, 129',
        textVar: 'var(--success-light)',
        gradient: 'linear-gradient(135deg, var(--success) 0%, var(--accent-cyan) 100%)',
    },
};

const ALL_PLANS = ['business', 'plus', 'gemini-pro'];

const SwitchPlanModal = ({ customer, onClose, onConfirm }) => {
    const [isSwitching, setIsSwitching] = useState(false);
    const [pendingTarget, setPendingTarget] = useState(null);

    if (!customer) return null;

    const currentPlan = ALL_PLANS.includes(customer.plan) ? customer.plan : 'business';
    const otherPlans = ALL_PLANS.filter(p => p !== currentPlan);
    const currentMeta = PLAN_META[currentPlan];

    const handleConfirm = async (targetPlan) => {
        try {
            setIsSwitching(true);
            setPendingTarget(targetPlan);
            await onConfirm(customer._id, targetPlan);
        } finally {
            setIsSwitching(false);
            setPendingTarget(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="rounded-2xl shadow-2xl p-6 max-w-md w-full border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `rgba(${currentMeta.accent}, 0.15)` }}
                    >
                        <span className="text-lg font-bold" style={{ color: currentMeta.textVar }}>
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

                {/* Currently in */}
                <div className="mb-4 rounded-xl p-3 text-center border"
                    style={{
                        background: `rgba(${currentMeta.accent}, 0.08)`,
                        borderColor: `rgba(${currentMeta.accent}, 0.3)`,
                    }}
                >
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Currently in</p>
                    <p className="text-sm font-bold" style={{ color: currentMeta.textVar }}>
                        {currentMeta.label}
                    </p>
                </div>

                {/* Destination chooser */}
                <p className="text-[var(--text-secondary)] text-sm font-medium mb-2">Move to:</p>
                <div className="space-y-2 mb-6">
                    {otherPlans.map((target) => {
                        const meta = PLAN_META[target];
                        const isPending = isSwitching && pendingTarget === target;
                        return (
                            <button
                                key={target}
                                disabled={isSwitching}
                                onClick={() => handleConfirm(target)}
                                className="w-full px-4 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                style={{ background: meta.gradient }}
                            >
                                {isPending ? (
                                    <>
                                        <span className="w-3.5 h-3.5 animate-spin font-bold">...</span>
                                        Moving to {meta.label}...
                                    </>
                                ) : (
                                    <>
                                        <span className="w-3.5 h-3.5 font-bold">→</span>
                                        Move to {meta.label}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Cancel */}
                <div className="flex justify-end">
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
                </div>
            </div>
        </div>
    );
};

export default SwitchPlanModal;
