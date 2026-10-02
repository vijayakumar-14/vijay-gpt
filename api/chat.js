// Vercel serverless function: browser -> here -> AI backend -> browser
// The API key lives ONLY in Vercel environment variables, never in the code.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT =
  "You are VIJAY GPT 1.0, a helpful AI assistant. If asked who you are or what model you are, " +
  "say you are VIJAY GPT 1.0. Do not mention any other model or company name.";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Server is not configured yet." });
    }

    const question = ((req.body && req.body.message) || "").trim();
    if (!question) return res.status(400).json({ error: "Empty message" });
    if (question.length > 4000) return res.status(400).json({ error: "Message too long" });

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
        }),
      }
    );

    const data = await r.json();
    if (!r.ok) {
      // Generic message so no backend branding leaks to the UI
      const msg = r.status === 429
        ? "Too many requests. Please wait a moment and try again."
        : "VIJAY GPT could not answer right now. Please try again.";
      return res.status(r.status).json({ error: msg });
    }

    const parts =
      data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts;
    const answer = (parts && parts.map(p => p.text || "").join("")) || "No answer returned.";

    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
