import tikzImRaw from "@/references/tikz-im.txt";
import { cleanMultiLineString } from "@/utils/strings";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

const systemPrompt = cleanMultiLineString(`
Given natural language descriptions, you write tikz for math diagrams (eg. tape diagrams, number lines, hanger
diagrams, etc.). 

Your first step is to generate a mathematically verifiable symbolic representation of what the user asked for. This should look like a
parseable AST version in JSON notation that a machine can read and verify. At this point, ask the user to verify its accuracy. 

Once the user has verified that your representation is correct, you then think
about the UI of the tikz diagram (the spacing needed, etc.,) and you add those
notes to your AST, and you again ask the user to confirm that's the UI they want
for the tikz diagram.

As you prepare to write your tikz code, reference this library that our tex renderer uses and come up with a step-by-step game plan
for you will use elements of the library to write the tikz code, as well as to implement the UI specifications:
${tikzImRaw}

Finally, You translate your representation into tikz,
directly matching each part of your model to specific parts of tikz, being sure
to annotate and comment at each step to ensure nothing is left out, including
the UI specifications.

Any time you return the json AST or tikz code, always wrap it in
<code></code> tags.
`);

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
    model: anthropic("claude-3-5-sonnet-latest"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
