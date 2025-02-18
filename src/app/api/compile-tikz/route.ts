export const maxDuration = 30;

function stripLatexWrapper(code: string): string {
  // Remove document class declaration if present
  code = code.replace(/\\documentclass\{IM\}\s*/g, "");

  // Remove begin and end document tags if present
  code = code.replace(/\\begin\{document\}\s*/g, "");
  code = code.replace(/\\end\{document\}\s*/g, "");

  // Trim any remaining whitespace
  return code.trim();
}

export async function POST(req: Request) {
  try {
    const { tikz } = await req.json();

    if (!tikz || typeof tikz !== "string") {
      return new Response(JSON.stringify({ error: "TikZ code not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Strip the LaTeX wrapper if present
    const processedTikz = stripLatexWrapper(tikz);

    const endpoint = process.env.TIKZ_TO_TEX_ENDPOINT;
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: "TIKZ_TO_TEX_ENDPOINT not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const fullUrl = `${endpoint}/compile`;
    console.log("Attempting to call TikZ compilation service at:", fullUrl);
    console.log("Environment variable TIKZ_TO_TEX_ENDPOINT:", endpoint);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tikz: processedTikz }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage: string;

      if (contentType?.includes("application/json")) {
        // If it's JSON, parse it
        const error = await response.json();
        errorMessage = error.error || error.message || "Unknown error";
      } else {
        // If it's not JSON (e.g., HTML error page), get the status text
        errorMessage = `Server error: ${response.status} ${response.statusText}`;

        // If we can get the text, include it (but limit its length)
        try {
          const text = await response.text();
          const truncatedText = text.slice(0, 100); // Limit error message length
          errorMessage += ` - ${truncatedText}${
            text.length > 100 ? "..." : ""
          }`;
        } catch {
          // If we can't get the text, just use the status
          errorMessage += " (No additional error details available)";
        }
      }

      return new Response(
        JSON.stringify({
          error: "TikZ compilation failed",
          details: errorMessage,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the SVG data
    const svgData = await response.text();

    // Return the SVG with proper content type
    return new Response(svgData, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
