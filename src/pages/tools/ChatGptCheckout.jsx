import React, { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { FaCreditCard, FaCopy, FaExternalLinkAlt, FaSync, FaPlus, FaTimes } from "react-icons/fa"
import handleApi from "../../libs/handleAPi"

const PRESET_PLAN_NAMES = [
    "chatgptplusplan"
]

const PRESET_PROMO_CAMPAIGN_IDS = [
    "plus-1-month-free"
]

const DEFAULTS = {
    accessToken: "",
    sessionRaw: "",
    proxy: "",
    planName: "chatgptplusplan",
    checkoutUiMode: "hosted",
    cancelUrl: "https://chatgpt.com/#pricing",
    country: "ID",
    currency: "IDR",
    promoEnabled: true,
    promoCampaignId: "plus-1-month-free",
    couponFromQuery: true,
    entryPoint: "team_workspace_purchase_modal",
    workspaceName: "My Workspace",
    priceInterval: "month",
    seatQuantity: 5
}

function parseSession(raw) {
    const s = (raw || "").trim()
    if (!s) return { token: null, session: null }
    // Plain JWT pasted directly
    if (s.startsWith("eyJ") && !s.startsWith("{")) {
        return { token: s, session: { accessToken: s } }
    }
    try {
        const obj = JSON.parse(s)
        if (obj && typeof obj === "object") {
            return { token: obj.accessToken || null, session: obj }
        }
    } catch {
        /* ignore */
    }
    return { token: null, session: null }
}

function fmtExpires(iso) {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d)) return iso
    const ms = d.getTime() - Date.now()
    const days = Math.floor(ms / 86400000)
    const human = d.toISOString().slice(0, 10)
    if (ms < 0) return `${human} (expired)`
    return `${human} (${days}d left)`
}

const isTeamPlan = (planName) =>
    (planName || "").trim().toLowerCase().startsWith("chatgptteam")

const ChatGptCheckout = () => {
    const [form, setForm] = useState(DEFAULTS)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [lastPaymentLink, setLastPaymentLink] = useState("")
    const [lastGeneratedAt, setLastGeneratedAt] = useState(null)

    // Shared (global) custom options, with per-item ownership flag
    const [customPlanList, setCustomPlanList] = useState([])
    const [customPromoList, setCustomPromoList] = useState([])

    const autoSaveTimer = useRef(null)
    const initialized = useRef(false)

    // ----- Load settings on mount -----
    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const resp = await handleApi("/checkout/settings", "GET")
                if (!mounted) return
                if (resp?.success && resp.data) {
                    const d = resp.data
                    setForm((prev) => ({
                        ...prev,
                        // accessToken is intentionally NOT persisted; user must paste each session
                        proxy: d.proxy ?? "",
                        planName: d.planName ?? prev.planName,
                        checkoutUiMode: d.checkoutUiMode ?? prev.checkoutUiMode,
                        cancelUrl: d.cancelUrl ?? prev.cancelUrl,
                        country: d.country ?? prev.country,
                        currency: d.currency ?? prev.currency,
                        promoEnabled:
                            typeof d.promoEnabled === "boolean" ? d.promoEnabled : prev.promoEnabled,
                        promoCampaignId: d.promoCampaignId ?? prev.promoCampaignId,
                        couponFromQuery:
                            typeof d.couponFromQuery === "boolean"
                                ? d.couponFromQuery
                                : prev.couponFromQuery,
                        entryPoint: d.entryPoint ?? prev.entryPoint,
                        workspaceName: d.workspaceName ?? prev.workspaceName,
                        priceInterval: d.priceInterval ?? prev.priceInterval,
                        seatQuantity:
                            typeof d.seatQuantity === "number" ? d.seatQuantity : prev.seatQuantity
                    }))
                    setLastPaymentLink(d.lastPaymentLink || "")
                    setLastGeneratedAt(d.lastGeneratedAt || null)
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (mounted) {
                    setInitialLoading(false)
                    // mark initialised after this render's state has been applied
                    setTimeout(() => {
                        initialized.current = true
                    }, 0)
                }
            }
        }
        load()
        return () => {
            mounted = false
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        }
    }, [])

    // ----- Persist session textarea -> accessToken -----
    useEffect(() => {
        const { token } = parseSession(form.sessionRaw)
        const next = token || ""
        if (next !== form.accessToken) {
            setForm((prev) => ({ ...prev, accessToken: next }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.sessionRaw])

    // ----- Auto-save to DB (debounced) -----
    useEffect(() => {
        if (!initialized.current) return
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(() => {
            persistSettings()
        }, 800)
        return () => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        form.proxy,
        form.planName,
        form.checkoutUiMode,
        form.cancelUrl,
        form.country,
        form.currency,
        form.promoEnabled,
        form.promoCampaignId,
        form.couponFromQuery,
        form.entryPoint,
        form.workspaceName,
        form.priceInterval,
        form.seatQuantity
    ])

    // ----- Load shared custom options (separate from per-user settings) -----
    useEffect(() => {
        let mounted = true
        const loadOptions = async () => {
            try {
                const resp = await handleApi("/checkout/custom-options", "GET")
                if (!mounted) return
                if (resp?.success && resp.data) {
                    setCustomPlanList(Array.isArray(resp.data.planNames) ? resp.data.planNames : [])
                    setCustomPromoList(Array.isArray(resp.data.promoCampaignIds) ? resp.data.promoCampaignIds : [])
                }
            } catch (err) {
                console.error("loadCustomOptions failed", err)
            }
        }
        loadOptions()
        return () => {
            mounted = false
        }
    }, [])

    const addCustomOption = async (type, value) => {
        try {
            const resp = await handleApi("/checkout/custom-options", "POST", { type, value })
            if (!resp?.success || !resp.data) {
                toast.error(resp?.error || "Failed to add")
                return null
            }
            const item = resp.data
            const updater = (list) => {
                if (list.some((x) => x._id === item._id)) return list
                return [...list, item]
            }
            if (type === "planName") setCustomPlanList(updater)
            else if (type === "promoCampaignId") setCustomPromoList(updater)
            return item
        } catch (err) {
            console.error("addCustomOption failed", err)
            toast.error("Failed to add")
            return null
        }
    }

    const removeCustomOption = async (type, id) => {
        try {
            const list = type === "planName" ? customPlanList : customPromoList
            const removedValue = list.find((x) => x._id === id)?.value

            const resp = await handleApi(`/checkout/custom-options/${id}`, "DELETE")
            if (!resp?.success) {
                toast.error(resp?.error || "Failed to remove")
                return false
            }
            if (type === "planName") {
                setCustomPlanList((l) => l.filter((x) => x._id !== id))
                // If the removed value was selected, fall back to first preset so
                // auto-save updates the user's settings DB (no orphan persists).
                if (removedValue && form.planName === removedValue) {
                    setForm((prev) => ({ ...prev, planName: PRESET_PLAN_NAMES[0] || "" }))
                }
            } else if (type === "promoCampaignId") {
                setCustomPromoList((l) => l.filter((x) => x._id !== id))
                if (removedValue && form.promoCampaignId === removedValue) {
                    setForm((prev) => ({
                        ...prev,
                        promoCampaignId: PRESET_PROMO_CAMPAIGN_IDS[0] || ""
                    }))
                }
            }
            return true
        } catch (err) {
            console.error("removeCustomOption failed", err)
            toast.error("Failed to remove")
            return false
        }
    }

    const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

    const persistSettings = async () => {
        try {
            const payload = {
                proxy: form.proxy,
                planName: form.planName,
                checkoutUiMode: form.checkoutUiMode,
                cancelUrl: form.cancelUrl,
                country: (form.country || "").toUpperCase(),
                currency: (form.currency || "").toUpperCase(),
                promoEnabled: !!form.promoEnabled,
                promoCampaignId: form.promoCampaignId,
                couponFromQuery: !!form.couponFromQuery,
                entryPoint: form.entryPoint,
                workspaceName: form.workspaceName,
                priceInterval: form.priceInterval,
                seatQuantity: Number(form.seatQuantity) || 1
            }
            await handleApi("/checkout/settings", "POST", payload)
        } catch (err) {
            console.error("auto-save failed", err)
        }
    }

    const buildPayload = () => {
        const planName = (form.planName || "").trim()
        const billing = {
            country: (form.country || "").trim().toUpperCase(),
            currency: (form.currency || "").trim().toUpperCase()
        }
        const cancelUrl = (form.cancelUrl || "").trim()
        const uiMode = form.checkoutUiMode

        if (isTeamPlan(planName)) {
            const seats = parseInt(form.seatQuantity, 10)
            const teamPayload = {
                entry_point: (form.entryPoint || "").trim(),
                plan_name: planName,
                billing_details: billing,
                cancel_url: cancelUrl
            }
            if (form.promoEnabled) {
                teamPayload.promo_campaign = {
                    promo_campaign_id: (form.promoCampaignId || "").trim(),
                    is_coupon_from_query_param: !!form.couponFromQuery
                }
            }
            teamPayload.checkout_ui_mode = uiMode
            teamPayload.team_plan_data = {
                workspace_name: (form.workspaceName || "").trim(),
                price_interval: form.priceInterval,
                seat_quantity: Number.isFinite(seats) && seats > 0 ? seats : 1
            }
            return teamPayload
        }

        const payload = {
            plan_name: planName,
            billing_details: billing,
            cancel_url: cancelUrl
        }
        if (form.promoEnabled) {
            payload.promo_campaign = {
                promo_campaign_id: (form.promoCampaignId || "").trim(),
                is_coupon_from_query_param: !!form.couponFromQuery
            }
        }
        payload.checkout_ui_mode = uiMode
        return payload
    }

    const runCheckout = async () => {
        if (!form.accessToken) {
            setResult({
                ok: false,
                title: "Missing access token",
                error: "Paste the full /api/auth/session JSON or an accessToken first.",
                proxyUsed: false
            })
            toast.error("Missing access token")
            return
        }
        setLoading(true)
        setResult(null)
        try {
            const payload = buildPayload()
            const resp = await handleApi("/checkout/generate", "POST", {
                accessToken: form.accessToken,
                payload,
                proxy: form.proxy || "",
                saveSettings: true
            })

            if (!resp || resp.success === false) {
                setResult({
                    ok: false,
                    title: "Backend error",
                    error: resp?.error || resp?.message || "Unknown error",
                    body: resp?.response,
                    proxyUsed: !!form.proxy
                })
                return
            }

            const link = resp.paymentLink
            const upstreamOk = resp.status >= 200 && resp.status < 300
            setResult({
                ok: upstreamOk && !!link,
                title: link ? "Checkout link ready" : "Upstream returned no link",
                link,
                status: resp.status,
                body: resp.response,
                proxyUsed: !!resp.proxy_used
            })
            if (link) {
                setLastPaymentLink(link)
                setLastGeneratedAt(new Date().toISOString())
                toast.success("Checkout link generated")
            } else {
                toast.warn("No link returned. Check the response below.")
            }
        } catch (err) {
            setResult({
                ok: false,
                title: "Request failed",
                error: String(err),
                proxyUsed: !!form.proxy
            })
            toast.error("Request failed")
        } finally {
            setLoading(false)
        }
    }

    const onReset = () => {
        setForm({
            ...DEFAULTS,
            sessionRaw: "",
            accessToken: ""
        })
        setResult(null)
        toast.info("Reset to defaults")
    }

    const copy = async (text, label = "Copied to clipboard") => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(label)
        } catch {
            toast.error("Copy failed")
        }
    }

    const { session } = parseSession(form.sessionRaw)
    const sessionEmail = session?.user?.email
    const sessionPlan = session?.account?.planType
    const sessionExpires = session?.expires
    const sessionExpired =
        sessionExpires && new Date(sessionExpires).getTime() < Date.now()
    const tokenShort = form.accessToken
        ? form.accessToken.length > 18
            ? form.accessToken.slice(0, 8) + "…" + form.accessToken.slice(-6)
            : form.accessToken
        : null

    const teamPlan = isTeamPlan(form.planName)

    return (
        <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-5xl mx-auto">
            <Helmet>
                <title>ChatGPT Checkout - Customer Sheet</title>
            </Helmet>

            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="p-4 rounded-2xl shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(135deg, #10a37f 0%, #0d8a6b 100%)",
                                boxShadow: "0 10px 25px -10px rgba(16, 163, 127, 0.5)"
                            }}
                        >
                            <FaCreditCard className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                ChatGPT Checkout Link Generator
                            </h1>
                            <p className="text-[var(--text-tertiary)] mt-1">
                                Generate a hosted Stripe checkout URL via session token + optional proxy
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {initialLoading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-rotate w-12 h-12 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full mx-auto" />
                        <p className="mt-4 text-[var(--text-tertiary)] font-medium">
                            Loading saved settings…
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Session card */}
                    <SectionTitle title="Session" badge="REQUIRED" />
                    <Card>
                        <Field
                            label={
                                <>
                                    Paste full{" "}
                                    <a
                                        href="https://chatgpt.com/api/auth/session"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline font-mono text-[11px]"
                                        style={{ color: "#10a37f" }}
                                    >
                                        chatgpt.com/api/auth/session
                                    </a>{" "}
                                    JSON
                                </>
                            }
                            hint="open while logged in, then paste the JSON response — or paste only the accessToken string"
                        >
                            <textarea
                                spellCheck={false}
                                placeholder='{"user":{...},"accessToken":"eyJ...","expires":"..."}'
                                className="w-full rounded-lg p-3 font-mono text-[11.5px] leading-relaxed outline-none"
                                style={{
                                    background: "var(--bg-deepest)",
                                    border: "1px solid var(--border-subtle)",
                                    color: "var(--text-primary)",
                                    minHeight: 110,
                                    resize: "vertical"
                                }}
                                value={form.sessionRaw}
                                onChange={(e) => update({ sessionRaw: e.target.value })}
                            />
                        </Field>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Pill
                                tone={tokenShort ? "ok" : "bad"}
                                text={
                                    tokenShort ? `token: ${tokenShort}` : "token: empty"
                                }
                            />
                            <Pill
                                tone={sessionEmail ? "ok" : "default"}
                                text={`email: ${sessionEmail || "—"}`}
                            />
                            <Pill
                                tone={sessionPlan ? "ok" : "default"}
                                text={`plan: ${sessionPlan || "—"}`}
                            />
                            <Pill
                                tone={
                                    sessionExpires
                                        ? sessionExpired
                                            ? "bad"
                                            : "ok"
                                        : "default"
                                }
                                text={`expires: ${fmtExpires(sessionExpires)}`}
                            />
                        </div>
                    </Card>

                    {/* Proxy card */}
                    <SectionTitle title="Proxy" hint="(optional)" />
                    <Card>
                        <Field
                            label="Proxy URL"
                            hint={
                                <>
                                    Accepted formats:{" "}
                                    <code className="font-mono text-[11px]">
                                        host:port:user:pass
                                    </code>
                                    ,{" "}
                                    <code className="font-mono text-[11px]">
                                        user:pass@host:port
                                    </code>
                                    ,{" "}
                                    <code className="font-mono text-[11px]">host:port</code>,{" "}
                                    <code className="font-mono text-[11px]">
                                        http(s)://...
                                    </code>
                                    ,{" "}
                                    <code className="font-mono text-[11px]">socks5://...</code>
                                    . Leave empty for direct connection.
                                </>
                            }
                        >
                            <Input
                                value={form.proxy}
                                onChange={(v) => update({ proxy: v })}
                                placeholder="host:port:user:pass  or  http://user:pass@host:port  or  socks5://host:port"
                            />
                        </Field>
                    </Card>

                    {/* Checkout Parameters */}
                    <SectionTitle title="Checkout Parameters" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card title="Plan">
                            <Field
                                label="Plan name"
                                hint="Pick from presets / your saved list, or add a new one."
                            >
                                <DropdownWithAdd
                                    value={form.planName}
                                    onChange={(v) => update({ planName: v })}
                                    presets={PRESET_PLAN_NAMES}
                                    customs={customPlanList}
                                    onAddCustom={(v) => addCustomOption("planName", v)}
                                    onRemoveCustom={(id) =>
                                        removeCustomOption("planName", id)
                                    }
                                    placeholder="e.g. chatgptproplan"
                                />
                            </Field>
                            <Field label="Checkout UI mode">
                                <Select
                                    value={form.checkoutUiMode}
                                    onChange={(v) => update({ checkoutUiMode: v })}
                                    options={[
                                        { value: "hosted", label: "hosted" },
                                        { value: "custom", label: "custom" }
                                    ]}
                                />
                            </Field>
                            <Field label="Cancel URL">
                                <Input
                                    value={form.cancelUrl}
                                    onChange={(v) => update({ cancelUrl: v })}
                                />
                            </Field>
                        </Card>

                        <Card title="Billing">
                            <Field label="Country (ISO 2-letter)">
                                <Input
                                    value={form.country}
                                    onChange={(v) =>
                                        update({ country: v.toUpperCase().slice(0, 2) })
                                    }
                                    maxLength={2}
                                />
                            </Field>
                            <Field label="Currency (ISO 3-letter)">
                                <Input
                                    value={form.currency}
                                    onChange={(v) =>
                                        update({ currency: v.toUpperCase().slice(0, 3) })
                                    }
                                    maxLength={3}
                                />
                            </Field>
                        </Card>

                        {teamPlan && (
                            <Card title="Team Plan Options" wide>
                                <Field
                                    label="Entry point"
                                    hint={
                                        <>
                                            e.g.{" "}
                                            <code className="font-mono text-[11px]">
                                                team_workspace_purchase_modal
                                            </code>
                                        </>
                                    }
                                >
                                    <Input
                                        value={form.entryPoint}
                                        onChange={(v) => update({ entryPoint: v })}
                                    />
                                </Field>
                                <Field label="Workspace name">
                                    <Input
                                        value={form.workspaceName}
                                        onChange={(v) => update({ workspaceName: v })}
                                    />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Billing interval">
                                        <Select
                                            value={form.priceInterval}
                                            onChange={(v) => update({ priceInterval: v })}
                                            options={[
                                                { value: "month", label: "month" },
                                                { value: "year", label: "year" }
                                            ]}
                                        />
                                    </Field>
                                    <Field label="Seat quantity">
                                        <Input
                                            value={form.seatQuantity}
                                            onChange={(v) =>
                                                update({
                                                    seatQuantity:
                                                        v === "" ? "" : Math.max(1, parseInt(v, 10) || 1)
                                                })
                                            }
                                            inputMode="numeric"
                                        />
                                    </Field>
                                </div>
                            </Card>
                        )}

                        <Card title="Promo Campaign (optional)" wide>
                            <ToggleRow
                                label="Enable promo campaign"
                                hint="Toggle off to omit the promo_campaign field entirely."
                                checked={form.promoEnabled}
                                onChange={(v) => update({ promoEnabled: v })}
                            />
                            {form.promoEnabled && (
                                <>
                                    <Field
                                        label="Promo campaign ID"
                                        hint="Pick from presets / your saved list, or add a new one."
                                    >
                                        <DropdownWithAdd
                                            value={form.promoCampaignId}
                                            onChange={(v) => update({ promoCampaignId: v })}
                                            presets={PRESET_PROMO_CAMPAIGN_IDS}
                                            customs={customPromoList}
                                            onAddCustom={(v) =>
                                                addCustomOption("promoCampaignId", v)
                                            }
                                            onRemoveCustom={(id) =>
                                                removeCustomOption("promoCampaignId", id)
                                            }
                                            placeholder="e.g. plus-1-month-free"
                                        />
                                    </Field>
                                    <ToggleRow
                                        label="Is coupon from query param"
                                        hint="Sets is_coupon_from_query_param."
                                        checked={form.couponFromQuery}
                                        onChange={(v) => update({ couponFromQuery: v })}
                                    />
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        <button
                            onClick={runCheckout}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60"
                            style={{
                                background: loading
                                    ? "#0e8f6f"
                                    : "linear-gradient(135deg, #10a37f 0%, #0d8a6b 100%)",
                                boxShadow: "0 10px 30px -12px rgba(16, 163, 127, 0.6)"
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-rotate w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <FaCreditCard className="w-4 h-4" />
                                    Generate Link
                                </>
                            )}
                        </button>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                            style={{
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border-subtle)",
                                color: "var(--text-secondary)"
                            }}
                        >
                            <FaSync className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    </div>

                    {/* Result */}
                    {result && (
                        <div
                            className="rounded-2xl p-5 mt-6 animate-fade-in"
                            style={{
                                background: "var(--bg-card)",
                                border:
                                    "1px solid " +
                                    (result.ok
                                        ? "rgba(16,163,127,0.5)"
                                        : "rgba(239,68,68,0.5)")
                            }}
                        >
                            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                                <h3 className="text-base font-semibold text-white">
                                    {result.title}
                                </h3>
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
                                            onClick={() => copy(result.link, "URL copied")}
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
                                <details
                                    className="mt-3"
                                    open={!result.ok || !result.link}
                                >
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
                    )}

                    {/* Last saved link */}
                    {!result && lastPaymentLink && (
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
                                {lastGeneratedAt && (
                                    <span className="text-xs text-[var(--text-muted)]">
                                        {new Date(lastGeneratedAt).toLocaleString()}
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
                                {lastPaymentLink}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() =>
                                        window.open(lastPaymentLink, "_blank", "noopener")
                                    }
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
                                    style={{ background: "#10a37f" }}
                                >
                                    <FaExternalLinkAlt className="w-3 h-3" /> Open
                                </button>
                                <button
                                    onClick={() => copy(lastPaymentLink, "URL copied")}
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
                    )}

                </>
            )}
        </div>
    )
}

// ---------- small primitives ----------

const SectionTitle = ({ title, badge, hint }) => (
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
        {hint && (
            <span className="text-xs text-[var(--text-muted)]">{hint}</span>
        )}
    </div>
)

const Card = ({ children, title, wide }) => (
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

const Field = ({ label, hint, children }) => (
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

const Input = ({ value, onChange, placeholder, maxLength, inputMode }) => (
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

const Select = ({ value, onChange, options }) => (
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

const Pill = ({ text, tone = "default" }) => {
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
            // Selection stays on the now-removed value (rendered as orphan); user can pick a new one.
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

const ToggleRow = ({ label, hint, checked, onChange }) => (
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

export default ChatGptCheckout
