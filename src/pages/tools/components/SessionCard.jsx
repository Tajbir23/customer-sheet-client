import React from "react"
import { Card, Field, Pill, SectionTitle } from "./primitives"
import { fmtExpires, parseSession } from "./checkoutUtils"

const SessionCard = ({ sessionRaw, accessToken, onChange }) => {
    const { session } = parseSession(sessionRaw)
    const sessionEmail = session?.user?.email
    const sessionPlan = session?.account?.planType
    const sessionExpires = session?.expires
    const sessionExpired =
        sessionExpires && new Date(sessionExpires).getTime() < Date.now()
    const tokenShort = accessToken
        ? accessToken.length > 18
            ? accessToken.slice(0, 8) + "…" + accessToken.slice(-6)
            : accessToken
        : null

    return (
        <>
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
                        value={sessionRaw}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </Field>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Pill
                        tone={tokenShort ? "ok" : "bad"}
                        text={tokenShort ? `token: ${tokenShort}` : "token: empty"}
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
                            sessionExpires ? (sessionExpired ? "bad" : "ok") : "default"
                        }
                        text={`expires: ${fmtExpires(sessionExpires)}`}
                    />
                </div>
            </Card>
        </>
    )
}

export default SessionCard
