import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import registerBeforeToolCall from "./hooks/before-tool-call.js";

/**
 * Main entry point for the OpenClaw Access Control Plugin.
 * Registers the 'before_tool_call' hook to evaluate access policies.
 */
export default function register(api: OpenClawPluginApi) {
  registerBeforeToolCall(api);
}
