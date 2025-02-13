#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import axios from "axios";
import ollama from 'ollama'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process?.env?.API_KEY || "sk-K4lSTPT2wxLyv2hXtK7O5xkh2cspBtBiCrNLUTpGRiEMrWpD",  // 直接使用 API key
  baseURL: process?.env?.BASE_URL || "https://api.lkeap.cloud.tencent.com/v1",
});

// 定义一个异步函数来处理请求
async function getCompletion(_prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: _prompt }],
      stream: true  // 改为非流式输出
    });

    let reasoningContent = ''; // 用于收集所有的reasoning_content
    // 处理流式响应
    for await (const chunk of completion) {
      if (chunk.choices) {
        // 如果有reasoning_content，就添加到收集器中
        // @ts-ignore
        if (chunk.choices[0]?.delta?.reasoning_content) {
          // @ts-ignore
          reasoningContent += chunk.choices[0].delta.reasoning_content;
        }
        // 当收到content时，表示reasoning已经完成，返回收集的内容
        if (chunk.choices[0]?.delta?.content) {
          return "用给出的思考过程回答问题：" + reasoningContent;
        }
      }
    }
    // @ts-ignore
    return "用给出的思考过程回答问题：" + completion.choices[0]?.message?.reasoning_content;
  } catch (error) {
    // console.error("Error occurred:", error);
    return `Error: ${error}`
  }
}



const GetDeepseekThinkerSchema = z.object({
  originPrompt: z.string(),
});

// const options = {
//   method: 'POST',
//   headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
//   body: '{"model":"deepseek-ai/DeepSeek-V3","messages":[{"role":"user","content":"中国大模型行业2025年将会迎来哪些机遇和挑战？"}],"stream":false,"max_tokens":512,"stop":["null"],"temperature":0.7,"top_p":0.7,"top_k":50,"frequency_penalty":0.5,"n":1,"response_format":{"type":"text"},"tools":[{"type":"function","function":{"description":"<string>","name":"<string>","parameters":{},"strict":false}}]}'
// };

// 一次性输出
const ollamaGenerate = async (_prompt: string) => {
  try {
    const response = await ollama.generate({
      model: 'deepseek-r1',
      prompt: _prompt,
      stream: false,
    })
    // 截取<think>和</think>之间的内容
    const thinkContent = response.response.match(/<think>(.*?)<\/think>/)?.[1]
    return thinkContent || response.response
  } catch (e) {
    return `Error: ${e}`
  }
}

// 流式输出
const ollamaStream = async function* (_prompt: string) {
  try {
    const response = await ollama.generate({
      model: 'deepseek-r1',
      prompt: _prompt,
      stream: true,
    })
    for await (const part of response) {
      // 直接返回数组，不需要再包装在数组中
      yield {
        type: "text",
        text: part.response,
      };
    }
  } catch (e) {
    yield {
      type: "text",
      text: `Error: ${e}`,
    };
  }
}

// Create server instance
const server = new Server(
  {
    name: "deepseek-thinker",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-deepseek-thinker",
        description: "通过deepseek模式思考",
        inputSchema: {
          type: "object",
          properties: {
            originPrompt: {
              type: "string",
              description: "用户原始的prompt",
            },
          },
          required: ["originPrompt"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get-deepseek-thinker") {
      const { originPrompt } = GetDeepseekThinkerSchema.parse(args);
      if (!originPrompt) {
        return {
          content: [
            {
              type: "text",
              text: "亲，请输入prompt",
            },
          ],
        };
      }

      // 使用一次性输出
      const result = await getCompletion(originPrompt);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error in request handler:", error);

    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: "text",
            text: `Invalid arguments: ${error.errors
              .map((e) => `${e.path.join(".")}: ${e.message}`)
              .join(", ")}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: "Failed to fetch goal info",
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Goal Helper Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
