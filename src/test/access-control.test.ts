import { AccessControl } from "../hooks/access-control.js";
import { ConfigManager } from "../config/config-manager.js";
import type { Policy } from "../types.js";

// Mock config manager
class MockConfigManager extends ConfigManager {
    constructor(private mockConfig: any, private mockSystemPolicies: Policy[] = []) {
        super();
    }
    public async loadConfig(): Promise<any> {
        return this.mockConfig;
    }
    public async loadSystemPolicies(): Promise<Policy[]> {
        return this.mockSystemPolicies;
    }
}

describe("AccessControl", () => {
    it("should build policy map correctly handling arrays and strings", async () => {
        const policies: Policy[] = [
            {
                type: "grant",
                toolName: ["tool1", "tool2"],
                sessionKey: ["session1"],
                condition: "age > 18"
            },
            {
                type: "deny",
                toolName: ["tool3"],
                sessionKey: ["session2", "session3"],
                condition: "status == 'active'"
            },
            {
                type: "grant",
                toolName: ["tool4"],
                sessionKey: ["session4"],
                condition: "1 == 1"
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            port: 8080,
            caseSensitive: true,
            policies
        });

        const ac = new AccessControl(mockManager);
        await ac.init();

        const grantMap = ac.getGrantPolicyMap();
        const denyMap = ac.getDenyPolicyMap();

        expect(grantMap.size).toBe(3); // tool1, tool2, tool4
        expect(denyMap.size).toBe(1);  // tool3
        
        expect(grantMap.get("tool1")?.has("session1")).toBe(true);
        expect(grantMap.get("tool2")?.has("session1")).toBe(true);

        expect(denyMap.get("tool3")?.has("session2")).toBe(true);
        expect(denyMap.get("tool3")?.has("session3")).toBe(true);
        
        expect(grantMap.get("tool4")?.has("session4")).toBe(true);
        
        // Ensure evaluators are created properly and we can evaluate them
        const evaluators1 = grantMap.get("tool1")?.get("session1");
        expect(evaluators1).toBeDefined();
        expect(evaluators1!.length).toBe(1);
        const pe1 = evaluators1![0]!;
        expect(pe1.evaluator.evaluate({ age: 20 })).toBe(true);
        expect(pe1.evaluator.evaluate({ age: 10 })).toBe(false);
        
        // Check generated description
        expect(pe1.desc).toBe("grant|tool1,tool2|session1|age > 18");

        const evaluators2 = denyMap.get("tool3")?.get("session2");
        expect(evaluators2).toBeDefined();
        expect(evaluators2!.length).toBe(1);
        const pe2 = evaluators2![0]!;
        expect(pe2.desc).toBe("deny|tool3|session2,session3|status == 'active'");
    });

    it("should use provided description", async () => {
        const policies: Policy[] = [
            {
                type: "grant",
                toolName: ["tool1"],
                sessionKey: ["session1"],
                condition: "1 == 1",
                desc: "My Custom Description"
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            policies
        });

        const ac = new AccessControl(mockManager);
        await ac.init();

        const evaluators = ac.getGrantPolicyMap().get("tool1")?.get("session1");
        expect(evaluators).toBeDefined();
        expect(evaluators![0]!.desc).toBe("My Custom Description");
    });

    it("should ignore policies with syntax errors", async () => {
        const policies: Policy[] = [
            {
                type: "grant",
                toolName: ["tool1"],
                sessionKey: ["session1"],
                condition: "age >>> !! ????" // Syntax error
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            port: 8080,
            caseSensitive: true,
            policies
        });

        const ac = new AccessControl(mockManager);
        
        // This should not throw, just log and ignore the policy
        await ac.init();

        expect(ac.getGrantPolicyMap().size).toBe(0); 
        expect(ac.getDenyPolicyMap().size).toBe(0);     });

    it("should handle '*' wildcard correctly", async () => {
        const policies: Policy[] = [
            {
                type: "grant",
                toolName: ["*", "ignored_tool"],
                sessionKey: ["session1", "*"],
                condition: "1 == 1"
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            port: 8080,
            caseSensitive: true,
            policies
        });

        const ac = new AccessControl(mockManager);
        await ac.init();

        const map = ac.getGrantPolicyMap();
        expect(map.size).toBe(1); // Only "*"
        expect(map.has("*")).toBe(true);
        expect(map.get("*")?.size).toBe(1); // Only "*"
        expect(map.get("*")?.has("*")).toBe(true);
        expect(map.get("*")?.has("session1")).toBe(false); // Ignored
        expect(ac.getDenyPolicyMap().size).toBe(0);
    });

    it("should correctly determine if a tool call is allowed", async () => {
        const policies: Policy[] = [
            {
                type: "deny",
                toolName: ["restricted_tool"],
                sessionKey: ["*"],
                condition: "user.role != 'admin'"
            },
            {
                type: "grant",
                toolName: ["*"],
                sessionKey: ["*"],
                condition: "user.role == 'admin' or user.role == 'user'"
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            policies
        });

        const ac = new AccessControl(mockManager);
        await ac.init();

        // 1. Restricted tool, not admin -> Denied (by deny policy)
        const res1 = ac.isAllowed({
            toolName: "restricted_tool",
            sessionKey: "session1",
            user: { role: "user" }
        } as any);
        expect(res1.allowed).toBe(false);
        expect(res1.reason).toContain("Deny policy matched");

        // 2. Restricted tool, admin -> Allowed (deny condition fails, grant condition passes)
        const res2 = ac.isAllowed({
            toolName: "restricted_tool",
            sessionKey: "session1",
            user: { role: "admin" }
        } as any);
        expect(res2.allowed).toBe(true);
        expect(res2.reason).toContain("Grant policy matched");

        // 3. Regular tool, user -> Allowed (no deny matches, grant matched via *)
        const res3 = ac.isAllowed({
            toolName: "normal_tool",
            sessionKey: "session1",
            user: { role: "user" }
        } as any);
        expect(res3.allowed).toBe(true);

        // 4. Regular tool, unknown role -> Denied (no deny matches, no grant matches)
        const res4 = ac.isAllowed({
            toolName: "normal_tool",
            sessionKey: "session1",
            user: { role: "guest" }
        } as any);
        expect(res4.allowed).toBe(false);
        expect(res4.reason).toBe("No policy grants access");
    });

    it("should handle null or empty toolName or sessionKey as '*'", async () => {
        const policies: any[] = [
            {
                type: "grant",
                toolName: [], // Empty array
                sessionKey: null, // Null
                condition: "1 == 1"
            }
        ];

        const mockManager = new MockConfigManager({
            mode: "on",
            policies
        });

        const ac = new AccessControl(mockManager);
        await ac.init();

        const grantMap = ac.getGrantPolicyMap();
        expect(grantMap.size).toBe(1);
        expect(grantMap.has("*")).toBe(true);
        expect(grantMap.get("*")?.has("*")).toBe(true);
        
        const evaluators = grantMap.get("*")?.get("*");
        expect(evaluators).toBeDefined();
        expect(evaluators![0]!.desc).toBe("grant|*|*|1 == 1");
    });

    it("should reproduce reported rm command issue", async () => {
        const systemPolicies: Policy[] = [
            {
                type: "deny",
                toolName: ["exec"],
                sessionKey: ["*"],
                condition: "params.command like '**'",
                desc: "Deny commands broadly related to fg-tool-access-control plugin"
            }
        ];
        const config: any = {
            mode: "on",
            policies: [
                {
                    type: "grant",
                    toolName: ["*"],
                    sessionKey: [],
                    condition: "sessionKey like 'agent:main:tui-*'",
                    desc: "Grant access to all tools from tui session"
                }
            ]
        };

        const mockManager = new MockConfigManager(config, systemPolicies);
        const ac = new AccessControl(mockManager);
        await ac.init();

        const entry = {
            timestamp: "2026-03-20T21:31:03.916Z",
            toolName: "exec",
            params: {
                command: "rm ../extensions/fg-tool-access-control/config.json"
            },
            sessionKey: "agent:main:tui-1a4a7751-f51f-4be9-b778-d5845ea22ca4"
        };

        const res = ac.isAllowed(entry as any);
        // This is expected to FAIL (be allowed) with current overly-specific policy
        expect(res.allowed).toBe(false); 
    });
});
