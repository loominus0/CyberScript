
import { GoogleGenAI, Type } from "@google/genai";
import { AttackScenario, AttackStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are CyberScript, an AI-driven cybersecurity attack storyboard generator. 
Your task is to transform a target organization description into a structured, realistic, fictional cyber attack scenario.

Your output MUST ONLY follow this exact structure and contain no other sections or conversational filler:
1. OVERVIEW: High-level executive summary.
2. ATTACK STORYBOARD (PHASED): Sequential attack steps.
3. SAMPLE LOGS: Technical log telemetry.
4. ATTACK FLOW DIAGRAM (TEXT): Text-based killchain flow.
5. MITIGATION & LESSONS: Tactical mitigations and learning points.

STRICT CONSTRAINTS:
- DO NOT include 'Defense Strategy' sections within the attack steps.
- DO NOT include 'Student Learning Objectives' or extraneous educational boxes.
- DO NOT add conversational preamble or concluding remarks.
- Follow the provided JSON schema exactly.`;

export const generateAttackScenario = async (
  complexity: string,
  customPrompt?: string
): Promise<AttackScenario> => {
  const model = 'gemini-3-flash-preview';
  
  const userPrompt = `Generate a CyberScript attack storyboard for:
Target Description: ${customPrompt || 'A generic enterprise environment'}
Difficulty Level: ${complexity}

Ensure you strictly follow the 5-part structure defined in the system instructions.`;

  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          threatActor: { type: Type.STRING, description: "Threat actor type" },
          attackVector: { type: Type.STRING, description: "Main vector/Title" },
          summary: { type: Type.STRING, description: "OVERVIEW section content" },
          steps: {
            type: Type.ARRAY,
            description: "ATTACK STORYBOARD section (Phased steps)",
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                mitreTechnique: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
              },
              required: ["phase", "title", "description", "mitreTechnique", "visualPrompt"]
            }
          },
          sampleLogs: { type: Type.STRING, description: "SAMPLE LOGS section content" },
          attackFlowDiagram: { type: Type.STRING, description: "ATTACK FLOW DIAGRAM section content" },
          mitigationLessons: { type: Type.STRING, description: "MITIGATION & LESSONS section content" }
        },
        required: ["threatActor", "attackVector", "summary", "steps", "sampleLogs", "attackFlowDiagram", "mitigationLessons"]
      }
    }
  });

  const rawData = JSON.parse(response.text || '{}');
  
  return {
    id: crypto.randomUUID(),
    attackVector: rawData.attackVector,
    threatActor: rawData.threatActor,
    summary: rawData.summary,
    sampleLogs: rawData.sampleLogs,
    attackFlowDiagram: rawData.attackFlowDiagram,
    mitigationLessons: rawData.mitigationLessons,
    timestamp: Date.now(),
    steps: rawData.steps.map((step: any) => ({
      ...step,
      id: crypto.randomUUID(),
      imageUrl: undefined,
      isLoadingImage: false
    }))
  };
};

export const generateStepImage = async (visualPrompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: `High quality, cinematic digital art, moody lighting, cybersecurity thriller aesthetic, professional training illustration: ${visualPrompt}` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Failed to generate image");
};
