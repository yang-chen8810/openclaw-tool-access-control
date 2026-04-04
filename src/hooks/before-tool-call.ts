import fs from "fs/promises";
import path from "path";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import type { ToolCallEntry } from "../types.js";
import { fileURLToPath } from "url";
import { AccessControl } from "./access-control.js";
import { ConfigManager } from "../config/config-manager.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(__dirname, "..", "logs");
const LOG_PREFIX = "before_tool_call_";
const LOG_EXT = ".log";
const MAX_ENTRIES_PER_FILE = 10_000;

/**
 * Rolling logger that writes JSONL entries to files with a max of
 * MAX_ENTRIES_PER_FILE entries each. Filenames include a datetime stamp.
 * On restart, resumes the most recent file if it still has room.
 */
class RollingLogger {
  private currentFile: string | null = null;
  private entryCount = 0;
  private initialized = false;

  async init(): Promise<void> {
    // Ensure the log directory exists
    await fs.mkdir(LOG_DIR, { recursive: true });

    // Find existing log files matching our pattern, sorted by name (datetime)
    const files = (await fs.readdir(LOG_DIR))
      .filter((f) => f.startsWith(LOG_PREFIX) && f.endsWith(LOG_EXT))
      .sort();

    if (files.length > 0) {
      // Pick the most recent file
      const latest = files[files.length - 1]!;
      const latestPath = path.join(LOG_DIR, latest);
      const count = await this.countEntries(latestPath);
      if (count < MAX_ENTRIES_PER_FILE) {
        this.currentFile = latestPath;
        this.entryCount = count;
        this.initialized = true;
        return;
      }
    }

    // No suitable existing file — create a new one
    this.currentFile = this.newFilePath();
    this.entryCount = 0;
    this.initialized = true;
  }

  async append(entry: ToolCallEntry): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    if (this.entryCount >= MAX_ENTRIES_PER_FILE) {
      this.currentFile = this.newFilePath();
      this.entryCount = 0;
    }

    const line = JSON.stringify(entry) + "\n";
    try {
      await fs.appendFile(this.currentFile!, line, "utf-8");
      this.entryCount++;
    } catch (e) {
      console.error(`Failed to write to ${this.currentFile}:`, e);
    }
  }

  getFilePath(): string | null {
    return this.currentFile;
  }

  private newFilePath(): string {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      "_",
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");
    return path.join(LOG_DIR, `${LOG_PREFIX}${stamp}${LOG_EXT}`);
  }

  private async countEntries(filePath: string): Promise<number> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      // Each JSONL entry is one non-empty line
      return content.split("\n").filter((line) => line.trim().length > 0).length;
    } catch {
      return 0;
    }
  }
}

import { logger as pluginLogger } from "../utils/logger.js";

const logger = new RollingLogger();
const accessControl = new AccessControl(new ConfigManager());

export default function register(api: OpenClawPluginApi) {
  // Set the global logger for the entire plugin
  pluginLogger.setLogger(api.logger);

  api.on("before_tool_call", async (event: any, ctx: any) => {
    const entry: ToolCallEntry = {
      timestamp: new Date().toISOString(),
      toolName: event.toolName,
      params: event.params,
      runId: event.runId,
      toolCallId: event.toolCallId,
      agentId: ctx.agentId,
      sessionKey: ctx.sessionKey,
      sessionId: ctx.sessionId,
    };

    const config = accessControl.getConfig();
    const mode = config?.mode || "off";

    if (mode === "off") {
      entry.accessResult = "notChecked";
      await logger.append(entry);
      return;
    }

    const result = accessControl.isAllowed(entry);
    entry.accessResult = result.allowed ? "permit" : "deny";
    entry.reason = result.reason;

    if (!result.allowed && mode === "on") {
      await logger.append(entry);
      return { block: true, blockReason: entry.reason };
    }

    await logger.append(entry);
  });

  // Eagerly initialize
  Promise.all([
    logger.init(),
    accessControl.init(),
  ]).then(() => {
//    api.logger.info(
//      `before_tool_call plugin loaded. Rolling log dir: ${LOG_DIR}, current file: ${logger.getFilePath()}`,
//    );

    // Auto-reload policies every minute
    const reloadInterval = setInterval(async () => {
      try {
        await accessControl.reload();
      } catch (err) {
        api.logger.error(`Failed to auto-reload access control policies: ${err}`);
      }
    }, 60_000);
    reloadInterval.unref();
  });
}
