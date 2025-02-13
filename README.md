# Deepseek Thinker MCP Server

一个基于 MCP (Model Context Protocol) 的 Deepseek 思维推理服务器，支持通过 OpenAI API 或 Ollama 进行 AI 推理, 并将推理结果提供给接入MCP的AI Client使用。

## 核心特性

- 🤖 **双模式支持**
  - 支持 OpenAI API 模式
  - 支持 Ollama 本地模式
  
- 🔄 **流式输出**
  - 实时流式推理响应
  - 支持推理过程捕获
  
- 🎯 **专注思维推理**
  - 捕获 AI 的思维推理过程
  - 提供结构化的推理输出
  
- 🛡️ **错误处理**
  - 完善的参数验证
  - 友好的错误提示

## 可用工具

### get-deepseek-thinker
- **描述**: 使用 Deepseek 模型进行思维推理
- **输入参数**:
  - `originPrompt` (string): 用户的原始提示词
- **返回**: 包含推理过程的结构化文本响应

## 环境配置

### OpenAI API 模式
需要设置以下环境变量：
```bash
API_KEY=<Your OpenAI API Key>
BASE_URL=<API Base URL>
```

### Ollama 模式
需要设置以下环境变量：
```bash
USE_OLLAMA=true
```

## 使用方法

### 与 Claude Desktop 集成
在 `claude_desktop_config.json` 中添加以下配置：

```json
{
  "mcpServers": {
    "deepseek-thinker": {
      "command": "npx",
      "args": [
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

### 使用 Ollama 模式
```json
{
  "mcpServers": {
    "deepseek-thinker": {
      "command": "npx",
      "args": [
        "deepseek-thinker-mcp"
      ],
      "env": {
        "USE_OLLAMA": "true"
      }
    }
  }
}
```

## 开发构建

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行服务
node build/index.js
```

## 技术栈

- TypeScript
- @modelcontextprotocol/sdk
- OpenAI API
- Ollama
- Zod (参数验证)

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。
