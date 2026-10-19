import { GoogleGenAI, Type } from '@google/genai';
import { ExtractedLabelData, LabelExplanationResult } from '../types/index.ts';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export function isAiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
}

export async function extractLabelFromImage(
  base64Data: string,
  mimeType: string = 'image/jpeg'
): Promise<ExtractedLabelData> {
  const ai = getAiClient();
  if (!ai) {
    throw new Error('AI service is not configured. Please enter label details manually or check API setup.');
  }

  // Strip data:image/...;base64, prefix if present
  const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

  const prompt = `You are a nutrition label reader. Examine the image carefully.
Extract only the text and values that are actually visible on the packaged food label.
Do NOT invent numbers, percentages, or ingredients that are illegible, cropped, or not present.
If a value is unclear, blurry, or missing from the image, leave that field as an empty string ("").

Return the extracted values in structured JSON matching this schema:
- productName: string (Brand or product name if visible)
- servingSize: string (e.g., "30g (about 15 crackers)" or "1 cup (240ml)")
- calories: string (energy value, e.g., "140 kcal")
- protein: string (e.g., "3g")
- carbs: string (total carbohydrate, e.g., "22g")
- totalSugar: string (e.g., "8g" or "includes 6g added sugars")
- totalFat: string (e.g., "5g")
- saturatedFat: string (e.g., "1.5g")
- sodium: string (e.g., "180mg" or "0.45g salt")
- ingredientList: string (full list of ingredients as printed)
- allergenStatement: string (e.g., "Contains: Wheat, Milk. May contain soy.")
- rawText: string (key visible text segments from the label)
- confidenceNote: string (brief note about image clarity and any illegible sections)`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          servingSize: { type: Type.STRING },
          calories: { type: Type.STRING },
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          totalSugar: { type: Type.STRING },
          totalFat: { type: Type.STRING },
          saturatedFat: { type: Type.STRING },
          sodium: { type: Type.STRING },
          ingredientList: { type: Type.STRING },
          allergenStatement: { type: Type.STRING },
          rawText: { type: Type.STRING },
          confidenceNote: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error('No content returned from AI vision processing.');
  }

  try {
    return JSON.parse(text) as ExtractedLabelData;
  } catch {
    throw new Error('Unable to parse extracted label details.');
  }
}

export async function explainLabelWithAi(
  labelData: ExtractedLabelData
): Promise<LabelExplanationResult> {
  const ai = getAiClient();
  if (!ai) {
    throw new Error('AI service is not configured. Falling back to built-in nutrition reference.');
  }

  const prompt = `You are Nourish AI, a helpful, objective food label explainer for everyday people and families.
Explain the provided food label in simple, clear, neutral English.

User provided information:
Product Name: ${labelData.productName || 'Not specified'}
Serving Size: ${labelData.servingSize || 'Not specified'}
Calories: ${labelData.calories || 'Not specified'}
Protein: ${labelData.protein || 'Not specified'}
Carbohydrates: ${labelData.carbs || 'Not specified'}
Total Sugar: ${labelData.totalSugar || 'Not specified'}
Total Fat: ${labelData.totalFat || 'Not specified'}
Saturated Fat: ${labelData.saturatedFat || 'Not specified'}
Sodium / Salt: ${labelData.sodium || 'Not specified'}
Ingredients: ${labelData.ingredientList || 'Not specified'}
Allergen Statement: ${labelData.allergenStatement || 'Not specified'}
Raw Text / Extra Notes: ${labelData.rawText || 'Not specified'}

CRITICAL GUIDELINES:
1. Do NOT diagnose medical conditions, recommend treatments, or prescribe diets.
2. Do NOT declare this food "universally healthy" or "bad/toxic/poisonous". Maintain a balanced, educational tone.
3. For "allergenInformation", strictly mention allergens that are explicitly listed or declared in the provided text. Explicitly state that a label cannot guarantee absence of other allergens or cross-contamination.
4. For "nutritionBreakdown", explain the supplied numbers in relation to everyday dietary context (e.g. standard 2,000 kcal reference diet, WHO free sugar recommendations <25-50g/day, 2,000mg sodium guidance) without fabricating numbers.
5. For "ingredientGuide", explain complex names (like emulsifiers, stabilizers, preservatives, sweeteners) in simple everyday terms, noting what purpose they serve in packaged food.
6. For "missingInformation", list all important nutrition or ingredient details that were NOT provided or not legible.

Return JSON matching this schema:
- productName: string
- simpleSummary: string (concise plain-English overview of what this product appears to be and its main characteristics)
- nutritionBreakdown: array of { nutrient: string, amount: string, context: string, indicator: "neutral" | "moderate" | "high" }
- ingredientGuide: array of { ingredient: string, explanation: string, purpose: string }
- allergenInformation: { declared: array of strings, crossContaminationRiskNote: string }
- whatToNotice: array of { title: string, observation: string, suggestion: string }
- missingInformation: array of strings
- isAiGenerated: true
- disclaimer: string (clear standard disclaimer: "This explanation is for educational awareness and does not substitute for personalized medical or dietary advice.")`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          simpleSummary: { type: Type.STRING },
          nutritionBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nutrient: { type: Type.STRING },
                amount: { type: Type.STRING },
                context: { type: Type.STRING },
                indicator: { type: Type.STRING }
              },
              required: ['nutrient', 'amount', 'context']
            }
          },
          ingredientGuide: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ingredient: { type: Type.STRING },
                explanation: { type: Type.STRING },
                purpose: { type: Type.STRING }
              },
              required: ['ingredient', 'explanation', 'purpose']
            }
          },
          allergenInformation: {
            type: Type.OBJECT,
            properties: {
              declared: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              crossContaminationRiskNote: { type: Type.STRING }
            },
            required: ['declared', 'crossContaminationRiskNote']
          },
          whatToNotice: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                observation: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              },
              required: ['title', 'observation', 'suggestion']
            }
          },
          missingInformation: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          isAiGenerated: { type: Type.BOOLEAN },
          disclaimer: { type: Type.STRING }
        },
        required: [
          'simpleSummary',
          'nutritionBreakdown',
          'ingredientGuide',
          'allergenInformation',
          'whatToNotice',
          'missingInformation',
          'disclaimer'
        ]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response received from AI model.');
  }

  try {
    const parsed = JSON.parse(text) as LabelExplanationResult;
    parsed.isAiGenerated = true;
    return parsed;
  } catch {
    throw new Error('Failed to parse AI explanation JSON.');
  }
}
