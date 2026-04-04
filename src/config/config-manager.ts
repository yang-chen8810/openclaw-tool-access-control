import fs from "fs/promises";
import path from "path";
import type { Config, Policy } from "../types.js";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ConfigManager {
    private configPath: string;
    private systemPolicyPath: string;

    constructor(baseDir?: string) {
        const root = baseDir || path.resolve(__dirname, "..");
        this.configPath = path.join(root, "config.json");
        this.systemPolicyPath = path.join(root, "system.policy.json");
    }

    public getConfigPath(): string {
        return this.configPath;
    }

    public async loadConfig(): Promise<Config> {
        try {
            const data = await fs.readFile(this.configPath, "utf-8");
            return JSON.parse(data) as Config;
        } catch (error: any) {
            if (error.code === "ENOENT") {
                // Return default config if file doesn't exist
                return {
                    mode: "off",
                    port: 8080,
                    caseSensitive: true,
                    policies: []
                };
            }
            throw error;
        }
    }

    public async loadSystemPolicies(): Promise<Policy[]> {
        try {
            const data = await fs.readFile(this.systemPolicyPath, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed as Policy[];
            } else if (parsed && Array.isArray(parsed.policies)) {
                return parsed.policies as Policy[];
            }
            logger.error(`Empty system policies`);
            return [];
        } catch (error: any) {
            // Return empty array if file doesn't exist or is invalid
            logger.error(`Failed to load system policies: ${error.message}`);
            return [];
        }
    }

    public async saveConfig(config: Config): Promise<void> {
        const data = JSON.stringify(config, null, 2);
        await fs.writeFile(this.configPath, data, "utf-8");
    }
}
