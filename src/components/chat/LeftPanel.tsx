import { useState } from "react";

interface LeftPanelProps {
  code: string | null;
  language?: string;
  currentIndex: number;
  totalBlocks: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function LeftPanel({
  code,
  language,
  currentIndex,
  totalBlocks,
  onPrevious,
  onNext,
}: LeftPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800 h-full">
        <div className="p-4 text-zinc-500 dark:text-zinc-400">
          No code to display yet. Ask me to create a TikZ diagram!
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-semibold">Generated TikZ Code</h2>
            {language && (
              <div className="text-sm text-zinc-500">Language: {language}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="px-2 py-1 rounded text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-sm text-zinc-500">
            {currentIndex + 1} of {totalBlocks}
          </span>
          <button
            onClick={onNext}
            disabled={currentIndex === totalBlocks - 1}
            className="px-2 py-1 rounded text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-zinc-100 dark:bg-zinc-800 relative">
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 px-3 py-1 rounded text-sm transition-colors z-10 ${
            copied
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-zinc-200 hover:bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-300"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <div className="h-full overflow-auto p-4">
          <pre className="font-mono text-sm whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
