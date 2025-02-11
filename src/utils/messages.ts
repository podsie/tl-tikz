interface CodeBlockInfo {
  code: string | null;
  displayText: string;
  isGeneratingCode: boolean;
}

export function extractCodeBlock(content: string): CodeBlockInfo {
  // Handle incomplete code tags during streaming
  const openTagCount = (content.match(/<code>/g) || []).length;
  const closeTagCount = (content.match(/<\/code>/g) || []).length;

  // If we have an opening tag but no closing tag yet, we're generating code
  if (openTagCount > closeTagCount) {
    const parts = content.split("<code>");
    return {
      code: null,
      displayText: parts[0] + "\n[Loading code...]\n" + (parts[1] || ""),
      isGeneratingCode: true,
    };
  }

  const codeMatch = content.match(/<code>([\s\S]*?)<\/code>/);

  if (!codeMatch) {
    return {
      code: null,
      displayText: content,
      isGeneratingCode: false,
    };
  }

  // For display purposes only, show a completion message
  const displayText = content.replace(
    /<code>[\s\S]*?<\/code>/g,
    "\n[Code generated]\n"
  );

  return {
    code: codeMatch[1].trim(),
    displayText: displayText.replace(/\n{3,}/g, "\n\n").trim(),
    isGeneratingCode: false,
  };
}
