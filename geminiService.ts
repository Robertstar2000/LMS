
import { GoogleGenAI, Type } from "@google/genai";

const cleanJsonResponse = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.replace(/```json\s*|```/g, "").trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  cleaned = cleaned.replace(/,(\s*[\]}])/g, "$1");
  return cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ").trim();
};

export const generateFullCourseOutline = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Draft a 20-module industrial curriculum for: "${topic}".
      
      Strict Constraints:
      - 20 modules exactly.
      - FOCUS: Tallman Equipment Co. (P21, DDIN tools, Bradley Machining).
      - FORBIDDEN: Fractional CIO, Polymer Chemistry, Case Studies, Appendices.
      - RIGGING/ROPE SPECIFIC: Absolutely NO mention of electrical, dielectric, or insulation properties. Focus purely on mechanical physics and load handling.
      - CONTENT: High-density mechanical/industrial specifications.
      
      JSON format:
      {
        "title": "Course Title",
        "description": "Summary",
        "modules": [
          {
            "module_title": "Unit name",
            "lessons": [
              { "lesson_title": "Industrial Manual", "lesson_type": "document", "duration": 60 },
              { "lesson_title": "Technical Audit", "lesson_type": "quiz", "duration": 20 }
            ]
          }
        ]
      }`,
      config: {
        systemInstruction: "Lead Industrial Architect for Tallman Equipment. Depth and mechanical precision are the only priorities.",
        responseMimeType: "application/json"
      }
    });
    const cleaned = cleanJsonResponse(response.text || "");
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Outline Exception:", error);
    throw new Error(`Architect failed for "${topic}".`);
  }
};

export const generateLessonDetails = async (courseTitle: string, moduleTitle: string, lessonTitle: string, type: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isQuiz = type === 'quiz';
  
  // Detect if the course is about rigging/rope to apply strict mechanical filtering
  const isRopeCourse = courseTitle.toLowerCase().includes('rope') || courseTitle.toLowerCase().includes('rigging');

  const prompt = isQuiz 
    ? `Create a 15-question advanced technical audit for: "${lessonTitle}". Focus on P21 steps and mechanical tolerances.`
    : `Write an exhaustive 6000-word technical training manual for: "${lessonTitle}". 
       
       STRICTLY FORBIDDEN: Case Studies, Appendices, Polymer Chemistry, CIO Services.
       ${isRopeCourse ? "STRICTLY FORBIDDEN: Any mention of electrical properties, dielectric testing, or conductivity. Focus 100% on mechanical load, friction, and tensile physics." : ""}
       
       Structure: 
       1. Industrial System Architecture
       2. Hardware/Software Integration Specifications
       3. 20-Step Advanced Standard Operating Procedure (Detailed Paragraphs)
       4. Failure Mode and Effects Analysis (FMEA)
       5. ASTM/ANSI/OSHA Regulatory Compliance Matrix
       6. Operational Maintenance & Calibration Intervals
       7. Technical Performance Matrices (Load/Tension/Friction Tables).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "Expert Industrial Technical Writer for Tallman Equipment. 6000+ words of raw data/SOPs required. No case studies. No appendices.",
        responseMimeType: "application/json"
      }
    });
    const cleaned = cleanJsonResponse(response.text || "");
    return JSON.parse(cleaned);
  } catch (error) {
    return isQuiz 
      ? { quiz_questions: [{ question: "System status?", options: ["Valid", "Error", "Retry", "N/A"], correctIndex: 0 }] } 
      : { content: "Technical expansion required. Consult lead engineer for full manual." };
  }
};
