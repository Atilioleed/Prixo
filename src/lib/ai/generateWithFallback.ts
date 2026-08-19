import { generateText } from "ai";
import { AI_PROVIDERS, getProviderOrder, providerById } from "./providers";

export interface FallbackMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FallbackResult {
  text: string;
  /** Which provider actually served the request — surfaced to the admin panel / logs. */
  provider: string;
}

/**
 * The "super cerebro": tries each configured AI provider in priority order
 * (free providers first, per AI_PROVIDER_ORDER / the default in providers.ts)
 * and falls through to the next one on any failure, so one provider going
 * down or hitting a rate limit never takes the tutor offline.
 */
export async function generateWithFallback(opts: {
  system: string;
  messages: FallbackMessage[];
  maxOutputTokens?: number;
}): Promise<FallbackResult> {
  const attempts: { provider: string; error: string }[] = [];

  for (const id of getProviderOrder()) {
    const def = providerById(id);
    if (!def) continue;
    const apiKey = process.env[def.envKey];
    if (!apiKey) continue;

    try {
      const modelId = process.env[def.modelEnvKey] || def.defaultModel;
      const result = await generateText({
        model: def.model(apiKey, modelId),
        system: opts.system,
        messages: opts.messages,
        maxOutputTokens: opts.maxOutputTokens ?? 1000,
      });
      return { text: result.text, provider: def.id };
    } catch (err) {
      attempts.push({ provider: def.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  if (attempts.length === 0) {
    throw new Error(
      "No hay ningún proveedor de IA configurado en el servidor. Agrega al menos una API key en .env.local: " +
        AI_PROVIDERS.map((p) => p.envKey).join(", ")
    );
  }

  throw new Error(
    "Todos los proveedores de IA configurados fallaron: " +
      attempts.map((a) => `${a.provider} (${a.error})`).join(" · ")
  );
}
