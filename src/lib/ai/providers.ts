import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type AiTier = "free" | "pago";

export interface AiProviderDef {
  id: string;
  label: string;
  tier: AiTier;
  /** Env var holding the API key for this provider. */
  envKey: string;
  /** Env var to override the default model id. */
  modelEnvKey: string;
  defaultModel: string;
  model: (apiKey: string, modelId: string) => LanguageModel;
}

// Order matches the user's requested priority: free providers first, Claude
// as the reliable paid middle tier, OpenRouter/OpenAI as final backups.
export const AI_PROVIDERS: AiProviderDef[] = [
  {
    id: "google",
    label: "Google Gemini",
    tier: "free",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    modelEnvKey: "GOOGLE_MODEL",
    // "-latest" alias so this never goes stale the way a pinned version does.
    defaultModel: "gemini-flash-latest",
    model: (apiKey, modelId) => createGoogleGenerativeAI({ apiKey })(modelId),
  },
  {
    id: "groq",
    label: "Groq",
    tier: "free",
    envKey: "GROQ_API_KEY",
    modelEnvKey: "GROQ_MODEL",
    defaultModel: "openai/gpt-oss-120b",
    model: (apiKey, modelId) => createGroq({ apiKey })(modelId),
  },
  {
    id: "anthropic",
    label: "Claude (Anthropic)",
    tier: "pago",
    envKey: "ANTHROPIC_API_KEY",
    modelEnvKey: "ANTHROPIC_MODEL",
    defaultModel: "claude-sonnet-5",
    model: (apiKey, modelId) => createAnthropic({ apiKey })(modelId),
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    tier: "free",
    envKey: "OPENROUTER_API_KEY",
    modelEnvKey: "OPENROUTER_MODEL",
    // Verified live against OpenRouter's /models endpoint — the old default
    // ("meta-llama/llama-3.1-8b-instruct:free") was retired.
    defaultModel: "openai/gpt-oss-20b:free",
    model: (apiKey, modelId) =>
      createOpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" })(modelId),
  },
  {
    id: "openai",
    label: "OpenAI",
    tier: "pago",
    envKey: "OPENAI_API_KEY",
    modelEnvKey: "OPENAI_MODEL",
    defaultModel: "gpt-4o-mini",
    model: (apiKey, modelId) => createOpenAI({ apiKey })(modelId),
  },
];

const DEFAULT_ORDER = ["google", "groq", "anthropic", "openrouter", "openai"];

/** Priority order of provider ids — overridable via AI_PROVIDER_ORDER (comma-separated). */
export function getProviderOrder(): string[] {
  const raw = process.env.AI_PROVIDER_ORDER;
  if (!raw) return DEFAULT_ORDER;
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter((id) => AI_PROVIDERS.some((p) => p.id === id));
  return ids.length > 0 ? ids : DEFAULT_ORDER;
}

export function providerById(id: string): AiProviderDef | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}

export interface ProviderStatus {
  id: string;
  label: string;
  tier: AiTier;
  priority: number;
  configured: boolean;
  model: string;
}

export function hasAnyProviderConfigured(): boolean {
  return getProviderOrder().some((id) => !!process.env[providerById(id)?.envKey ?? ""]);
}

/** Status of every provider, in priority order, for the admin panel. */
export function getProviderStatuses(): ProviderStatus[] {
  return getProviderOrder().map((id, i) => {
    const def = providerById(id)!;
    const apiKey = process.env[def.envKey];
    return {
      id: def.id,
      label: def.label,
      tier: def.tier,
      priority: i + 1,
      configured: !!apiKey,
      model: process.env[def.modelEnvKey] || def.defaultModel,
    };
  });
}
