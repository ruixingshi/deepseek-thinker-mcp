#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import ollama from 'ollama'
import OpenAI from "openai";


// Generate using API
async function getCompletion(_prompt: string) {
  const openai = new OpenAI({
    apiKey: process?.env?.API_KEY,
    baseURL: process?.env?.BASE_URL,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-r1',
      messages: [{ role: 'user', content: _prompt }],
      stream: true  // Change to non-streaming output
    });

    let reasoningContent = ''; // For collecting all reasoning_content
    // Handle streaming response
    for await (const chunk of completion) {
      if (chunk.choices) {
        // If there's reasoning_content, add it to the collector
        // @ts-ignore
        if (chunk.choices[0]?.delta?.reasoning_content) {
          // @ts-ignore
          reasoningContent += chunk.choices[0].delta.reasoning_content;
        }
        // When content is received, indicating reasoning is complete, return the collected content
        if (chunk.choices[0]?.delta?.content) {
          return "Answer with given reasoning process: " + reasoningContent;
        }
      }
    }
    // @ts-ignore
    return "Answer with given reasoning process: " + completion.choices[0]?.message?.reasoning_content;
  } catch (error) {
    return `Error: ${error}`
  }
}

// Generate using ollama
async function getOllamaCompletion(_prompt: string) {
  let reasoningContent = ''; // For collecting all reasoning_content
  try {
    const response = await ollama.generate({
      model: 'deepseek-r1',
      prompt: _prompt,
      stream: true,
    })
    for await (const part of response) {
      reasoningContent = reasoningContent + part.response;
      // Regex matching
      const regex = /<think>([\s\S]*?)<\/think>/i;
      // If contains <think> and </think>, collect thinkContent
      const thinkContent = reasoningContent.match(regex)?.[1]
      if (thinkContent) {
        ollama.abort();
        return "Answer with given reasoning process: " + thinkContent
      }
    }
    return "Answer with given reasoning process: " + reasoningContent
  } catch (error) {
    return `Error: ${error}`
  }
}


const GetDeepseekThinkerSchema = z.object({
  originPrompt: z.string(),
});


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
        description: "think with deepseek",
        inputSchema: {
          type: "object",
          properties: {
            originPrompt: {
              type: "string",
              description: "user's original prompt",
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
              text: "Please enter a prompt",
            },
          ],
        };
      }

      let result = '';
      if(process?.env?.USE_OLLAMA){
        result = await getOllamaCompletion(originPrompt);
      }else{
        result = await getCompletion(originPrompt);
      }
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
          text: "Failed to get deepseek thinker",
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Deepseek Thinker Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
