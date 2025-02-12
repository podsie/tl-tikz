interface CodeBlockInfo {
  code: string | null;
  displayText: string;
  isGeneratingCode: boolean;
  language?: string;
}

export function extractCodeBlock(content: string): CodeBlockInfo {
  // Handle incomplete code blocks during streaming
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
  const openingBackticks = (content.match(/```/g) || []).length;

  // If we have an odd number of backtick groups, we're still generating code
  if (openingBackticks % 2 !== 0) {
    const parts = content.split("```");
    return {
      code: null,
      displayText: parts[0] + "\n[Loading code...]\n" + (parts[1] || ""),
      isGeneratingCode: true,
    };
  }

  const codeMatch = content.match(codeBlockRegex);

  if (!codeMatch) {
    return {
      code: null,
      displayText: content,
      isGeneratingCode: false,
    };
  }

  // For display purposes only, show a completion message
  const displayText = content.replace(
    /```(\w+)?\n[\s\S]*?```/g,
    "\n[Code generated]\n"
  );

  return {
    code: codeMatch[2].trim(),
    language: codeMatch[1] || undefined,
    displayText: displayText.replace(/\n{3,}/g, "\n\n").trim(),
    isGeneratingCode: false,
  };
}
