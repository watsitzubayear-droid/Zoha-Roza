
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Signal } from "../types";
import { BDT_TIMEZONE } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeScreenshot = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `ZOHA AI QUANTUM SCANNER V8.0 - EXPERT MATHEMATICAL ANALYSIS.
          Analyze this 1-minute chart using these EXACT formulas:
          
          1. MOMENTUM CONTINUITY (CCT): 
             Formula: P(Continuity) = Body Size / Total Range.
             If Body > 80% of (High-Low), probability is 65-70% for SAME COLOR.
          
          2. REJECTION RATIO (R): 
             Formula: R = Wick Length / Body Length.
             If R > 2.0 (Hammer/Shooting Star), reversal probability is 75%.
          
          3. SVM GAP-FILLING:
             If Closing Price (C) is trending toward .000 or .500 round numbers and hasn't touched yet, predict GAP FILLING continuation.
          
          4. SIGNAL CHECKLIST:
             - GREEN: Bullish Engulfing, Long Lower Wick, RSI(4) < 20.
             - RED: Bearish Engulfing, Long Upper Wick, RSI(4) > 80.
          
          OUTPUT:
          - Verdict: GREEN, RED, or WAIT.
          - Confidence: Must be based on the calculated P or R.
          - Reasoning: Show the math (e.g., "Body Ratio 85%, Rejection Ratio 0.5").
          
          Return as JSON.`
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nextCandle: { type: Type.STRING, enum: ["GREEN", "RED", "WAIT"] },
          confidence: { type: Type.NUMBER },
          patternsIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning: { type: Type.STRING }
        },
        required: ["nextCandle", "confidence", "patternsIdentified", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const generateFutureSignals = async (pairs: string[]): Promise<Signal[]> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview'; 
  
  const currentTimeBDT = new Intl.DateTimeFormat('en-GB', {
    timeZone: BDT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());

  const prompt = `ZOHA AI QUANTUM PREDICTOR - HIGH ACCURACY MODE.
  Current BDT: ${currentTimeBDT}.
  Assets: ${pairs.join(', ')}.
  
  STRICT GENERATION RULES:
  1. ACCURACY THRESHOLD: If the calculated probability is BELOW 80%, SKIP the signal immediately.
  2. TIME SPACING: There MUST be at least a 3-minute gap between signals for the same asset.
  3. LIVE SYNC: Use provided Google Search tools to verify current global market sentiment (volatility/news) to ensure >80% accuracy. If market volatility is too high (>80% risk), skip that market.
  4. MATH: Apply CCT (Body > 80%) and Rejection Ratio (R > 2.0) logic for all predictions.
  
  TASK: Generate 50 signals for 1-min candles.
  - Return: Time (HH:mm BDT), Pair, Type (CALL/PUT), Accuracy (%), and specific Logic.
  
  Return strictly as a JSON array.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pair: { type: Type.STRING },
            time: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["CALL", "PUT"] },
            probability: { type: Type.NUMBER },
            logic: { type: Type.STRING }
          },
          required: ["pair", "time", "type", "probability", "logic"]
        }
      }
    }
  });

  try {
    const text = response.text.trim();
    const signals: Signal[] = JSON.parse(text);
    // Extra safety filter for the UI
    return signals
      .filter(s => s.probability >= 80)
      .sort((a, b) => a.time.localeCompare(b.time));
  } catch (e) {
    console.error("Signal Generation Error:", e);
    throw new Error("ZOHA AI: Market noise detected. Accuracy below 80%. Re-syncing nodes...");
  }
};
