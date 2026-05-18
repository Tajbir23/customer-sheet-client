import React from "react"
import { Card, Field, Input, SectionTitle, Select, ToggleRow } from "./primitives"
import DropdownWithAdd from "./DropdownWithAdd"
import {
    PRESET_PLAN_NAMES,
    PRESET_PROMO_CAMPAIGN_IDS,
    isTeamPlan
} from "./checkoutUtils"

const CheckoutParamsSection = ({
    form,
    update,
    customPlanList,
    customPromoList,
    onAddCustom,
    onRemoveCustom
}) => {
    const teamPlan = isTeamPlan(form.planName)
    return (
        <>
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
                            onAddCustom={(v) => onAddCustom("planName", v)}
                            onRemoveCustom={(id) => onRemoveCustom("planName", id)}
                            placeholder="e.g. chatgptproplan"
                        />
                    </Field>
                    <Field label="Checkout UI mode">
                        <Select
                            value={form.checkoutUiMode}
                            onChange={(v) => update({ checkoutUiMode: v })}
                            options={[
                                { value: "hosted", label: "hosted" },
                                { value: "custom", label: "custom" },
                                { value: "stripe", label: "Stripe" }
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
                                                v === ""
                                                    ? ""
                                                    : Math.max(1, parseInt(v, 10) || 1)
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
                                        onAddCustom("promoCampaignId", v)
                                    }
                                    onRemoveCustom={(id) =>
                                        onRemoveCustom("promoCampaignId", id)
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
        </>
    )
}

export default CheckoutParamsSection
