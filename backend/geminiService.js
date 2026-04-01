const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuiz(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // STRICT PROMPT: Forces AI to stay on topic (e.g., Apples)
    const prompt = `
      CONTEXT: "${content}"
      TASK: Generate exactly 10 MCQs based strictly on the CONTEXT above.
      
      FORMAT RULES:
      1. Return ONLY a raw JSON array.
      2. No markdown (no \`\`\`json), no preamble.
      3. Fields: "question", "options" (4 items), "answer", "explanation".
      4. Use QUEST Framework (Quality, Uniqueness, Effort, Structure, Transparency).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    // THE CLEANER: Finds the start and end of the JSON array
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("AI failed to provide a valid JSON structure.");
    }

    const cleanJson = rawText.substring(startIdx, endIdx + 1);
    const parsedQuiz = JSON.parse(cleanJson);

    console.log(`✅ Success: Generated ${parsedQuiz.length} questions from user content.`);
    return parsedQuiz;

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    // FAIL-SAFE: If API limits are hit or parsing fails, return the system fallback
    return getSystemFallback();
  }
}

function getSystemFallback() {
  return [
    { 
      question: "What is the primary focus of FocusSync?", 
      options: ["Entertainment", "Productivity", "Gaming", "Social Media"], 
      answer: "Productivity", 
      explanation: "FocusSync is a closed-loop ecosystem designed to maximize academic productivity." 
    },
    // ... (Your other 9 fallback questions here)
  ];
}

module.exports = { generateQuiz };