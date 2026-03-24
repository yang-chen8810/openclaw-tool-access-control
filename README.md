# OpenClaw Access Control Plugin

Deterministic and fine-grained access control for OpenClaw tool calls.

## Why this plugin?

While prompt-based protection (system prompts) can guide agent behavior, it is not always reliable as LLM outputs are non-deterministic. However, tools are how agents act upon the world. By implementing deterministic access control at the tool level, you can ensure your agent's actions are always within safe boundaries.

OpenClaw itself provides [coarse-grained tool configuration](https://docs.openclaw.ai/tools#tool-configuration) which allows enabling/disabling tools globally or per session. This plugin extends that capability by providing **fine-grained access control**, allowing policies to grant or deny access based on:
- Tool Name
- Session Key / Channel
- **Parameters** (deep inspection of tool arguments)

This plugin uses the `before_tool_call` hook to intercept tool call commands and evaluate policies to allow or deny the execution.

### Example Policy
```json
    {
      "type": "grant",
      "toolName": ["browser"],
      "sessionKey": ["agent:main:main"],
      "condition": "params.url like 'https://openclaw.ai/*'",
      "desc": "Allow main session to use browser tool for openclaw.ai only"
    },
    {
      "type": "grant",
      "toolName": ["exec"],
      "sessionKey": [],
      "condition": "sessionKey like 'agent:main:tui-*' and params.command match '^(ls|pwd)$'",
      "desc": "Allow TUI to execute safe shell commands"
    },
    {
      "type": "deny",
      "toolName": [
        "edit",
        "write"
      ],
      "sessionKey": [
        "*"
      ],
      "condition": "params.file_path like '*fg-tool-access-control*' or params.path like '*fg-tool-access-control*'",
      "desc": "Deny edit/write fg-tool-access-control plugin files"
    }
```

## Policy Evaluation Logic

The plugin follows a secure-by-default model:
1. **Deny policies are evaluated first**: If any deny policy matches, the tool call is blocked immediately.
2. **Grant policies are evaluated second**: If a match is found, the tool call is permitted.
3. **Implicit Deny**: If no policies match, the tool call is denied.

This logic supports a "Grant everything except..." model using deny policies, although explicit "Grant only..." models are recommended for higher security.

## Rule Grammar & Operators

The condition field supports a rich set of operators and expressions:

### Relational Operators
- Standard: `<`, `<=`, `>`, `>=`, `==`, `!=`
- String Matching:
  - `match` / `not_match`: Regular expression matching.
  - `contain` / `not_contain`: Simple substring matching.
  - `start_with` / `not_start_with`: Prefix matching.
  - `like` / `not_like`: Pattern matching using `?` (any single character) and `*` (zero or more characters).
- Array/Collection:
  - `in` / `not_in`: Checks if an element exists in an array.

### Logical Operators & Priority
- Operators: `not` > `and` > `or`.
- Use parentheses `( )` to explicitly define evaluation priority.
- Strings must be enclosed in single quotes, e.g., `'xyz'`.

### Built-in Functions
- `length(str)`: Returns string length.
- `substring(str, start, end)`: Returns a substring.
- `now()`: Returns current timestamp.
- `lower(str)` / `upper(str)`: Case conversion.
- `trim(str)`: Removes surrounding whitespace.
- `toString(obj)`: Converts values to string format.

## Configuration & Policy Structure

Configuration is managed in `config.json`:

```json
{
  "mode": "on",
  "port": 8080,
  "caseSensitive": false,
  "policies": [
    {
      "type": "grant",
      "toolName": [
        "*"
      ],
      "sessionKey": [
        "agent:main:main"
      ],
      "condition": "",
      "desc": "Grant access to all tools from main session"
    }
  ]
}
```

### Configuration Fields
- **mode**:
  - `on`: Policies are strictly enforced.
  - `off`: Plugin is inactive.
  - `monitor`: Policies are evaluated and logged, but actions are never blocked. Use this mode to try and enable safe tool calls (see details in "Add from Logs").
- **port**: The port for the local Admin UI.
- **caseSensitive**: Set to `true` for exact casing requirements, recommend use `false`.
- **policies**: An array of policy objects.
  - **toolName**: Array of tool names or `["*"]` or `[]` for all tools.
  - **sessionKey**: Array of session keys or `["*"]` or `[]` for all sessions.
  - **condition**: The logic expression (e.g., `params.command = 'ls' and ...`, toolName and sessionKey can also be used in condition, e.g. `sessionKey like 'agent:main:tui-*'`).
  - **desc**: Description of the policy (returned as the reason if blocked).
- The default policy is to grant access to all tools from main session.
## Installation

### From Source
1. Download or clone this repository.
2. Build the plugin:
   ```bash
   npm run build
   ```
3. Install into OpenClaw:
   ```bash
   openclaw plugins install <path to dist folder>
   # OR
   openclaw plugins install <path to fg-tool-access-control.zip>
   ```

## Admin UI

You can edit `config.json` to change settings and policy, or use Admin UI.

#### Policy Editor
Manage all your rules with a clean, visual interface:
![Policy Editor Interface](assets/images/admin_policy.png)

#### Add from Logs
Instantly create new policies from recent tool execution history:
![Creating Policies from Logs](assets/images/admin_log.png)

- **Start UI**: `npm run server` (starts on the port defined in `config.json`).
- **Features**: Edit policies directly, view logs, and create new policies instantly from recent tool execution history.
- **Hot Reload**: The plugin automatically reloads saved configurations every 60 seconds.
- **Security**: Shut down the admin UI when not in use.

## Security Best Practices

### Prefer "Grant" over "Deny"
While deny policies are useful, relying on explicit **grant policies** (Allow-list) is more reliable. Deterministic rules ensure that unexpected LLM outputs never bypass security boundaries.

### Handling LLM Non-determinism
LLMs may generate unexpected parameters that fail strict grant policies (e.g., attempting a file check before a deletion). In such cases:
1. Refine the **condition** using more flexible regular expressions.
2. Provide specific **instructions in the system prompt or skills** so the LLM understands the expected parameter format.

### System Safety
A `system.policy.json` is included by default. It contains critical deny policies to prevent an agent from tampering with the plugin's own configuration. You can add more policies here as you identify specific loopholes. As a rule of thumb, **explicitly enumerate all allowed tools and parameters** for the most secure environment.
