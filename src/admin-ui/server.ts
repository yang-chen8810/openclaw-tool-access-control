import http from "http";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { ConfigManager } from "../config/config-manager.js";
import type { Config, ToolCallEntry } from "../types.js";

import { getLatestLogs } from "./logs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "public");
const LOG_DIR = path.resolve(__dirname, "..", "logs");

async function parseJSONBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
        req.on("error", reject);
    });
}

function sendJSON(res: http.ServerResponse, statusCode: number, data: any) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

async function serveStaticFile(res: http.ServerResponse, urlPath: string) {
    if (urlPath === "/" || urlPath === "") {
        urlPath = "/index.html";
    }
    
    // Prevent directory traversal
    const safeSuffix = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safeSuffix);
    
    try {
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
            const ext = path.extname(filePath);
            const mimeTypes: Record<string, string> = {
                ".html": "text/html",
                ".js": "application/javascript",
                ".css": "text/css",
                ".png": "image/png",
                ".ico": "image/x-icon",
            };
            res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
            createReadStream(filePath).pipe(res);
            return true;
        }
    } catch (err) {
        // File not found or other err
    }
    return false;
}

/**
 * Starts the local Admin UI HTTP server to manage access control policies.
 * 
 * @param config The current configuration.
 */
async function startAdminUI(config: Config): Promise<void> {
    const port = config.port;
    const host = "localhost";
    const manager = new ConfigManager(); // Create local instance for saving

    const server = http.createServer(async (req, res) => {
        const url = req.url || "/";
        const method = req.method || "GET";

        if (url.startsWith("/api/")) {
            if (method === "GET" && url === "/api/config_local_only") {
                try {
                    const currentConfig = await manager.loadConfig();
                    console.log(`[GET /api/config_local_only] Loaded configuration from ${manager.getConfigPath()}`);
                    sendJSON(res, 200, currentConfig);
                } catch (e: any) {
                    console.error(`[GET /api/config_local_only] Error: ${e.message}`);
                    sendJSON(res, 500, { error: e.message });
                }
            } else if (method === "POST" && url === "/api/config_local_only") {
                try {
                    const newConfig = await parseJSONBody(req);
                    console.log(`[POST /api/config_local_only] Saving new configuration to ${manager.getConfigPath()}`);
                    console.log(`[POST /api/config_local_only] New mode: ${newConfig.mode}, Policies count: ${newConfig.policies?.length}`);
                    await manager.saveConfig(newConfig);
                    sendJSON(res, 200, { success: true });
                } catch (e: any) {
                    console.error(`[POST /api/config] Error: ${e.message}`);
                    sendJSON(res, 400, { error: e.message });
                }
            } else if (method === "GET" && url.startsWith("/api/logs")) {
                try {
                    const entries = await getLatestLogs(LOG_DIR);
                    
                    if (url.includes("hints=true")) {
                        const toolNames = new Set<string>();
                        const sessionKeys = new Set<string>();
                        for (const entry of entries) {
                            if (entry.toolName) toolNames.add(entry.toolName);
                            if (entry.sessionKey) sessionKeys.add(entry.sessionKey);
                        }
                        sendJSON(res, 200, {
                            toolNames: Array.from(toolNames),
                            sessionKeys: Array.from(sessionKeys)
                        });
                    } else {
                        sendJSON(res, 200, { logs: entries });
                    }
                } catch (e: any) {
                    sendJSON(res, 500, { error: e.message });
                }
            } else {
                sendJSON(res, 404, { error: "API not found" });
            }
            return;
        }

        // Serve static files
        if (method === "GET") {
            const served = await serveStaticFile(res, url.split('?')[0] || "/");
            if (!served) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            }
        } else {
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.end("Method Not Allowed");
        }
    });

    server.listen(port, host, () => {
        console.log(`Admin UI server running at http://${host}:${port}/`);
        console.log(`Listening on localhost only for security.`);
    });
}

// Standalone CLI support
const isMainModule = process.argv[1] && (
    fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
    path.basename(process.argv[1]) === "server.ts" ||
    path.basename(process.argv[1]) === "server.js"
);

if (isMainModule) {
    const manager = new ConfigManager();
    manager.loadConfig().then(config => {
        return startAdminUI(config);
    }).catch(err => {
        console.error("Failed to start standalone Admin UI server:", err);
        process.exit(1);
    });
}
