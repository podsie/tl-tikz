"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex h-screen">
      {/* Left panel - placeholder for now */}
      <div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-4 text-zinc-500 dark:text-zinc-400">
          Left panel content will go here
        </div>
      </div>

      {/* Right panel - Chat interface */}
      <div className="w-1/2 flex flex-col h-full">
        {/* Chat messages container */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-zinc-50 dark:bg-zinc-800/50"
              }`}
            >
              <div className="font-semibold mb-1">
                {m.role === "user" ? "User:" : "AI:"}
              </div>
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              className="w-full p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={input}
              placeholder="Ask a question or type a command..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
