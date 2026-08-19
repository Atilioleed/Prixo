export interface PlacementWord {
  word: string;
  tier: 1 | 2 | 3; // 1 = basic, 2 = intermediate, 3 = advanced
}

// A light, non-diagnostic vocabulary check: the learner taps every word they
// recognize. It's a rough signal for the AI plan-builder, not a real exam.
const BANKS: Record<string, PlacementWord[]> = {
  Inglés: [
    { word: "hello", tier: 1 }, { word: "water", tier: 1 }, { word: "house", tier: 1 },
    { word: "friend", tier: 1 }, { word: "happy", tier: 1 }, { word: "yesterday", tier: 1 },
    { word: "although", tier: 2 }, { word: "achieve", tier: 2 }, { word: "environment", tier: 2 },
    { word: "decision", tier: 2 }, { word: "suggest", tier: 2 }, { word: "improve", tier: 2 },
    { word: "nevertheless", tier: 3 }, { word: "ambiguous", tier: 3 }, { word: "reconcile", tier: 3 },
    { word: "meticulous", tier: 3 }, { word: "unprecedented", tier: 3 }, { word: "paradigm", tier: 3 },
  ],
  Español: [
    { word: "hola", tier: 1 }, { word: "agua", tier: 1 }, { word: "casa", tier: 1 },
    { word: "amigo", tier: 1 }, { word: "feliz", tier: 1 }, { word: "ayer", tier: 1 },
    { word: "aunque", tier: 2 }, { word: "lograr", tier: 2 }, { word: "entorno", tier: 2 },
    { word: "decisión", tier: 2 }, { word: "sugerir", tier: 2 }, { word: "mejorar", tier: 2 },
    { word: "sin embargo", tier: 3 }, { word: "ambiguo", tier: 3 }, { word: "conciliar", tier: 3 },
    { word: "meticuloso", tier: 3 }, { word: "inédito", tier: 3 }, { word: "paradigma", tier: 3 },
  ],
  Francés: [
    { word: "bonjour", tier: 1 }, { word: "eau", tier: 1 }, { word: "maison", tier: 1 },
    { word: "ami", tier: 1 }, { word: "heureux", tier: 1 }, { word: "hier", tier: 1 },
    { word: "bien que", tier: 2 }, { word: "atteindre", tier: 2 }, { word: "environnement", tier: 2 },
    { word: "décision", tier: 2 }, { word: "suggérer", tier: 2 }, { word: "améliorer", tier: 2 },
    { word: "néanmoins", tier: 3 }, { word: "ambigu", tier: 3 }, { word: "concilier", tier: 3 },
    { word: "méticuleux", tier: 3 }, { word: "inédit", tier: 3 }, { word: "paradigme", tier: 3 },
  ],
  Alemán: [
    { word: "hallo", tier: 1 }, { word: "wasser", tier: 1 }, { word: "haus", tier: 1 },
    { word: "freund", tier: 1 }, { word: "glücklich", tier: 1 }, { word: "gestern", tier: 1 },
    { word: "obwohl", tier: 2 }, { word: "erreichen", tier: 2 }, { word: "umgebung", tier: 2 },
    { word: "entscheidung", tier: 2 }, { word: "vorschlagen", tier: 2 }, { word: "verbessern", tier: 2 },
    { word: "dennoch", tier: 3 }, { word: "mehrdeutig", tier: 3 }, { word: "versöhnen", tier: 3 },
    { word: "akribisch", tier: 3 }, { word: "beispiellos", tier: 3 }, { word: "paradigma", tier: 3 },
  ],
  Portugués: [
    { word: "olá", tier: 1 }, { word: "água", tier: 1 }, { word: "casa", tier: 1 },
    { word: "amigo", tier: 1 }, { word: "feliz", tier: 1 }, { word: "ontem", tier: 1 },
    { word: "embora", tier: 2 }, { word: "alcançar", tier: 2 }, { word: "ambiente", tier: 2 },
    { word: "decisão", tier: 2 }, { word: "sugerir", tier: 2 }, { word: "melhorar", tier: 2 },
    { word: "no entanto", tier: 3 }, { word: "ambíguo", tier: 3 }, { word: "conciliar", tier: 3 },
    { word: "meticuloso", tier: 3 }, { word: "inédito", tier: 3 }, { word: "paradigma", tier: 3 },
  ],
  Italiano: [
    { word: "ciao", tier: 1 }, { word: "acqua", tier: 1 }, { word: "casa", tier: 1 },
    { word: "amico", tier: 1 }, { word: "felice", tier: 1 }, { word: "ieri", tier: 1 },
    { word: "sebbene", tier: 2 }, { word: "raggiungere", tier: 2 }, { word: "ambiente", tier: 2 },
    { word: "decisione", tier: 2 }, { word: "suggerire", tier: 2 }, { word: "migliorare", tier: 2 },
    { word: "tuttavia", tier: 3 }, { word: "ambiguo", tier: 3 }, { word: "conciliare", tier: 3 },
    { word: "meticoloso", tier: 3 }, { word: "inedito", tier: 3 }, { word: "paradigma", tier: 3 },
  ],
};

export function placementWordsFor(language: string): PlacementWord[] {
  return BANKS[language] ?? BANKS["Inglés"];
}

/** 0-100 score weighted toward harder tiers, plus a friendly level label. */
export function scorePlacement(words: PlacementWord[], known: Set<string>): { score: number; label: string } {
  const maxScore = words.reduce((s, w) => s + w.tier, 0);
  const got = words.reduce((s, w) => (known.has(w.word) ? s + w.tier : s), 0);
  const score = maxScore > 0 ? Math.round((got / maxScore) * 100) : 0;

  let label = "principiante";
  if (score >= 85) label = "casi nativo";
  else if (score >= 60) label = "avanzado";
  else if (score >= 35) label = "intermedio";
  else if (score >= 15) label = "básico";

  return { score, label };
}
