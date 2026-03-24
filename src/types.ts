
export interface Config {
    mode: "on" | "off" | "monitor";
    port: number;
    caseSensitive: boolean;
    policies: Policy[];
}

export interface Policy {
    type: "grant" | "deny";
    toolName: string[];
    sessionKey: string[];
    condition: string;
    desc?: string;
}

export interface ToolCallEntry {
    timestamp: string;
    toolName: string;
    params: Record<string, any>;
    runId: string;
    toolCallId: string;
    agentId: string;
    sessionKey: string;
    sessionId: string;
    accessResult?: "permit" | "deny" | "notChecked";
    reason?: string;
}
