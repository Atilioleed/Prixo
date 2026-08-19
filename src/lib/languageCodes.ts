export interface LanguageOption {
  label: string;
  flag: string;
  code: string;
}

// The 6 target languages Prixo offers today — chosen because every configured
// AI provider (including the smaller free/open models like Groq's Llama and
// OpenRouter's free tier) handles them at native-fluent quality. Widening this
// list to less-resourced languages should wait until that's still true there.
export const LANGUAGES: LanguageOption[] = [
  { label: "Inglés", flag: "🇬🇧", code: "en-US" },
  { label: "Español", flag: "🇪🇸", code: "es-ES" },
  { label: "Francés", flag: "🇫🇷", code: "fr-FR" },
  { label: "Alemán", flag: "🇩🇪", code: "de-DE" },
  { label: "Portugués", flag: "🇵🇹", code: "pt-PT" },
  { label: "Italiano", flag: "🇮🇹", code: "it-IT" },
];

export function langCodeFor(label: string): string {
  return LANGUAGES.find((l) => l.label === label)?.code ?? "en-US";
}
