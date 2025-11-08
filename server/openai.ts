// OpenAI integration - javascript_openai blueprint
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeMood(text: string): Promise<{
  mood: "positive" | "neutral" | "negative";
  analysis: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Você é um assistente empático de saúde mental. Analise o texto do diário emocional do usuário e:
1. Determine o humor geral: "positive" (positivo), "neutral" (neutro) ou "negative" (negativo)
2. Forneça uma resposta empática e encorajadora em português (máximo 2-3 frases)

Responda em JSON com este formato exato: { "mood": "positive|neutral|negative", "analysis": "sua resposta empática" }`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      mood: result.mood || "neutral",
      analysis: result.analysis || "Continue escrevendo e acompanhando suas emoções. Você está no caminho certo.",
    };
  } catch (error) {
    console.error("Error analyzing mood:", error);
    throw new Error("Failed to analyze mood");
  }
}
