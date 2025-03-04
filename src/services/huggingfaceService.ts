import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face Inference client
// Note: In a production app, you would store this in an environment variable
const HF_API_KEY = ""; // Add your Hugging Face API key here
const hf = new HfInference(HF_API_KEY);

// Using a medical conversation model - this is an example, you can change to a more specific healthcare model
const MODEL_ID = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext";

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // If no API key is provided, return a fallback response
    if (!HF_API_KEY) {
      console.warn("No Hugging Face API key provided. Using fallback response.");
      return getFallbackResponse(prompt);
    }

    // For text generation models
    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: `User: ${prompt}\nAssistant:`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
      }
    });

    return response.generated_text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return getFallbackResponse(prompt);
  }
};

// Fallback responses for when the API is not available or there's an error
const getFallbackResponse = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes("headache")) {
    return "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe or persistent, please consult a healthcare professional.";
  } else if (lowercasePrompt.includes("cold") || lowercasePrompt.includes("flu")) {
    return "Common cold and flu symptoms include fever, cough, sore throat, body aches, and fatigue. Rest, hydration, and over-the-counter medications can help manage symptoms. If symptoms are severe or persist, please consult a healthcare professional.";
  } else if (lowercasePrompt.includes("diet") || lowercasePrompt.includes("nutrition")) {
    return "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to stay hydrated and limit processed foods, added sugars, and excessive salt. For personalized nutrition advice, consider consulting a registered dietitian.";
  } else if (lowercasePrompt.includes("exercise") || lowercasePrompt.includes("workout")) {
    return "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities. Always start gradually and consult a healthcare provider before beginning a new exercise program, especially if you have existing health conditions.";
  } else if (lowercasePrompt.includes("sleep")) {
    return "Adults typically need 7-9 hours of quality sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, avoid caffeine and large meals before sleeping, and stay physically active during the day. If you have persistent sleep problems, consider consulting a healthcare provider.";
  } else {
    return "I'm currently operating in offline mode. For accurate medical advice, please consult with a healthcare professional. Remember that online information should not replace professional medical consultation.";
  }
};