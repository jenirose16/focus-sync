const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const EMBEDDING_MODEL = 'gemini-embed-1';
const GENERATIVE_MODEL = 'gemini-1.5-flash';
const TOP_K_CHUNKS = 4;
const CHUNK_SIZE = 700;

function chunkText(text) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const word of words) {
    current.push(word);
    currentLength += word.length + 1;
    if (currentLength > CHUNK_SIZE) {
      chunks.push(current.join(' '));
      current = [];
      currentLength = 0;
    }
  }

  if (current.length) {
    chunks.push(current.join(' '));
  }

  return chunks.map((text, index) => ({ id: index, text }));
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return magA === 0 || magB === 0 ? 0 : dot / (magA * magB);
}

async function embedText(text) {
  const model = genAI.getEmbeddingModel({ model: EMBEDDING_MODEL });
  const embeddingResponse = await (typeof model.embedText === 'function'
    ? model.embedText(text)
    : model.embed
      ? model.embed({ input: text })
      : Promise.reject(new Error('Embedding API not available')));

  const embedding = embeddingResponse?.data?.[0]?.embedding
    || embeddingResponse?.embedding
    || (Array.isArray(embeddingResponse) && embeddingResponse[0]?.embedding);

  if (!Array.isArray(embedding)) {
    throw new Error('Invalid embedding response from Gemini Embeddings.');
  }

  return embedding;
}

async function retrieveTopChunks(content, chunks, topK = TOP_K_CHUNKS) {
  const queryEmbedding = await embedText(content.slice(0, 1500));
  const chunkEmbeddings = await Promise.all(chunks.map(async (chunk) => ({
    ...chunk,
    embedding: await embedText(chunk.text)
  })));

  return chunkEmbeddings
    .map((chunk) => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.text);
}

async function generateQuiz(content) {
  try {
    const cleanedContent = content.trim();
    const chunks = chunkText(cleanedContent);
    const retrievedChunks = await retrieveTopChunks(cleanedContent, chunks, TOP_K_CHUNKS);
    const groundedContext = retrievedChunks.join('\n\n');

    const model = genAI.getGenerativeModel({ model: GENERATIVE_MODEL });
    const prompt = `CONTEXT MATERIAL:\n${groundedContext}\n\n` +
      `Generate exactly 10 multiple-choice questions using ONLY the information above. ` +
      `Do not use any knowledge outside the provided content. ` +
      `Each question must include 4 answer options, one correct answer, and a clear explanation grounded in the content. ` +
      `Return only a valid JSON array with objects containing {"question", "options", "answer", "explanation"}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('AI failed to return a valid JSON array.');
    }

    const cleanJson = rawText.substring(startIdx, endIdx + 1);
    const parsedQuiz = JSON.parse(cleanJson);

    console.log(`✅ Success: Generated ${parsedQuiz.length} questions from retrieved content.`);
    return parsedQuiz;
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    return getSystemFallback();
  }
}

function getSystemFallback() {
  return [
    {
      question: 'What is the primary goal of FocusSync?',
      options: ['To help students focus better', 'To waste time', 'To distract users', 'To test AI'],
      answer: 'To help students focus better',
      explanation: 'FocusSync is designed to improve productivity and keep learners focused.'
    },
    {
      question: 'What does RAG stand for in a quiz generation workflow?',
      options: ['Random Answer Generation', 'Retrieval-Augmented Generation', 'Rapid AI Growth', 'Ranking And Grading'],
      answer: 'Retrieval-Augmented Generation',
      explanation: 'RAG combines retrieval of relevant content with generation to ensure grounded outputs.'
    },
    {
      question: 'Why is grounding important for AI-generated quizzes?',
      options: ['So the quiz is more creative', 'So the quiz uses current memes', 'So the quiz stays factually tied to the source', 'So the quiz is shorter'],
      answer: 'So the quiz stays factually tied to the source',
      explanation: 'Grounding eliminates hallucinations by using only provided source material.'
    }
  ];
}

module.exports = { generateQuiz };