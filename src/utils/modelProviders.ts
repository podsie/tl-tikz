import { anthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

// Initialize OpenAI with strict compatibility for the official API
export const openai = createOpenAI({
  compatibility: "strict",
});

// Initialize Google AI
export const google = createGoogleGenerativeAI();

// Model configurations
export const modelConfigs = {
  anthropic: {
    provider: anthropic,
    model: "claude-3-5-sonnet-latest",
  },
  openai: {
    provider: openai,
    model: "gpt-4o",
  },
  google: {
    provider: google,
    model: "gemini-2.0-pro-exp-02-05",
  },
} as const;

export type ModelProvider = keyof typeof modelConfigs;
