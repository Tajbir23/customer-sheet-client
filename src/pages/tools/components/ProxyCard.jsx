import React from "react"
import { Card, Field, Input, SectionTitle } from "./primitives"

const ProxyCard = ({ value, onChange }) => (
    <>
        <SectionTitle title="Proxy" hint="(optional)" />
        <Card>
            <Field
                label="Proxy URL"
                hint={
                    <>
                        Accepted formats:{" "}
                        <code className="font-mono text-[11px]">host:port:user:pass</code>,{" "}
                        <code className="font-mono text-[11px]">user:pass@host:port</code>,{" "}
                        <code className="font-mono text-[11px]">host:port</code>,{" "}
                        <code className="font-mono text-[11px]">http(s)://...</code>,{" "}
                        <code className="font-mono text-[11px]">socks5://...</code>. Leave
                        empty for direct connection.
                    </>
                }
            >
                <Input
                    value={value}
                    onChange={onChange}
                    placeholder="host:port:user:pass  or  http://user:pass@host:port  or  socks5://host:port"
                />
            </Field>
        </Card>
    </>
)

export default ProxyCard
