import React from "react"
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa"
import { Pill } from "./primitives"

export const ResultCard = ({ result, onCopy }) => {
    if (!result) return null
    return (
        <div
            className="rounded-2xl p-5 mt-6 animate-fade-in"
            style={{
                background: "var(--bg-card)",
                border:
                    "1px solid " +
                    (result.ok ? "rgba(16,163,127,0.5)" : "rgba(239,68,68,0.5)")
            }}
        >
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <h3 className="text-base font-semibold text-white">{result.title}</h3>
                <div className="flex gap-2">
                    {result.status != null && (
                        <Pill
                            tone={result.ok ? "ok" : "bad"}
                            text={`HTTP ${result.status}`}
                        />
                    )}
                    <Pill
                        tone={result.proxyUsed ? "ok" : "default"}
                        text={result.proxyUsed ? "via proxy" : "direct"}
                    />
                </div>
            </div>

            {result.link ? (
                <>
                    <div
                        className="rounded-lg px-3 py-2.5 font-mono text-xs break-all mb-3"
                        style={{
                            background: "var(--bg-deepest)",
                            border: "1px solid var(--border-subtle)",
                            color: "#6ee7c0"
                        }}
                    >
                        {result.link}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() =>
                                window.open(result.link, "_blank", "noopener")
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
                            style={{ background: "#10a37f" }}
                        >
                            <FaExternalLinkAlt className="w-3 h-3" /> Open Checkout
                        </button>
                        <button
                            onClick={() => onCopy(result.link, "URL copied")}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm"
                            style={{
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-subtle)",
                                color: "var(--text-secondary)"
                            }}
                        >
                            <FaCopy className="w-3 h-3" /> Copy URL
                        </button>
                    </div>
                </>
            ) : result.error ? (
                <div
                    className="rounded-lg px-3 py-2.5 font-mono text-xs break-all"
                    style={{
                        background: "var(--bg-deepest)",
                        border: "1px solid var(--border-subtle)",
                        color: "#fca5a5"
                    }}
                >
                    {result.error}
                </div>
            ) : (
                <div className="text-sm text-[var(--text-muted)] mb-2">
                    No checkout URL in the response. Inspect the body below.
                </div>
            )}

            {result.body !== undefined && (
                <details className="mt-3" open={!result.ok || !result.link}>
                    <summary className="cursor-pointer text-xs text-[var(--text-muted)] hover:text-white">
                        Full response
                    </summary>
                    <pre
                        className="mt-2 rounded-lg p-3 text-xs overflow-auto"
                        style={{
                            background: "var(--bg-deepest)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-tertiary)",
                            maxHeight: 320
                        }}
                    >
                        {JSON.stringify(result.body, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    )
}

export const LastLinkCard = ({ link, generatedAt, onCopy }) => {
    if (!link) return null
    return (
        <div
            className="rounded-2xl p-5 mt-6"
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)"
            }}
        >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                    Last generated link
                </h3>
                {generatedAt && (
                    <span className="text-xs text-[var(--text-muted)]">
                        {new Date(generatedAt).toLocaleString()}
                    </span>
                )}
            </div>
            <div
                className="rounded-lg px-3 py-2.5 font-mono text-xs break-all mb-3"
                style={{
                    background: "var(--bg-deepest)",
                    border: "1px solid var(--border-subtle)",
                    color: "#6ee7c0"
                }}
            >
                {link}
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => window.open(link, "_blank", "noopener")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
                    style={{ background: "#10a37f" }}
                >
                    <FaExternalLinkAlt className="w-3 h-3" /> Open
                </button>
                <button
                    onClick={() => onCopy(link, "URL copied")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)"
                    }}
                >
                    <FaCopy className="w-3 h-3" /> Copy URL
                </button>
            </div>
        </div>
    )
}
