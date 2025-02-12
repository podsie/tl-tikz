"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { LeftPanel } from "@/components/chat/LeftPanel";
import { extractCodeBlock } from "@/utils/messages";
import { ModelProvider } from "@/utils/modelProviders";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";

interface CodeBlock {
  code: string;
  messageIndex: number;
}

export default function Chat() {
  const [selectedModel, setSelectedModel] =
    useState<ModelProvider>("anthropic");
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      model: selectedModel,
    },
  });
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  // Update code blocks whenever messages change
  useEffect(() => {
    const newCodeBlocks: CodeBlock[] = [];
    messages.forEach((message, index) => {
      if (message.role === "assistant") {
        const { code } = extractCodeBlock(message.content);
        if (code !== null) {
          newCodeBlocks.push({ code, messageIndex: index });
        }
      }
    });
    setCodeBlocks(newCodeBlocks);
    // If we have code blocks and either no current index or new blocks,
    // set to the latest block
    if (newCodeBlocks.length > 0) {
      setCurrentBlockIndex(newCodeBlocks.length - 1);
    }
  }, [messages]);

  const handlePrevious = () => {
    setCurrentBlockIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentBlockIndex((prev) => Math.min(codeBlocks.length - 1, prev + 1));
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {" "}
      {/* Prevent main container from scrolling */}
      <LeftPanel
        code={codeBlocks[currentBlockIndex]?.code ?? null}
        currentIndex={currentBlockIndex}
        totalBlocks={codeBlocks.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      {/* Right panel - Chat interface */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex-1 min-h-0">
          {" "}
          {/* min-h-0 allows flex child to scroll */}
          <ChatMessages messages={messages} />
        </div>
        <div className="flex-shrink-0">
          {" "}
          {/* Prevent input from shrinking */}
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>
      </div>
    </div>
  );
}
