# Deepseek Thinker MCP Server

[![smithery badge](https://smithery.ai/badge/@ruixingshi/deepseek-thinker-mcp)](https://smithery.ai/server/@ruixingshi/deepseek-thinker-mcp)

 A MCP (Model Context Protocol) provider Deepseek reasoning content to MCP-enabled AI Clients, like Claude Desktop. Supports access to Deepseek's thought processes from the Deepseek API service or from a local Ollama server.

<a href="https://glama.ai/mcp/servers/d7spzsfuwz"><img width="380" height="200" src="https://glama.ai/mcp/servers/d7spzsfuwz/badge" alt="Deepseek Thinker Server MCP server" /></a>

## Core Features

- 🤖 **Dual Mode Support**
  - OpenAI API mode support
  - Ollama local mode support

- 🎯 **Focused Reasoning**
  - Captures Deepseek's thinking process
  - Provides reasoning output

## Available Tools

### get-deepseek-thinker
- **Description**: Perform reasoning using the Deepseek model
- **Input Parameters**:
  - `originPrompt` (string): User's original prompt
- **Returns**: Structured text response containing the reasoning process

## Environment Configuration

### OpenAI API Mode
Set the following environment variables:
```bash
API_KEY=<Your OpenAI API Key>
BASE_URL=<API Base URL>
```

### Ollama Mode
Set the following environment variable:
```bash
USE_OLLAMA=true
```

## Usage

### Integration with AI Client, like Claude Desktop
Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "deepseek-thinker": {
      "command": "npx",
      "args": [
        "-y",
        "deepseek-thinker-mcp"
      ],
      "env": {
        "API_KEY": "<Your API Key>",
        "BASE_URL": "<Your Base URL>"
      }
    }
  }
}
```

### Using Ollama Mode
```json
{
  "mcpServers": {
    "deepseek-thinker": {
      "command": "npx",
      "args": [
        "-y",
        "deepseek-thinker-mcp"
      ],
      "env": {
        "USE_OLLAMA": "true"
      }
    }
  }
}
```
### Local Server Configuration

```json
{
  "mcpServers": {
    "deepseek-thinker": {
      "command": "node",
      "args": [
        "/your-path/deepseek-thinker-mcp/build/index.js"
      ],
      "env": {
        "API_KEY": "<Your API Key>",
        "BASE_URL": "<Your Base URL>"
      }
    }
  }
}
```

## Development Setup

```bash
# Install dependencies
npm install

# Build project
npm run build

# Run service
node build/index.js
```

## FAQ

### Response like this: "MCP error -32001: Request timed out"
This error occurs when the Deepseek API response is too slow or when the reasoning content output is too long, causing the MCP server to timeout.

## Tech Stack

- TypeScript
- @modelcontextprotocol/sdk
- OpenAI API
- Ollama
- Zod (parameter validation)

## License

This project is licensed under the MIT License. See the LICENSE file for details.



