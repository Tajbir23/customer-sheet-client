// Shared constants and pure helpers for the ChatGPT Checkout page.

export const PRESET_PLAN_NAMES = ["chatgptplusplan"]

export const PRESET_PROMO_CAMPAIGN_IDS = ["plus-1-month-free"]

export const DEFAULTS = {
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

export function parseSession(raw) {
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

export function fmtExpires(iso) {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d)) return iso
    const ms = d.getTime() - Date.now()
    const days = Math.floor(ms / 86400000)
    const human = d.toISOString().slice(0, 10)
    if (ms < 0) return `${human} (expired)`
    return `${human} (${days}d left)`
}

export const isTeamPlan = (planName) =>
    (planName || "").trim().toLowerCase().startsWith("chatgptteam")

export const buildCheckoutPayload = (form) => {
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
