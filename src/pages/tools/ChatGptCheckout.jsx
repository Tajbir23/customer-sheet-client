import React, { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { FaCreditCard, FaSync } from "react-icons/fa"
import handleApi from "../../libs/handleAPi"

import {
    DEFAULTS,
    PRESET_PLAN_NAMES,
    PRESET_PROMO_CAMPAIGN_IDS,
    buildCheckoutPayload,
    parseSession
} from "./components/checkoutUtils"
import useCustomOptions from "./components/useCustomOptions"
import SessionCard from "./components/SessionCard"
import ProxyCard from "./components/ProxyCard"
import CheckoutParamsSection from "./components/CheckoutParamsSection"
import { LastLinkCard, ResultCard } from "./components/ResultPanel"

const ChatGptCheckout = () => {
    const [form, setForm] = useState(DEFAULTS)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [lastPaymentLink, setLastPaymentLink] = useState("")
    const [lastGeneratedAt, setLastGeneratedAt] = useState(null)

    const {
        planList: customPlanList,
        promoList: customPromoList,
        addOption: addCustomOption,
        removeOption: removeCustomOptionRaw
    } = useCustomOptions()

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
                            typeof d.promoEnabled === "boolean"
                                ? d.promoEnabled
                                : prev.promoEnabled,
                        promoCampaignId: d.promoCampaignId ?? prev.promoCampaignId,
                        couponFromQuery:
                            typeof d.couponFromQuery === "boolean"
                                ? d.couponFromQuery
                                : prev.couponFromQuery,
                        entryPoint: d.entryPoint ?? prev.entryPoint,
                        workspaceName: d.workspaceName ?? prev.workspaceName,
                        priceInterval: d.priceInterval ?? prev.priceInterval,
                        seatQuantity:
                            typeof d.seatQuantity === "number"
                                ? d.seatQuantity
                                : prev.seatQuantity
                    }))
                    setLastPaymentLink(d.lastPaymentLink || "")
                    setLastGeneratedAt(d.lastGeneratedAt || null)
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (mounted) {
                    setInitialLoading(false)
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

    // Wrap removeOption so we can fall back to a preset if the removed value
    // happens to be currently selected (prevents an orphaned "(unsaved)" entry).
    const removeCustomOption = async (type, id) => {
        const list = type === "planName" ? customPlanList : customPromoList
        const removedValue = list.find((x) => x._id === id)?.value
        const ok = await removeCustomOptionRaw(type, id)
        if (!ok || !removedValue) return ok

        if (type === "planName" && form.planName === removedValue) {
            setForm((prev) => ({ ...prev, planName: PRESET_PLAN_NAMES[0] || "" }))
        } else if (
            type === "promoCampaignId" &&
            form.promoCampaignId === removedValue
        ) {
            setForm((prev) => ({
                ...prev,
                promoCampaignId: PRESET_PROMO_CAMPAIGN_IDS[0] || ""
            }))
        }
        return ok
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
            const payload = buildCheckoutPayload(form)
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
                                Generate a hosted Stripe checkout URL via session token +
                                optional proxy
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
                    <SessionCard
                        sessionRaw={form.sessionRaw}
                        accessToken={form.accessToken}
                        onChange={(v) => update({ sessionRaw: v })}
                    />

                    <ProxyCard
                        value={form.proxy}
                        onChange={(v) => update({ proxy: v })}
                    />

                    <CheckoutParamsSection
                        form={form}
                        update={update}
                        customPlanList={customPlanList}
                        customPromoList={customPromoList}
                        onAddCustom={addCustomOption}
                        onRemoveCustom={removeCustomOption}
                    />

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

                    <ResultCard result={result} onCopy={copy} />

                    {!result && (
                        <LastLinkCard
                            link={lastPaymentLink}
                            generatedAt={lastGeneratedAt}
                            onCopy={copy}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default ChatGptCheckout
