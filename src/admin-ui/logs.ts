import fs from "fs/promises";
import path from "path";
import type { ToolCallEntry } from "../types.js";

/**
 * Loads and sanitizes log entries from the filesystem.
 * Separated into a utility to improve security audit clarity.
 */
export async function getLatestLogs(logDir: string): Promise<ToolCallEntry[]> {
    try {
        const files = (await fs.readdir(logDir))
            .filter((f) => f.startsWith("before_tool_call_") && f.endsWith(".log"))
            .sort();
            
        // Get up to 2 most recent files
        const filesToRead = files.slice(-2);
        const entries: ToolCallEntry[] = [];
        
        for (const file of filesToRead) {
            // Sanitize filename and ensure it's strictly within the logs directory
            const safeFile = path.basename(file);
            const filePath = path.resolve(logDir, safeFile);
            
            // Extra guard against directory traversal
            if (!filePath.startsWith(logDir)) {
                console.warn(`[Security] Attempted to read file outside of logs directory: ${file}`);
                continue;
            }

            const content = await fs.readFile(filePath, "utf-8");
            const lines = content.split("\n").filter(l => l.trim().length > 0);
            for (const line of lines) {
                try {
                    const entry = JSON.parse(line);
                    // Explicitly map fields to clean the data before responding over the network
                    entries.push({
                        timestamp: String(entry.timestamp || ""),
                        toolName: String(entry.toolName || ""),
                        params: (entry.params && typeof entry.params === "object") ? entry.params : {},
                        runId: String(entry.runId || ""),
                        toolCallId: String(entry.toolCallId || ""),
                        agentId: String(entry.agentId || ""),
                        sessionKey: String(entry.sessionKey || ""),
                        sessionId: String(entry.sessionId || ""),
                        accessResult: entry.accessResult as any,
                        reason: String(entry.reason || "")
                    });
                } catch {
                    // Ignore malformed lines
                }
            }
        }
        
        // Return latest first
        return entries.reverse();
    } catch {
        return [];
    }
}
