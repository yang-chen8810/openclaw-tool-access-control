import fs from "fs/promises";
import path from "path";
import os from "os";
import { ConfigManager } from "../config/config-manager.js";

describe("ConfigManager", () => {
    let configManager: ConfigManager;
    let configPath: string;
    let testDir: string;

    beforeAll(async () => {
        testDir = path.join(os.tmpdir(), "openclaw-test-" + Math.random().toString(36).substring(7));
        await fs.mkdir(testDir, { recursive: true });
    });

    afterAll(async () => {
        try {
            await fs.rm(testDir, { recursive: true, force: true });
        } catch { }
    });

    beforeEach(() => {
        configManager = new ConfigManager(testDir);
        configPath = configManager.getConfigPath();
    });

    afterEach(async () => {
        try {
            await fs.unlink(configPath);
        } catch (error: any) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    });

    it("should return default config if config.json does not exist", async () => {
        const config = await configManager.loadConfig();
        expect(config).toEqual({
            mode: "off",
            port: 8080,
            caseSensitive: true,
            policies: []
        });
    });

    it("should save and load config correctly", async () => {
        const newConfig = {
            mode: "monitor" as const,
            port: 8080,
            caseSensitive: false,
            policies: [
                { type: "grant" as const, toolName: ["tool1"], sessionKey: ["k1"], condition: "1 == 1" }
            ]
        };

        await configManager.saveConfig(newConfig);

        const loadedConfig = await configManager.loadConfig();
        expect(loadedConfig).toEqual(newConfig);
    });
});
