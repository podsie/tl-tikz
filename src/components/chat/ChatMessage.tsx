import { extractCodeBlock } from "@/utils/messages";
import { Message } from "ai";
import { useState } from "react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { code, isGeneratingCode } = extractCodeBlock(message.content);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  // Split content into parts before and after code block
  const parts = message.content.split(/<code>|<\/code>/);

  return (
    <div
      className={`p-4 rounded-lg ${
        message.role === "user"
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "bg-zinc-50 dark:bg-zinc-800/50"
      }`}
    >
      <div className="font-semibold mb-1">
        {message.role === "user" ? "User:" : "AI:"}
      </div>
      <div className="whitespace-pre-wrap text-sm space-y-2">
        {/* Text before code */}
        {parts[0]}

        {/* Code block section */}
        {isGeneratingCode ? (
          <div className="font-mono bg-zinc-100 dark:bg-zinc-900 p-2 rounded">
            Generating code... <span className="animate-pulse">...</span>
          </div>
        ) : (
          code && (
            <div className="font-mono bg-zinc-100 dark:bg-zinc-900 rounded">
              <div
                className="p-2 flex justify-between items-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800"
                onClick={() => setIsCodeExpanded(!isCodeExpanded)}
              >
                <span className="text-sm text-zinc-500">
                  {isCodeExpanded ? "Hide" : "Show"} generated code
                </span>
                <span className="text-xs text-zinc-400">
                  {isCodeExpanded ? "▼" : "▶"}
                </span>
              </div>
              {isCodeExpanded && (
                <pre className="p-2 overflow-auto max-h-96 border-t border-zinc-200 dark:border-zinc-700">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          )
        )}

        {/* Text after code */}
        {parts[2]}
      </div>
    </div>
  );
}
