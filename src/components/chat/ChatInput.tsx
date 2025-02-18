import React, { useState } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedModel: "anthropic" | "openai" | "google";
  setSelectedModel: (model: "anthropic" | "openai" | "google") => void;
}

interface UploadedImage {
  url: string;
  publicId: string;
  name: string;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  selectedModel,
  setSelectedModel,
}: ChatInputProps) {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      // Insert the image URL into the textarea
      const imageMarkdown = `![${file.name}](${data.url})`;
      const textArea = e.target.form?.querySelector("textarea");
      if (textArea) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const newValue =
          input.substring(0, start) + imageMarkdown + input.substring(end);
        const event = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        handleInputChange(event);
      }

      setUploadedImage({
        url: data.url,
        publicId: data.public_id,
        name: file.name,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    if (!uploadedImage) return;

    // Remove the image markdown from the textarea
    const imageMarkdown = `![${uploadedImage.name}](${uploadedImage.url})`;
    const newValue = input.replace(imageMarkdown, "");
    const event = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleInputChange(event);

    setUploadedImage(null);
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </span>
            </label>
            {uploadedImage && (
              <div className="flex items-center gap-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <img
                  src={uploadedImage.url}
                  alt={uploadedImage.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
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
