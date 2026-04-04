import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { RuleExprEvaluator } from "./RuleExprEvaluator.js";
import type { RuleFunction } from "./RuleFunction.js";
import type { AttributeRetriever } from "./AttributeRetriever.js";

/**
 * Type guard to check if an object implements RuleFunction
 */
export function isRuleFunction(obj: any): obj is RuleFunction {
    return obj 
        && typeof obj === "object" 
        && typeof obj.getName === "function" 
        && typeof obj.execute === "function";
}

/**
 * Type guard to check if an object implements AttributeRetriever
 */
export function isAttributeRetriever(obj: any): obj is AttributeRetriever {
    return obj 
        && typeof obj === "object" 
        && typeof obj.getValue === "function";
}

/**
 * Dynamically loads RuleFunctions and AttributeRetrievers from a given directory
 * and registers them with the provided RuleExprEvaluator.
 * 
 * @param pluginsFolder The directory to scan for plugins
 * @param evaluator The evaluator to register the plugins with
 */
export async function loadPlugins(
    pluginsFolder: string, 
    evaluator: RuleExprEvaluator
): Promise<void> {
    try {
        const stats = await fs.stat(pluginsFolder);
        if (!stats.isDirectory()) {
            return; // Not a directory, or doesn't exist
        }
    } catch {
        // Directory probably doesn't exist, which is fine, we just skip
        return;
    }

    const files = await fs.readdir(pluginsFolder);

    for (const file of files) {
        // Evaluate .js files and .ts files
        if (file.endsWith(".js") || (file.endsWith(".ts") && !file.endsWith(".d.ts"))) {
            const fullPath = path.join(pluginsFolder, file);
            
            // Convert to file:// URL for ES Module dynamic import
            const fileUrl = pathToFileURL(fullPath).href;
            
            try {
                // Dynamically import the module
                const module = await import(fileUrl);
                
                // Inspect all exports from the module
                for (const key of Object.keys(module)) {
                    const exportedItem = module[key];
                    if (!exportedItem) continue;

                    let instance = exportedItem;
                    
                    // If it's a class definition (a constructor function)
                    if (typeof exportedItem === "function" && /^[A-Z]/.test(exportedItem.name)) {
                        try {
                            instance = new exportedItem();
                        } catch (e) {
                            // Might not be a parameterless constructor, optionally log or ignore
                            continue;
                        }
                    }

                    // Duck-typing check and Registration
                    if (isRuleFunction(instance)) {
                        evaluator.registerFunction(instance);
                        console.log(`Registered dynamically loaded RuleFunction: ${instance.getName()}`);
                    } else if (isAttributeRetriever(instance)) {
                        // Assuming you have an attribute name available to register it with.
                        // We can use a getName method if it has one, otherwise the export name
                        const attrName = typeof (instance as any).getName === 'function' 
                            ? (instance as any).getName() 
                            : key;
                            
                        evaluator.registerAttributeRetriever(attrName, instance);
                        console.log(`Registered dynamically loaded AttributeRetriever: ${attrName}`);
                    }
                }
            } catch (err) {
                console.error(`Failed to load plugin from ${fileUrl}:`, err);
            }
        }
    }
}
