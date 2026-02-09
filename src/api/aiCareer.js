/**
 * AI Career Guidance - Gemini API service.
 * Uses VITE_GEMINI_API_KEY (set in .env) for client-side calls.
 * For production, prefer backend proxy to keep API key server-side.
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function getApiKey() {
  return import.meta.env?.VITE_GEMINI_API_KEY || '';
}

const SYSTEM_INSTRUCTION = `You are a world-class Academic and Career Counselor. Your specialty is helping students and professionals navigate life-changing decisions.

Key Directives:
1. FOR STUDENTS (10th/12th): Provide advice on subject streams, specific entrance exams, and university choices.
2. SIMPLICITY: Use clear, simple, and easy-to-understand language. If you use difficult career terms or jargon, explain them simply.
3. DEEP ANALYSIS: Every question you ask must be a direct result of analyzing ALL previous answers. Do not ask generic questions. Drill down into their specific interests or constraints mentioned earlier.
4. FINAL ROADMAP: Must be a step-by-step journey from their current state to their target career peak.

Tone: Professional, empathetic, extremely clear, and encouraging.`;

/**
 * @param {Array<{ role: 'user'|'assistant', content: string }>} history
 * @returns {Promise<string>} next question
 */
export async function getNextQuestion(history) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');

  const contents = history.map((h) => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }],
  }));

  const res = await fetch(
    `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: `${SYSTEM_INSTRUCTION} Carefully analyze the user's last answer and compare it with their initial situation. Ask ONE follow-up question that bridges what they just said with a potential career path. Use very simple language. Avoid complex sentences. Keep the question under 20 words.` }],
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMsg = err?.error?.message || `Gemini API error: ${res.status}`;
    
    // Detect quota exceeded errors
    if (errorMsg.includes('quota') || errorMsg.includes('Quota exceeded') || res.status === 429) {
      const quotaError = new Error('API quota exceeded. Please check your Google Cloud billing and enable the Gemini API. See: https://ai.google.dev/gemini-api/docs/rate-limits');
      quotaError.isQuotaError = true;
      throw quotaError;
    }
    
    throw new Error(errorMsg);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || 'What subjects do you find most interesting in school right now?';
}

/**
 * @param {Array<{ role: 'user'|'assistant', content: string }>} history
 * @returns {Promise<{ roleName: string; estimatedTotalTime: string; difficulty: string; phases: Array<{ title: string; duration: string; description: string; topics: string[]; resources: Array<{ name: string; url: string }>; milestones: string[] }>; careerInsights: { salaryRange: string; demand: string; keySkills: string[] } }>}
 */
export async function generateFinalRoadmap(history) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');

  const conversationString = history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join('\n');

  const prompt = `Based on our full consultation history below, generate a definitive and inspiring Career Roadmap. Return ONLY valid JSON matching this structure (no markdown, no code fence):
{
  "roleName": "string",
  "estimatedTotalTime": "string",
  "difficulty": "string",
  "careerInsights": {
    "salaryRange": "string",
    "demand": "string",
    "keySkills": ["string"]
  },
  "phases": [
    {
      "title": "string",
      "duration": "string",
      "description": "string",
      "topics": ["string"],
      "resources": [{"name": "string", "url": "string"}],
      "milestones": ["string"]
    }
  ]
}

CONSULTATION DATA:
${conversationString}

Use simple words. If they are in 10th/12th, include the immediate education steps. Provide realistic salary expectations and market trends.`;

  const res = await fetch(
    `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMsg = err?.error?.message || `Gemini API error: ${res.status}`;
    
    // Detect quota exceeded errors
    if (errorMsg.includes('quota') || errorMsg.includes('Quota exceeded') || res.status === 429) {
      const quotaError = new Error('API quota exceeded. Please check your Google Cloud billing and enable the Gemini API. See: https://ai.google.dev/gemini-api/docs/rate-limits');
      quotaError.isQuotaError = true;
      throw quotaError;
    }
    
    throw new Error(errorMsg);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!rawText) throw new Error('Failed to generate career roadmap.');

  const cleaned = rawText.replace(/^```json?\s*|\s*```$/g, '').trim();
  return JSON.parse(cleaned);
}
