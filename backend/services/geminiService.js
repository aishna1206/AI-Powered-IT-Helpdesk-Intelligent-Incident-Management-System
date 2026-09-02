const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

const ticketAnalysisSchema = {
  type: "object",

  properties: {
    category: {
      type: "string",
      enum: [
        "Hardware",
        "Software",
        "Network",
        "Access",
        "Other",
      ],
    },

    priority: {
      type: "string",
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
    },

    suggestedResolution: {
      type: "string",
      description:
        "A concise set of practical troubleshooting steps for the reported IT issue.",
    },
  },

  required: [
    "category",
    "priority",
    "suggestedResolution",
  ],
};


/* ============================================
   FALLBACK ANALYSIS
============================================ */

const fallbackAnalysis = () => {
  return {
    category: "Other",
    priority: "Medium",

    suggestedResolution:
      "Automated analysis is currently unavailable. Please review the incident details and perform standard IT support troubleshooting.",

    aiAvailable: false,
  };
};


/* ============================================
   ANALYZE TICKET
============================================ */

const analyzeTicket = async (
  title,
  description
) => {

  // No API key configured
  if (!ai) {
    console.warn(
      "Gemini AI unavailable: GEMINI_API_KEY is not configured."
    );

    return fallbackAnalysis();
  }

  const prompt = `
You are an IT helpdesk incident classification assistant.

Analyze the following IT support ticket.

Title:
${title}

Description:
${description}

Classify the incident into exactly one category:
Hardware, Software, Network, Access, or Other.

Assign exactly one priority:
Low, Medium, High, or Critical.

Then provide a concise and practical recommended troubleshooting
procedure for the IT support agent.

Important:
- Base the classification only on the information provided.
- Do not invent technical facts.
- The recommendation should be safe and appropriate for a
  general enterprise IT support environment.
`;

  try {

    const interaction =
      await ai.interactions.create({
        model: "gemini-3.5-flash-lite",

        input: prompt,

        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: ticketAnalysisSchema,
        },
      });

    const result =
      JSON.parse(interaction.output_text);

    return {
      ...result,
      aiAvailable: true,
    };

  } catch (error) {

    console.error(
      "Gemini analysis failed. Using fallback:",
      error.message || error
    );

    return fallbackAnalysis();
  }
};


module.exports = {
  analyzeTicket,
};