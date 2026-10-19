import { Request, Response } from 'express';
import { extractLabelFromImage, explainLabelWithAi, isAiConfigured } from './geminiService.ts';
import { generatePredefinedExplanation } from '../utils/nutritionFallback.ts';
import { ExtractedLabelData } from '../types/index.ts';

export function handleAiStatus(req: Request, res: Response) {
  const configured = isAiConfigured();
  return res.json({
    available: configured,
    model: 'gemini-3.8-flash',
    mode: configured ? 'gemini_connected' : 'fallback_reference'
  });
}

export async function handleExtractLabelImage(req: Request, res: Response) {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data was provided in the request.' });
    }

    if (!isAiConfigured()) {
      return res.status(503).json({
        error: 'AI service is not configured. Please use manual label entry or set up an API key.',
        fallbackAvailable: true
      });
    }

    const extracted = await extractLabelFromImage(imageBase64, mimeType || 'image/jpeg');
    return res.json({ success: true, data: extracted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to extract information from the food label photo.';
    return res.status(500).json({ error: message });
  }
}

export async function handleExplainLabel(req: Request, res: Response) {
  try {
    const labelData = req.body?.labelData as ExtractedLabelData;
    if (!labelData) {
      return res.status(400).json({ error: 'Label data is missing from the request.' });
    }

    // Check if AI is configured
    if (isAiConfigured()) {
      try {
        const aiResult = await explainLabelWithAi(labelData);
        return res.json({ success: true, data: aiResult });
      } catch {
        // Fallback gracefully if AI call errors or times out
        const fallbackResult = generatePredefinedExplanation(labelData);
        return res.json({
          success: true,
          data: fallbackResult,
          note: 'AI service was temporarily unavailable; provided standard reference breakdown.'
        });
      }
    } else {
      // Offline / fallback mode
      const fallbackResult = generatePredefinedExplanation(labelData);
      return res.json({ success: true, data: fallbackResult });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate explanation for the food label.';
    return res.status(500).json({ error: message });
  }
}
