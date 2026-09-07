import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

dotenv.config();

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export async function generateStructuredLLMOutput<T>(
  request: LLMRequest,
  parser: (json: any) => T,
  fallbackGenerator: () => T
): Promise<{ data: T; providerUsed: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try Gemini if configured
  if (geminiKey && geminiKey.trim().length > 5) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`${request.systemPrompt}\n\n${request.userPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON.`);
      const text = result.response.text() || '';
      const cleanedText = cleanJsonString(text);
      const parsedJson = JSON.parse(cleanedText);
      return { data: parser(parsedJson), providerUsed: 'Google Gemini 1.5 Flash' };
    } catch (err) {
      console.warn('Gemini API call failed, trying fallback:', err);
    }
  }

  // 2. Try OpenAI if configured
  if (openaiKey && openaiKey.trim().length > 5) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: `${request.userPrompt}\n\nRespond ONLY with valid JSON.` },
        ],
        temperature: request.temperature ?? 0.2,
        response_format: { type: 'json_object' },
      });

      const text = completion.choices[0]?.message?.content || '{}';
      const parsedJson = JSON.parse(cleanJsonString(text));
      return { data: parser(parsedJson), providerUsed: 'OpenAI GPT-4o-mini' };
    } catch (err) {
      console.warn('OpenAI API call failed, using Smart Fallback Engine:', err);
    }
  }

  // 3. High-precision local fallback engine for offline development & hackathon demo mode
  return {
    data: fallbackGenerator(),
    providerUsed: 'Smart Fallback Engine (Demo Mode)',
  };
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}
