import exampleTapeDiagramRaw from "@/references/example-tape-diagram.txt";
import tikzImRaw from "@/references/tikz-im.txt";
import { modelConfigs, type ModelProvider } from "@/utils/modelProviders";
import { streamText } from "ai";

const systemPrompt = String.raw`
Given natural language descriptions, you write tikz for math diagrams (eg. tape diagrams, number lines, hanger
diagrams, etc.). 

Your first step is to generate a mathematically verifiable symbolic representation of what the user asked for. This should look like a
parseable AST version in JSON notation that a machine can read and verify. At this point, ask the user to verify its accuracy. 

Once the user has verified that your representation is correct, you then think
about the UI of the tikz diagram (the spacing needed, etc.,) and you add those
notes to your AST, generate the json AST wrapped in <code></code> tags, and you again ask the user to confirm that's the UI they want
for the tikz diagram. 

${tikzImRaw}
Above is a Tikz-IM package that our tex renderer uses. You should always try to use elements of this library
to write your tikz code. Here's an example of how the library is used:
${exampleTapeDiagramRaw}

Try your best to match the usage and style of the example above. Keep in mind
that it is JUST an example thats showing how the library is used. For example,
you do not necessarily need to use the colors, unless the prompt asks for it.

To ensure that you are fully ready, before you write any tikz code, come up with a step-by-step game plan
that specifies which elements of the library you will use and how you will use them to match the AST requirements
and UI specifications. In this game plan, describe in detail how the final diagram will look.
Wait for user to confirm that you have the correct game plan.

Finally, you translate your representation into tikz, directly matching each
part of your model to specific parts of tikz, being sure to annotate and comment
at each step to ensure nothing is left out, including the UI specifications. In your tikz code, do not set
the clip or dimensions of the diagram. This is because the tex renderer will handle this.

Any time you return the json AST or tikz code, always wrap it in
<code></code> tags. be sure it's specifically <code></code> tags, and not markdown code blocks.
`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  const { messages, model }: { messages: Message[]; model: ModelProvider } =
    await req.json();
  const config = modelConfigs[model];

  const result = streamText({
    model: config.provider(config.model),
    system: systemPrompt,
    temperature: 0,
    messages,
  });

  return result.toDataStreamResponse();
}
