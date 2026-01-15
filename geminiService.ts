import { GoogleGenAI, Type } from "@google/genai";
import { tallmanData } from "./backend-tallman";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utility to handle exponential backoff for API rate limits (429)
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      if (isRateLimit && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

const cleanJsonResponse = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.replace(/```json\s*|```/g, "").trim();
  
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let start = -1;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
  } else {
    start = firstBracket;
  }

  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  let end = -1;
  if (lastBrace !== -1 && lastBrace > lastBracket) {
    end = lastBrace;
  } else {
    end = lastBracket;
  }

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  cleaned = cleaned.replace(/,(\s*[\]}])/g, "$1");
  return cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ").trim();
};

const SYSTEM_CONTEXT = `You are the Lead Industrial Architect for ${tallmanData.company.legal_name}. 
All generation must prioritize:
- ERP Integration: Epicor P21.
- CRM: RubberTree.
- Tooling: DDIN brand.
- Manufacturing: Bradley Machining (CNC).
- Focus: Electrical Transmission/Distribution.
- Hubs: Addison (HQ), Columbus, Lake City.`;

export const generateCourseOutline = async (topic: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Draft an 8-unit technical curriculum outline for: "${topic}". 
        Each unit needs a title and a brief description.
        Return as JSON: { "titles": ["Unit 1", "Unit 2", ...], "descriptions": ["Desc 1", "Desc 2", ...] }`,
        config: {
          systemInstruction: SYSTEM_CONTEXT,
          responseMimeType: "application/json"
        }
      });
      const cleaned = cleanJsonResponse(response.text || "");
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Gemini Outline Error:", error);
      throw error;
    }
  });
};

export const generateUnitContent = async (courseTitle: string, unitTitle: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generate an exhaustive Technical Manual and a 3-question Quiz for: "${courseTitle} - ${unitTitle}".
        
        REQUIREMENTS FOR THE MANUAL:
        - TARGET LENGTH: EXACTLY 4000 words. This must be an extremely deep, instructional dive.
        - FOCUS: The primary content must be highly specific instructional material about the subject defined by the titles: "${courseTitle}" and "${unitTitle}".
        - ENTERPRISE CONTEXT: Use Tallman Equipment Co's specific environment (Epicor P21, RubberTree CRM, DDIN tools, Bradley Machining) for OPERATIONAL CONTEXT (how the work is logged and what tools are used), but DO NOT use it as the primary subject matter of the manual. The primary subject matter is the technical engineering/instructional topic itself.
        - STRUCTURE: Use professional Markdown with a detailed table of contents, theory of operation, comprehensive safety protocols, multi-phase step-by-step SOPs, technical troubleshooting, and regulatory compliance tables.
        - DATA: Provide complex markdown tables for load ratings, voltage thresholds, or mechanical specs.

        REQUIREMENTS FOR THE QUIZ:
        - 3 multiple-choice questions with 4 options each and a correctIndex.
        
        Return JSON: { "content": "Markdown...", "quiz": [{"question": "...", "options": ["...", "..."], "correctIndex": 0}, ...] }`,
        config: {
          systemInstruction: SYSTEM_CONTEXT,
          responseMimeType: "application/json"
        }
      });
      const cleaned = cleanJsonResponse(response.text || "");
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Gemini Content Error:", error);
      throw error; // Re-throw to trigger withRetry logic
    }
  }, 3, 5000); // 5s initial delay for unit content due to 4000-word complexity
};

export const generateCourseThumbnail = async (topic: string) => {
  return withRetry(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A high-end, cinematic industrial photograph for an enterprise training path about: ${topic}. 
              The style should be ultra-modern, featuring precision tools, high-voltage infrastructure, or warehouse automation. 
              Aspect ratio is 16:9. No faces. Focus on equipment and environment.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop`;
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      return `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop`;
    }
  });
};