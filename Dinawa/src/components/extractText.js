// extractText.js
import Tesseract from "tesseract.js";

export let currentText = "";

function setCurrentText(newText) {
  currentText = newText;
}




export async function extractText(file, onProgress) {
  const result = await Tesseract.recognize(file, "eng", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const rawText = result.data.text.trim();

  setCurrentText(rawText);
  console.log(currentText);
  return rawText;
}