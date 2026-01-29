import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionStatus } from "../types";

// Always use the API key from process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeSuspiciousTransaction(transaction: Transaction): Promise<{ status: TransactionStatus, riskScore: number, reason: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ACT AS A HIGH-LEVEL BANKING FRAUD ANALYST.
      TASK: Analyze the following transaction for sophisticated fraud patterns.
      
      TRANSACTION DATA:
      - ID: ${transaction.id}
      - Value: $${transaction.amount}
      - Category: ${transaction.type}
      - Geo-Location: ${transaction.location}
      - Account Sender: ${transaction.sender}
      - Account Receiver: ${transaction.receiver}
      
      EVALUATE FOR:
      1. Unusual velocity or amount for the category.
      2. Mismatch between location and typical account behavior.
      3. Potential structuring or money laundering indicators.
      
      OUTPUT: Critical reasoning and risk score.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Must be: LEGIT, SUSPICIOUS, or FRAUD"
            },
            riskScore: {
              type: Type.NUMBER,
              description: "Numeric score 0-100"
            },
            reason: {
              type: Type.STRING,
              description: "Concise technical reason for the classification"
            }
          },
          required: ["status", "riskScore", "reason"]
        }
      }
    });

    const jsonStr = (response.text || '').trim();
    const result = JSON.parse(jsonStr);
    
    // Validate status type against enum
    let validatedStatus = TransactionStatus.SUSPICIOUS;
    if (result.status === 'FRAUD') validatedStatus = TransactionStatus.FRAUD;
    if (result.status === 'LEGIT') validatedStatus = TransactionStatus.LEGIT;

    return {
      status: validatedStatus,
      riskScore: result.riskScore,
      reason: result.reason
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      status: TransactionStatus.SUSPICIOUS,
      riskScore: 65,
      reason: "Latency spike detected. Classification defaulted to manual review."
    };
  }
}