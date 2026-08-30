const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey,
});

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


const analyzeTicket = async (title, description) => {
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

  const interaction = await ai.interactions.create({
    model: "gemini-3.7-flash",

    input: prompt,

    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: ticketAnalysisSchema,
    },
  });

  const result = JSON.parse(interaction.output_text);

  return result;
};


module.exports = {
  analyzeTicket,
};