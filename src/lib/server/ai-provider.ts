import { z } from "zod";
import type { ModelRunProvenance } from "@/lib/types";

type InferenceMode = "public" | "sensitive";

export type StructuredRequest<T> = {
  mode: InferenceMode;
  profile: string;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  maxTokens?: number;
};

export type StructuredResult<T> =
  | { ok: true; value: T; provenance: ModelRunProvenance }
  | { ok: false; reason: string };

export type AIProvider = {
  health: (mode: InferenceMode) => Promise<{ available: boolean; provider?: "freellmapi" | "production"; detail: string }>;
  runStructured: <T>(request: StructuredRequest<T>) => Promise<StructuredResult<T>>;
  embed: (mode: InferenceMode, input: string[]) => Promise<number[][] | null>;
};

type Endpoint = { baseUrl: string; apiKey: string; provider: "freellmapi" | "production" };

function endpointFor(mode: InferenceMode): Endpoint | null {
  if (mode === "sensitive") {
    const baseUrl = process.env.PROPGROK_PRODUCTION_AI_BASE_URL;
    const apiKey = process.env.PROPGROK_PRODUCTION_AI_API_KEY;
    return baseUrl && apiKey ? { baseUrl, apiKey, provider: "production" } : null;
  }

  const baseUrl = process.env.FREELLMAPI_BASE_URL;
  const apiKey = process.env.FREELLMAPI_API_KEY;
  return baseUrl && apiKey ? { baseUrl, apiKey, provider: "freellmapi" } : null;
}

function apiUrl(endpoint: Endpoint, path: string) {
  return new URL(path.replace(/^\//, ""), `${endpoint.baseUrl.replace(/\/?$/, "/")}`).toString();
}

function parseJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Provider returned a non-JSON response.");
    return JSON.parse(match[0]);
  }
}

export const aiProvider: AIProvider = {
  async health(mode) {
    const endpoint = endpointFor(mode);
    if (!endpoint) {
      return {
        available: false,
        detail:
          mode === "sensitive"
            ? "No approved production AI provider is configured for sensitive material."
            : "FreeLLMAPI is not configured for public-data analysis.",
      };
    }
    try {
      const response = await fetch(apiUrl(endpoint, "models"), {
        headers: { Authorization: `Bearer ${endpoint.apiKey}` },
        signal: AbortSignal.timeout(4_000),
      });
      return {
        available: response.ok,
        provider: endpoint.provider,
        detail: response.ok ? "Provider is available." : `Provider health check returned ${response.status}.`,
      };
    } catch {
      return { available: false, provider: endpoint.provider, detail: "Provider health check timed out or failed." };
    }
  },

  async runStructured<T>(request: StructuredRequest<T>): Promise<StructuredResult<T>> {
    const endpoint = endpointFor(request.mode);
    if (!endpoint) {
      return {
        ok: false,
        reason:
          request.mode === "sensitive"
            ? "Sensitive material requires an approved production provider."
            : "FreeLLMAPI is not configured; the evidence-only memo is still available.",
      };
    }
    try {
      const response = await fetch(apiUrl(endpoint, "chat/completions"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${endpoint.apiKey}` },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          model: `auto:${request.profile}`,
          temperature: 0.2,
          max_tokens: request.maxTokens ?? 900,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: request.system },
            { role: "user", content: request.prompt },
          ],
        }),
      });
      if (!response.ok) return { ok: false, reason: `AI provider returned ${response.status}.` };
      const body = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
        model?: string;
      };
      const content = body.choices?.[0]?.message?.content;
      if (!content) return { ok: false, reason: "AI provider returned no completion." };
      return {
        ok: true,
        value: request.schema.parse(parseJson(content)),
        provenance: {
          provider: endpoint.provider,
          model: body.model ?? `auto:${request.profile}`,
          profile: request.profile,
          completedAt: new Date().toISOString(),
          mode: request.mode,
        },
      };
    } catch (error) {
      return { ok: false, reason: error instanceof Error ? error.message : "AI provider request failed." };
    }
  },

  async embed(mode, input) {
    const endpoint = endpointFor(mode);
    if (!endpoint || input.length === 0) return null;
    try {
      const response = await fetch(apiUrl(endpoint, "embeddings"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${endpoint.apiKey}` },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ model: "auto:embedding", input }),
      });
      if (!response.ok) return null;
      const body = (await response.json()) as { data?: { embedding?: number[] }[] };
      const embeddings = body.data?.map((item) => item.embedding).filter((item): item is number[] => Array.isArray(item));
      return embeddings?.length === input.length ? embeddings : null;
    } catch {
      return null;
    }
  },
};
