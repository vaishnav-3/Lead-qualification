const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  systemInstruction: [
    {
      text: `You are an AI sales lead qualification assistant.

Your role:
- Evaluate potential customer leads for a given product/offer.
- Classify each lead's buying intent as High, Medium, or Low.
- Always provide a clear, concise reasoning (1–2 sentences).
- Use only the information provided (product/offer + lead details). Do not invent details.

Response Rules:
- Always return a JSON object.
- Keys must be exactly: "intent" and "reasoning".
- Valid values for "intent": "High", "Medium", or "Low".
- "reasoning" should explain why you chose that intent in 1–2 sentences.
- Do not include extra text, commentary, or formatting outside the JSON object.`,
    }
  ],
};

// Score a single lead using Gemini AI
async function scoreLeadWithAI(lead, offer) {
  try {
    const model = 'gemini-2.5-flash';
    
    // Create prompt with lead and offer data
    const prompt = `
Product/Offer Details:
Name: ${offer.name}
Value Propositions: ${offer.value_props.join(', ')}
Ideal Use Cases: ${offer.ideal_use_cases.join(', ')}

Lead Details:
Name: ${lead.name}
Role: ${lead.role || 'Not provided'}
Company: ${lead.company || 'Not provided'}
Industry: ${lead.industry || 'Not provided'}
Location: ${lead.location || 'Not provided'}
LinkedIn Bio: ${lead.linkedin_bio || 'Not provided'}

Based on this information, classify the lead's buying intent and provide reasoning.
`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Collect the response text
    let responseText = '';
    for await (const chunk of response) {
      responseText += chunk.text;
    }

    function cleanGeminiResponse(responseText) {
      // Remove code block markers and whitespace
      return responseText
        .replace(/```json\s*/g, '')
        .replace(/```/g, '')
        .trim();
    }

    const cleaned = cleanGeminiResponse(responseText);
    console.log('Raw Gemini AI response:', responseText);
    console.log('Cleaned Gemini AI response:', cleaned);

    // Parse JSON response
    const aiResult = JSON.parse(cleaned);
    console.log('Gemini AI result:', aiResult);
    
    // Map intent to score
    let aiScore = 10; // Default Low
    if (aiResult.intent === 'High') {
      aiScore = 50;
    } else if (aiResult.intent === 'Medium') {
      aiScore = 30;
    }

    return {
      intent: aiResult.intent,
      reasoning: aiResult.reasoning,
      score: aiScore
    };

  } catch (error) {
    console.error('Gemini AI error:', error);
    
    // Fallback if AI fails
    return {
      intent: 'Medium',
      reasoning: 'AI service unavailable, used fallback scoring',
      score: 25
    };
  }
}

module.exports = {
  scoreLeadWithAI
};