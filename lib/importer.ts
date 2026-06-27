import type { ImportPayload } from "./types";

export function parseImportText(input: string): ImportPayload {
  const trimmed = input.trim();
  if (!trimmed) return { vocabulary: [], grammar: [] };

  try {
    const parsed = JSON.parse(trimmed);
    return {
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      grammar: Array.isArray(parsed.grammar) ? parsed.grammar : []
    };
  } catch {
    return parseMarkdownLike(trimmed);
  }
}

function parseMarkdownLike(input: string): ImportPayload {
  const vocabulary: ImportPayload["vocabulary"] = [];
  const grammar: ImportPayload["grammar"] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const vocabMatch = line.match(/^[-*]?\s*([^:=]+)\s*[:=]\s*(.+)$/);
    if (vocabMatch) {
      vocabulary.push({
        korean: vocabMatch[1].trim(),
        meaning: vocabMatch[2].trim(),
        chapters: [],
        source: "匯入"
      });
      continue;
    }

    const grammarMatch = line.match(/^pattern\s*[:=]\s*(.+)$/i);
    if (grammarMatch) {
      grammar.push({
        pattern: grammarMatch[1].trim(),
        meaning_zh: "",
        chapters: [],
        source: "匯入"
      });
    }
  }

  return { vocabulary, grammar };
}

export function findVocabularyDuplicates(existing: { korean: string; meaning: string }[], incoming: ImportPayload["vocabulary"]) {
  return incoming.map((item) => ({
    item,
    duplicate: existing.find((existingItem) => existingItem.korean === item.korean),
    sameMeaning: existing.some((existingItem) => existingItem.korean === item.korean && existingItem.meaning === item.meaning)
  }));
}

export function findGrammarDuplicates(existing: { pattern: string }[], incoming: ImportPayload["grammar"]) {
  return incoming.map((item) => ({
    item,
    duplicate: existing.find((existingItem) => existingItem.pattern === item.pattern)
  }));
}
