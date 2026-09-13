import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const resultSchema = {
  type: Type.OBJECT,
  properties: {
    ojibwe_word: {
      type: Type.STRING,
      description:
        "The cleaned Ojibwe word or phrase from the OCR.",
    },

    english_translation: {
      type: Type.STRING,
      description:
        "One concise English word or short English phrase.",
    },

    context: {
      type: Type.STRING,
      description:
        "One educational paragraph explaining the meaning, usage, cultural importance, and relevant history of the Ojibwe word or phrase.",
    },
  },

  required: [
    "ojibwe_word",
    "english_translation",
    "context",
  ],
};

export async function cleanTranslation(
  originalText,
  dictionaryTranslation
) {
  console.log("=== GEMINI START ===");
  console.log("Original OCR:", originalText);
  console.log("Dictionary:", dictionaryTranslation);

  if (!originalText || !dictionaryTranslation) {
    throw new Error(
      "Missing OCR text or dictionary translation."
    );
  }

  const prompt = `
You are an Ojibwe language interpretation assistant.

You are given:

1. Original OCR text from an image
2. Raw results from an Ojibwe dictionary

Your job is to clean and interpret the information.

ORIGINAL OCR TEXT:
${originalText}

RAW DICTIONARY RESULTS:
${dictionaryTranslation}

INSTRUCTIONS:

1. CLEAN THE OJIBWE WORD

Remove:
- obvious OCR mistakes
- duplicated words
- unnecessary punctuation
- dictionary formatting
- redundant text

Keep the actual Ojibwe word or phrase.

Do not unnecessarily change the Ojibwe spelling.

2. GIVE THE BEST ENGLISH TRANSLATION

Use ALL of the dictionary information provided.

There may be many dictionary rows describing the same word.

Use those rows together to determine the most likely meaning.

Return ONLY ONE English word or ONE short English phrase.

Do NOT give multiple possible translations.

Do NOT explain the translation in this field.

3. GIVE EDUCATIONAL CONTEXT

Write ONE paragraph explaining:

- what the word means
- how it can be used
- relevant linguistic information
- relevant cultural significance
- relevant historical context when supported

The goal is to educate someone who has never encountered this Ojibwe word before.

Do NOT invent historical or cultural facts.

If specific historical information is uncertain, focus on the linguistic meaning and known usage.

4. IMPORTANT

The provided dictionary is the primary source for determining the translation.

Do not replace the dictionary meaning with an unrelated guess.

Return the result using the required JSON structure.
`;

  try {
    console.log("Sending prompt to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: resultSchema,
      },
    });

    console.log("Gemini raw response:", response.text);

    const result = JSON.parse(response.text);

    console.log("Gemini parsed result:", result);
    console.log("=== GEMINI END ===");

    return result;

  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw error;
  }
}