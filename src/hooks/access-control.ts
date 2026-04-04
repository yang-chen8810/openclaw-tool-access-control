import { ConfigManager } from "../config/config-manager.js";
import type { Config, Policy, ToolCallEntry } from "../types.js";
import { RuleExprEvaluator } from "../evaluator/RuleExprEvaluator.js";
import { logger } from "../utils/logger.js";

export interface PolicyEvaluator {
    evaluator: RuleExprEvaluator;
    desc: string;
}

export interface AccessResult {
    allowed: boolean;
    reason?: string;
}

export class AccessControl {
    private configManager: ConfigManager;
    private config: Config | null = null;
    
    // First level: toolName, Second level: sessionKey
    private grantPolicyMap: Map<string, Map<string, PolicyEvaluator[]>> = new Map();
    private denyPolicyMap: Map<string, Map<string, PolicyEvaluator[]>> = new Map();

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
    }

    public async init(): Promise<void> {
        await this.reload();
    }

    public async reload(): Promise<void> {
        this.config = await this.configManager.loadConfig();
        const systemPolicies = await this.configManager.loadSystemPolicies();
        
        const allPolicies = [
            ...systemPolicies,
            ...(this.config?.policies || [])
        ];
        
        this.buildPolicyMap(allPolicies);
    }

    private buildPolicyMap(policies: Policy[]): void {
        const nextGrantMap = new Map<string, Map<string, PolicyEvaluator[]>>();
        const nextDenyMap = new Map<string, Map<string, PolicyEvaluator[]>>();
        const isCaseSensitive = this.config?.caseSensitive ?? true;

        for (const policy of policies) {
            let toolNames = (policy.toolName && policy.toolName.length > 0) ? [...policy.toolName] : ["*"];
            let sessionKeys = (policy.sessionKey && policy.sessionKey.length > 0) ? [...policy.sessionKey] : ["*"];

            if (!isCaseSensitive) {
                toolNames = toolNames.map(t => t.toLowerCase());
                sessionKeys = sessionKeys.map(s => s.toLowerCase());
            }

            if (toolNames.includes("*")) {
                if (toolNames.length > 1) {
                    logger.warn(`Policy toolName contains '*' along with other values: [${toolNames.join(", ")}]. Ignoring others.`);
                }
                toolNames = ["*"];
            }

            if (sessionKeys.includes("*")) {
                if (sessionKeys.length > 1) {
                    logger.warn(`Policy sessionKey contains '*' along with other values: [${sessionKeys.join(", ")}]. Ignoring others.`);
                }
                sessionKeys = ["*"];
            }

            let evaluator: RuleExprEvaluator;
            try {
                evaluator = new RuleExprEvaluator(policy.condition, isCaseSensitive);
            } catch (err: any) {
                logger.error(`Failed to parse policy condition: ${policy.condition} ERR: ${err.message}`);
                continue;
            }

            const targetMap = policy.type === "grant" ? nextGrantMap : nextDenyMap;
            const desc = policy.desc && policy.desc.trim() !== "" 
                ? policy.desc 
                : `${policy.type}|${toolNames.join(",")}|${sessionKeys.join(",")}|${policy.condition}`;

            const policyEvaluator: PolicyEvaluator = {
                evaluator,
                desc
            };

            for (const tName of toolNames) {
                let sessionMap = targetMap.get(tName);
                if (!sessionMap) {
                    sessionMap = new Map<string, PolicyEvaluator[]>();
                    targetMap.set(tName, sessionMap);
                }

                for (const sKey of sessionKeys) {
                    let evaluators = sessionMap.get(sKey);
                    if (!evaluators) {
                        evaluators = [];
                        sessionMap.set(sKey, evaluators);
                    }
                    evaluators.push(policyEvaluator);
                }
            }
        }

        // Swap maps atomically since this is JS
        this.grantPolicyMap = nextGrantMap;
        this.denyPolicyMap = nextDenyMap;
    }



    // Expose for usage and testing
    public getGrantPolicyMap(): Map<string, Map<string, PolicyEvaluator[]>> {
        return this.grantPolicyMap;
    }

    public getDenyPolicyMap(): Map<string, Map<string, PolicyEvaluator[]>> {
        return this.denyPolicyMap;
    }

    public getConfig(): Config | null {
        return this.config;
    }

    public isAllowed(entry: ToolCallEntry): AccessResult {
        if (!this.config || this.config.mode === "off") {
            return { allowed: true };
        }

        // 1. Check Deny Policies
        const denyDesc = this.evaluateAnyMatches(this.denyPolicyMap, entry);
        if (denyDesc) {
            return { allowed: false, reason: `Deny policy matched: ${denyDesc}` };
        }

        // 2. Check Grant Policies
        const grantDesc = this.evaluateAnyMatches(this.grantPolicyMap, entry);
        if (grantDesc) {
            return { allowed: true, reason: `Grant policy matched: ${grantDesc}` };
        }

        // Default Deny
        return { allowed: false, reason: "No policy grants access" };
    }

    private evaluateAnyMatches(policyMap: Map<string, Map<string, PolicyEvaluator[]>>, entry: ToolCallEntry): string | null {
        const isCaseSensitive = this.config?.caseSensitive ?? true;
        let entryToolName = entry.toolName;
        let entrySessionKey = entry.sessionKey || "";

        if (!isCaseSensitive) {
            entryToolName = entryToolName.toLowerCase();
            entrySessionKey = entrySessionKey.toLowerCase();
        }

        // We try both the specific toolName and the wildcard "*"
        const toolNamesToTry = [entryToolName, "*"];
        const sessionKeysToTry = [entrySessionKey, "*"];

        for (const tName of toolNamesToTry) {
            const sessionMap = policyMap.get(tName);
            if (!sessionMap) continue;

            for (const sKey of sessionKeysToTry) {
                const evaluators = sessionMap.get(sKey);
                if (!evaluators) continue;

                for (const policyEvaluator of evaluators) {
                    // Evaluate the rule expression. The evaluator expects a context object.
                    // We pass the ToolCallEntry directly.
                    logger.info(`Evaluating policy: ${policyEvaluator.desc}`);
                    if (policyEvaluator.evaluator.evaluate(entry as unknown as Record<string, any>) === true) {
                        logger.info(`Policy matched: ${policyEvaluator.desc}`);
                        return policyEvaluator.desc;
                    }
                    logger.info(`Policy not matched: ${policyEvaluator.desc}`);
                }
            }
        }
        return null;
    }
}
