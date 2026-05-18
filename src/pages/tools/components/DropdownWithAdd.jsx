import React, { useRef, useState } from "react"
import { FaPlus, FaTimes } from "react-icons/fa"

const DropdownWithAdd = ({
    value,
    onChange,
    presets = [],
    customs = [],
    onAddCustom,
    onRemoveCustom,
    placeholder = "Add new value"
}) => {
    const [adding, setAdding] = useState(false)
    const [newValue, setNewValue] = useState("")
    const [busy, setBusy] = useState(false)
    const inputRef = useRef(null)

    const presetSet = new Set(presets)
    const customsFiltered = customs.filter((c) => c && !presetSet.has(c.value))
    const knownSet = new Set([...presets, ...customsFiltered.map((c) => c.value)])
    const isOrphan = !!value && !knownSet.has(value)
    const currentCustom = customsFiltered.find((c) => c.value === value)
    const canRemoveCurrent = !!currentCustom?.mine

    const startAdd = () => {
        setAdding(true)
        setNewValue("")
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const commitAdd = async () => {
        const v = newValue.trim()
        if (!v) {
            setAdding(false)
            return
        }
        if (presetSet.has(v) || customsFiltered.some((c) => c.value === v)) {
            // already exists - just select it
            onChange(v)
            setNewValue("")
            setAdding(false)
            return
        }
        if (typeof onAddCustom !== "function") {
            onChange(v)
            setNewValue("")
            setAdding(false)
            return
        }
        try {
            setBusy(true)
            const item = await onAddCustom(v)
            if (item && item.value) {
                onChange(item.value)
            }
        } finally {
            setBusy(false)
            setNewValue("")
            setAdding(false)
        }
    }

    const cancelAdd = () => {
        setAdding(false)
        setNewValue("")
    }

    const handleRemove = async () => {
        if (!currentCustom || !canRemoveCurrent || typeof onRemoveCustom !== "function") return
        try {
            setBusy(true)
            await onRemoveCustom(currentCustom._id)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div>
            <div className="flex gap-2">
                <select
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
                    style={{
                        background: "var(--bg-deepest)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)"
                    }}
                >
                    {isOrphan && (
                        <option value={value}>{value} (unsaved)</option>
                    )}
                    {presets.length > 0 && (
                        <optgroup label="Presets">
                            {presets.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {customsFiltered.length > 0 && (
                        <optgroup label="Shared">
                            {customsFiltered.map((c) => (
                                <option key={c._id} value={c.value}>
                                    {c.value}
                                    {c.mine ? " (yours)" : ""}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
                <button
                    type="button"
                    onClick={startAdd}
                    disabled={busy}
                    title="Add new value"
                    className="shrink-0 px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)"
                    }}
                >
                    <FaPlus className="w-3 h-3" /> Add
                </button>
                {canRemoveCurrent && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={busy}
                        title="Remove this value (only the creator can do this)"
                        className="shrink-0 px-3 py-2.5 rounded-lg text-sm font-medium flex items-center disabled:opacity-50"
                        style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.4)",
                            color: "#fca5a5"
                        }}
                    >
                        <FaTimes className="w-3 h-3" />
                    </button>
                )}
            </div>
            {adding && (
                <div className="flex gap-2 mt-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                commitAdd()
                            } else if (e.key === "Escape") {
                                cancelAdd()
                            }
                        }}
                        placeholder={placeholder}
                        className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none"
                        style={{
                            background: "var(--bg-deepest)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-primary)"
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10a37f")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
                    />
                    <button
                        type="button"
                        onClick={commitAdd}
                        disabled={busy}
                        className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                        style={{ background: "#10a37f" }}
                    >
                        {busy ? "Saving…" : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={cancelAdd}
                        disabled={busy}
                        className="shrink-0 px-4 py-2.5 rounded-lg text-sm disabled:opacity-50"
                        style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-secondary)"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

export default DropdownWithAdd
