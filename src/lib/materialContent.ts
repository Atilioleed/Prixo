// Structured bilingual content for a learning material — every English term
// or phrase carries its Spanish meaning and a bilingual example, so a
// student never hits raw English with no explanation. Stored as
// JSON.stringify(MaterialContent) in learningMaterials.content (see
// src/db/schema.ts) — a plain text column, so legacy materials whose
// content is still freeform markdown keep working: isStructuredContent()
// below is how callers tell the two apart.

export interface VocabItem {
  term: string; // English word or short phrase
  pronunciation: string; // simplified phonetic guide, e.g. "GRO-suh-reez"
  meaning: string; // Spanish
  example: string; // English example sentence
  exampleEs: string; // Spanish translation of the example
}

export interface PhraseItem {
  phrase: string; // English
  meaning: string; // Spanish translation
}

export interface MaterialSection {
  heading: string;
  vocab?: VocabItem[];
  phrases?: PhraseItem[];
  note?: string; // free-text explanation in Spanish (grammar tip, usage note, etc.)
}

export interface MaterialContent {
  intro: string; // Spanish, explains what this document covers
  sections: MaterialSection[];
  practice: string; // Spanish practice prompt
}

export function isStructuredContent(value: unknown): value is MaterialContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.intro === "string" && Array.isArray(v.sections);
}

/** Safe parse — returns null for legacy markdown content instead of throwing. */
export function parseMaterialContent(raw: string): MaterialContent | null {
  try {
    const parsed = JSON.parse(raw);
    return isStructuredContent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
