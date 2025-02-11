/**
 * Cleans up a multi-line string by:
 * 1. Removing line breaks that are only present for code editor readability
 * 2. Preserving intentional line breaks
 * 3. Maintaining proper spacing between words
 */
export function cleanMultiLineString(input: string): string {
  return (
    input
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")
      // Remove spaces after line breaks
      .replace(/\n\s+/g, "\n")
      // Remove spaces before line breaks
      .replace(/\s+\n/g, "\n")
      // Remove multiple consecutive line breaks
      .replace(/\n+/g, "\n")
      // Trim leading and trailing whitespace
      .trim()
  );
}
