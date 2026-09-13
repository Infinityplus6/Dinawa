import { useState } from "react";
import { extractText } from "./extractText.js";
import { translate } from "./Translate.js";
import { cleanTranslation } from "./gemini.js";

export default function UploadFile({
  onWordExtracted,
  onCardCreated,
}) {
  const [image, setImage] = useState(null);
  const [geminiResult, setGeminiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setGeminiResult(null);
    setError(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      // STEP 1: OCR
      const extracted = await extractText(
        file,
        setProgress
      );

      if (!extracted) {
        setError(
          "Couldn't find readable text in this image."
        );
        return;
      }

      console.log("OCR TEXT:", extracted);

      // STEP 2: Dictionary lookup
      const translated = await translate(extracted);

      if (
        !translated ||
        translated === "No translation found."
      ) {
        setError(
          "Couldn't find a dictionary translation."
        );
        return;
      }

      console.log(
        "DICTIONARY RESULT:",
        translated
      );

      // STEP 3: Gemini cleanup
      const cleaned = await cleanTranslation(
        extracted,
        translated
      );

      console.log(
        "GEMINI RESULT:",
        cleaned
      );

      // STEP 4: Display Gemini result
      setGeminiResult(cleaned);

      // STEP 5: Create flashcard
      const flashcard = {
        id: Date.now(),

        ojibwe_word:
          cleaned.ojibwe_word,

        english_translation:
          cleaned.english_translation,

        context:
          cleaned.context,

        image: imageUrl,
      };

      onCardCreated?.(flashcard);

      // Pass extracted text to parent if needed
      onWordExtracted?.(extracted);

    } catch (err) {
      console.error(
        "Error processing image:",
        err
      );

      setError(
        err?.message ||
        "Couldn't read, translate, or process this image."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="uploadFileField">

      <div className="title">
        <h1>
          Dinawa
        </h1>
      </div>
      <p className="subtitle">Teaching Ojibwe Language History</p>

      <label>
        Upload an image

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>

      {image && (
        <div>
          <h2>Preview</h2>

          <img
            src={image}
            alt="Uploaded"
            style={{
              maxWidth: "500px",
              maxHeight: "500px",
            }}
          />
        </div>
      )}

      {isProcessing && (
        <p>
          Processing… {progress}%
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {geminiResult && (
        <div className="results">

          <h2>Ojibwe</h2>
          <p>
            {geminiResult.ojibwe_word}
          </p>

          <h2>English Translation</h2>
          <p>
            {geminiResult.english_translation}
          </p>

          <h2>Context</h2>
          <p>
            {geminiResult.context}
          </p>

        </div>
      )}

    </div>
  );
}