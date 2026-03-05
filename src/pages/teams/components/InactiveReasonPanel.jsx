import React, { useState, useEffect } from "react";
import handleApi from "../../../libs/handleAPi";

const InactiveReasonPanel = ({ gptAccount, isOpen }) => {
    const [reasonData, setReasonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (isOpen && !fetched) {
            fetchReason();
        }
    }, [isOpen]);

    const fetchReason = async () => {
        setLoading(true);
        try {
            const response = await handleApi(
                `/gptTeam/reason?gptAccount=${encodeURIComponent(gptAccount)}`,
                "GET"
            );
            setReasonData(response?.reason || null);
        } catch (error) {
            console.error("Failed to fetch inactive reason:", error);
            setReasonData(null);
        } finally {
            setLoading(false);
            setFetched(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="p-8 border-t border-[var(--border-subtle)]"
            style={{ background: "rgba(239, 68, 68, 0.05)" }}
        >
            <div className="flex items-center gap-2 mb-6">
                <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--error)]">⚠</span>
                    Inactive Reason
                </h4>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="relative w-12 h-12">
                        <div
                            className="absolute inset-0 rounded-full border-4 border-[var(--border-subtle)]"
                        />
                        <div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--error)] animate-spin"
                        />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-tertiary)] animate-pulse">
                        Loading reason...
                    </p>
                </div>
            ) : !reasonData ? (
                <div className="text-center py-8">
                    <div
                        className="rounded-2xl p-6 max-w-sm mx-auto border border-dashed border-[var(--border-subtle)]"
                        style={{ background: "var(--bg-surface)" }}
                    >
                        <div className="text-3xl mb-3 text-[var(--text-tertiary)]">📭</div>
                        <p className="font-medium text-[var(--text-secondary)]">No Data</p>
                        <p className="text-sm text-[var(--text-tertiary)] mt-1">
                            No inactive reason found for this account.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Reason */}
                    <div
                        className="rounded-2xl p-5 border border-[var(--error)]/30"
                        style={{ background: "var(--bg-surface)" }}
                    >
                        <p className="text-xs font-bold text-[var(--error-light)] uppercase tracking-wider mb-2">
                            Reason
                        </p>
                        <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                            {reasonData.reason}
                        </p>
                        {reasonData.timestamp && (
                            <p className="text-xs text-[var(--text-tertiary)] mt-3">
                                Recorded:{" "}
                                {new Date(reasonData.timestamp).toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Screenshot */}
                    {reasonData.screenshot && (
                        <div
                            className="rounded-2xl p-5 border border-[var(--border-subtle)]"
                            style={{ background: "var(--bg-surface)" }}
                        >
                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                                Screenshot
                            </p>
                            <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                                <img
                                    src={
                                        reasonData.screenshot.startsWith("data:")
                                            ? reasonData.screenshot
                                            : `data:image/png;base64,${reasonData.screenshot}`
                                    }
                                    alt="Inactive reason screenshot"
                                    className="w-full h-auto object-contain max-h-[400px] cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => {
                                        window.open(
                                            reasonData.screenshot.startsWith("data:")
                                                ? reasonData.screenshot
                                                : `data:image/png;base64,${reasonData.screenshot}`,
                                            "_blank"
                                        );
                                    }}
                                />
                            </div>
                            <p className="text-xs text-[var(--text-tertiary)] mt-2">
                                Click image to view full size
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InactiveReasonPanel;
