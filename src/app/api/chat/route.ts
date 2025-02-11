import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Type the messages array properly
  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    messages,
  });

  return result.toDataStreamResponse();
}
