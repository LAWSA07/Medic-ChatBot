import { HfInference } from "@huggingface/inference";

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const hf = new HfInference(HF_API_KEY);

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      inputs: `[INST] ${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
        return_full_text: false,
      },
    });
    return response.generated_text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
};
