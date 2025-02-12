interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedModel: "anthropic" | "openai" | "google";
  setSelectedModel: (model: "anthropic" | "openai" | "google") => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  selectedModel,
  setSelectedModel,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="flex justify-end">
          <select
            value={selectedModel}
            onChange={(e) =>
              setSelectedModel(
                e.target.value as "anthropic" | "openai" | "google"
              )
            }
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="anthropic">Claude 3.5 Sonnet</option>
            <option value="openai">GPT-4O</option>
            <option value="google">Gemini 2.0 Pro Exp</option>
          </select>
        </div>
        <textarea
          className="w-full p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          value={input}
          placeholder="Ask a question or type a command..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ minHeight: "2.5rem" }}
        />
      </form>
    </div>
  );
}
