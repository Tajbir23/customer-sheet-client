import React from "react"

export const SectionTitle = ({ title, badge, hint }) => (
    <div className="flex items-center gap-3 mt-7 mb-3">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {badge && (
            <span
                className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full text-white"
                style={{ background: "#10a37f" }}
            >
                {badge}
            </span>
        )}
        {hint && <span className="text-xs text-[var(--text-muted)]">{hint}</span>}
    </div>
)

export const Card = ({ children, title, wide }) => (
    <div
        className={`rounded-2xl p-5 ${wide ? "md:col-span-2" : ""}`}
        style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)"
        }}
    >
        {title && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                {title}
            </h3>
        )}
        {children}
    </div>
)

export const Field = ({ label, hint, children }) => (
    <div className="mb-3 last:mb-0">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
            {label}
        </label>
        {children}
        {hint && (
            <div className="text-[11px] text-[var(--text-muted)] mt-1">{hint}</div>
        )}
    </div>
)

export const Input = ({ value, onChange, placeholder, maxLength, inputMode }) => (
    <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
            background: "var(--bg-deepest)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)"
        }}
        onFocus={(e) => (e.target.style.borderColor = "#10a37f")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
    />
)

export const Select = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
        style={{
            background: "var(--bg-deepest)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)"
        }}
    >
        {options.map((o) => (
            <option key={o.value} value={o.value}>
                {o.label}
            </option>
        ))}
    </select>
)

export const Pill = ({ text, tone = "default" }) => {
    const styles =
        tone === "ok"
            ? {
                background: "rgba(16,163,127,0.12)",
                border: "1px solid rgba(16,163,127,0.4)",
                color: "#6ee7c0"
            }
            : tone === "bad"
                ? {
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#fca5a5"
                }
                : {
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)"
                }
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={styles}
        >
            {text}
        </span>
    )
}

export const ToggleRow = ({ label, hint, checked, onChange }) => (
    <div className="flex items-center justify-between gap-3 mb-3 last:mb-0">
        <div>
            <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
            {hint && <div className="text-[11px] text-[var(--text-muted)]">{hint}</div>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="relative shrink-0 rounded-full transition-colors"
            style={{
                width: 40,
                height: 22,
                background: checked ? "rgba(16,163,127,0.25)" : "var(--bg-deepest)",
                border: "1px solid " + (checked ? "#10a37f" : "var(--border-subtle)")
            }}
            aria-pressed={checked}
        >
            <span
                className="absolute top-0.5 rounded-full transition-all"
                style={{
                    width: 16,
                    height: 16,
                    left: checked ? 20 : 2,
                    background: checked ? "#10a37f" : "#6b7280"
                }}
            />
        </button>
    </div>
)
