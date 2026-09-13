let dictionary = null;

// Ultra-permissive normalizer: keeps alphanumerics and apostrophes/glottal stops, strips everything else
function normalizeForLookup(word) {
  if (!word) return "";
  return word
    .toLowerCase()
    .trim()
    .replace(/[=\+\-_~\[\]\(\)\{\}\.,!?;:"']/g, "") // Strip symbols and syntax
    .trim();
}

async function loadDictionary() {
  if (dictionary) {
    // console.log("📂 [Translate.js] Using cached dictionary.");
    return dictionary;
  }

  // console.log("🔄 [Translate.js] Loading dictionary.tsv...");
  const response = await fetch("../dictionary.tsv");

  if (!response.ok) {
    const err = `Failed to load dictionary.tsv. HTTP Status: ${response.status}`;
    // console.error("❌ [Translate.js]", err);
    throw new Error(err);
  }

  const text = await response.text();
  // console.log(`📄 [Translate.js] TSV size: ${text.length} characters.`);

  dictionary = [];
  const lines = text.split(/\r?\n/);
  // console.log(`📑 [Translate.js] Total lines to parse: ${lines.length}`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Split by tabs or 2+ consecutive spaces
    const parts = line.split(/\t+|\s{2,}/);

    let meta = "";
    let rawOjibwe = "";
    let english = "";

    if (parts.length >= 3) {
      meta = parts[0];
      rawOjibwe = parts[1];
      english = parts.slice(2).join(" ");
    } else if (parts.length === 2) {
      // If 1st part looks like meta (e.g. "(vai)"), treat 2nd part as Ojibwe
      if (parts[0].startsWith("(") || parts[0].length <= 5) {
        meta = parts[0];
        rawOjibwe = parts[1];
        english = parts[1];
      } else {
        rawOjibwe = parts[0];
        english = parts[1];
      }
    } else {
      // Single unformatted line fallback
      rawOjibwe = parts[0];
      english = parts[0];
    }

    const cleanKey = normalizeForLookup(rawOjibwe);

    if (cleanKey) {
      dictionary.push({
        lineNum: i + 1,
        meta: meta.trim(),
        ojibwe: rawOjibwe.trim(),
        english: english.trim(),
        cleanOjibwe: cleanKey,
      });
    } else {
      // console.warn(`⚠️ [Translate.js] Couldn't extract clean key from line #${i + 1}: "${line}"`);
    }
  }

  // console.log(`✅ [Translate.js] Loaded ${dictionary.length} / ${lines.length} lines into dictionary.`);
  if (dictionary.length > 0) {
    // console.log("🔍 [Translate.js] Sample parsed entry #1:", dictionary[0]);
  }

  return dictionary;
}

export async function translate(currentText) {
  // console.log("==========================================");
  // console.log("🚀 [Translate.js] Starting translation process...");
  // console.log("📥 [Translate.js] Input OCR text:", currentText);

  if (!currentText || !currentText.trim()) {
    console.log("⚠️ [Translate.js] Input empty. Returning.");
    return "";
  }

  let dict;
  try {
    dict = await loadDictionary();
  } catch (err) {
    console.error("❌ [Translate.js] Error initializing dictionary:", err);
    throw err;
  }

  // Break OCR text into clean tokens
  const words = currentText
    .split(/\s+/)
    .map((token) => normalizeForLookup(token))
    .filter(Boolean);

  // console.log("🎯 [Translate.js] Search tokens:", words);

  const results = [];

  for (const word of words) {
    // console.log(`🔎 [Translate.js] Matching token: "${word}"`);

    // 1. Exact Key Match
    let matches = dict.filter((entry) => entry.cleanOjibwe === word);

    // 2. Loose Permissive Substring Match
    if (matches.length === 0) {
      matches = dict.filter(
        (entry) =>
          entry.cleanOjibwe.length >= 2 &&
          (word.includes(entry.cleanOjibwe) || entry.cleanOjibwe.includes(word))
      );
    }

    // console.log(`📊 [Translate.js] Matches found for "${word}": ${matches.length}`);

    if (matches.length > 0) {
      const definitions = [
        ...new Set(
          matches
            .map((entry) => `${entry.meta ? entry.meta + " " : ""}${entry.english}`)
            .filter(Boolean)
        ),
      ];

      results.push({
        word,
        definitions,
      });
    }
  }

  // console.log("==========================================");
  // console.log("🏁 [Translate.js] Matches complete. Total words matched:", results.length);

  if (results.length === 0) {
    return "No translation found.";
  }

  return results
    .map((res) => `${res.word}:\n  - ${res.definitions.join("\n  - ")}`)
    .join("\n\n");
}