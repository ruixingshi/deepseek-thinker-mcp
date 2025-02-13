# Deepseek Thinker MCP Server

An MCP (Model Context Protocol) based Deepseek reasoning server that supports get reasoning content from Deepseek api (OpenAI Mode) or Ollama Server, providing reasoning results to MCP-enabled AI Clients, like Claude Desktop.

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
### Local Server configuration

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

## Tech Stack

- TypeScript
- @modelcontextprotocol/sdk
- OpenAI API
- Ollama
- Zod (parameter validation)

## License

This project is licensed under the MIT License. See the LICENSE file for details.


