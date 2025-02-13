# Deepseek Thinker MCP Server

An MCP (Model Context Protocol) based Deepseek reasoning server that supports AI inference through both OpenAI API and Ollama, providing reasoning results to MCP-enabled AI Clients, like Claude Desktop.

## Core Features

- 🤖 **Dual Mode Support**
  - OpenAI API mode support
  - Ollama local mode support
  
- 🔄 **Streaming Output**
  - Real-time streaming inference response
  - Reasoning process capture support
  
- 🎯 **Focused Reasoning**
  - Captures Deepseek's thinking process
  - Provides structured reasoning output
  
- 🛡️ **Error Handling**
  - Comprehensive parameter validation
  - User-friendly error messages

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

## Development Setup

```bash
# Install dependencies
npm install

# Build project
npm run build

# Run service
node build/index.js
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

## Tech Stack

- TypeScript
- @modelcontextprotocol/sdk
- OpenAI API
- Ollama
- Zod (parameter validation)

## License

This project is licensed under the MIT License. See the LICENSE file for details.


