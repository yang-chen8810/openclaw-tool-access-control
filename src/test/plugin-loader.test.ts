import fs from "fs/promises";
import path from "path";
import { RuleExprEvaluator } from "../evaluator/RuleExprEvaluator.js";
import { loadPlugins } from "../evaluator/plugin-loader.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("plugin-loader", () => {
    const testPluginsDir = path.join(__dirname, "temp-plugins");

    beforeEach(async () => {
        await fs.mkdir(testPluginsDir, { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(testPluginsDir, { recursive: true, force: true });
    });

    it("should dynamically load RuleFunction and AttributeRetriever", async () => {
        // Create a dummy plugin file
        const pluginCode = `
            export class TestRule {
                getName() { return "test_rule"; }
                execute() { return "rule_executed"; }
            }

            export const testRetriever = {
                getValue: () => "retriever_value"
            };
            
            // Should be ignored
            export const justAString = "hello";
        `;

        const pluginPath = path.join(testPluginsDir, "plugin1.js");
        await fs.writeFile(pluginPath, pluginCode, "utf-8");

        const evaluatorRule = new RuleExprEvaluator('test_rule()');
        await loadPlugins(testPluginsDir, evaluatorRule);

        // Verify the RuleFunction was registered and works
        const ruleResult = evaluatorRule.evaluate({});
        expect(ruleResult).toBe("rule_executed");

        // Verify the AttributeRetriever was registered
        // The loader uses the export name as the key for AttributeRetriever if there is no getName
        const evaluatorAttr = new RuleExprEvaluator('testRetriever');
        await loadPlugins(testPluginsDir, evaluatorAttr);
        const attrResult = evaluatorAttr.evaluate({});
        expect(attrResult).toBe("retriever_value");
    });
});
