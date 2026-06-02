import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDeck, GeneratePayload } from "../types";
import { PROMPT_SYSTEM } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateFlashcards(payload: GeneratePayload): Promise<GeneratedDeck> {
  try {
    let contents: any[] = [];
    
    if (payload.type === 'topic') {
      contents = [{ text: `Tema: ${payload.value}. Genera 30 tarjetas de estudio sobre este tema laboral.` }];
    } else if (payload.type === 'text') {
      contents = [{ text: `Texto de referencia:\n${payload.value}\n\nGenera 30 tarjetas de estudio basadas exclusivamente en la información de este texto.` }];
    } else if (payload.type === 'file' && payload.mimeType) {
      contents = [
        {
          inlineData: {
            data: payload.value,
            mimeType: payload.mimeType
          }
        },
        { text: `Analiza el documento adjunto y genera 30 tarjetas de estudio basadas en su contenido.` }
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: PROMPT_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título breve, limpio y representativo del reto." },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  q: { type: Type.STRING, description: "La pregunta de la tarjeta" },
                  a: { type: Type.STRING, description: "La respuesta de la tarjeta" }
                },
                required: ["id", "q", "a"]
              }
            }
          },
          required: ["title", "cards"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No se pudo generar contenido");
    
    const deck = JSON.parse(text) as GeneratedDeck;
    return deck;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
}
