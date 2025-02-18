import { useCallback, useState } from "react";

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
  const [svgData, setSvgData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compileTikz = useCallback(async (tikzCode: string) => {
    setIsLoading(true);
    setError(null);
    setSvgData(null);

    try {
      const response = await fetch("/api/compile-tikz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tikz: tikzCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compile TikZ");
      }

      const svg = await response.text();
      setSvgData(svg);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compile TikZ");
      setSvgData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCompile = () => {
    if (code && language?.toLowerCase() === "latex") {
      compileTikz(code);
    }
  };

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
      <div className="flex-1 min-h-0 bg-zinc-100 dark:bg-zinc-800 relative overflow-auto">
        {language?.toLowerCase() === "latex" && (
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 p-4 text-sm">
                Error: {error}
              </div>
            ) : svgData ? (
              <div
                className="w-full bg-white dark:bg-zinc-900 rounded-lg p-4 max-h-[400px] overflow-auto"
                dangerouslySetInnerHTML={{ __html: svgData }}
              />
            ) : null}
          </div>
        )}

        <div className="p-4 relative">
          <div className="absolute top-2 right-2 flex gap-2">
            {language?.toLowerCase() === "latex" && (
              <button
                onClick={handleCompile}
                disabled={isLoading}
                className={`px-3 py-1 rounded text-sm transition-colors z-10 ${
                  isLoading
                    ? "bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed"
                    : "bg-zinc-200 hover:bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-300"
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={handleCopy}
              className={`px-3 py-1 rounded text-sm transition-colors z-10 ${
                copied
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-zinc-200 hover:bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-300"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="font-mono text-sm whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
