const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuiz(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // HIGH-PRECISION PROMPT: QUEST Framework for MCQ Generation
    const prompt = `
CONTEXT MATERIAL: "${content}"

QUEST FRAMEWORK INSTRUCTIONS:
- Quality: Generate questions that test deep understanding, not surface-level recall
- Uniqueness: Create original questions not found in standard textbooks
- Effort: Design questions requiring analysis and application of concepts
- Structure: Use clear, unambiguous language with logical question flow
- Transparency: Provide detailed explanations showing reasoning process

TASK: Generate exactly 10 high-quality multiple-choice questions (MCQs) that are STRICTLY based on the CONTEXT MATERIAL above.

CRITICAL REQUIREMENTS:
1. Questions MUST be directly derived from the provided content - no external knowledge
2. Each question should test comprehension of specific concepts from the material
3. Options must be plausible but only one definitively correct based on the content
4. Explanations should reference specific parts of the context material
5. Questions should progress from basic recall to deeper analysis

OUTPUT FORMAT:
Return ONLY a valid JSON array with exactly 10 objects. Each object must have:
- "question": Clear, focused question text
- "options": Array of exactly 4 strings (A, B, C, D format not required)
- "answer": Exact string matching one of the options
- "explanation": Detailed explanation referencing the context material

EXAMPLE STRUCTURE:
[{"question": "What is X according to the material?", "options": ["A", "B", "C", "D"], "answer": "B", "explanation": "The material states..."}]

DO NOT include any text outside the JSON array.`;

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