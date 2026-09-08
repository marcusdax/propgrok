//#region node_modules/.nitro/vite/services/ssr/assets/ai-provider-2njZqQPi.js
function endpointFor(mode) {
	if (mode === "sensitive") {
		const baseUrl = process.env.PROPGROK_PRODUCTION_AI_BASE_URL;
		const apiKey = process.env.PROPGROK_PRODUCTION_AI_API_KEY;
		return baseUrl && apiKey ? {
			baseUrl,
			apiKey,
			provider: "production"
		} : null;
	}
	const baseUrl = process.env.FREELLMAPI_BASE_URL;
	const apiKey = process.env.FREELLMAPI_API_KEY;
	return baseUrl && apiKey ? {
		baseUrl,
		apiKey,
		provider: "freellmapi"
	} : null;
}
function apiUrl(endpoint, path) {
	return new URL(path.replace(/^\//, ""), `${endpoint.baseUrl.replace(/\/?$/, "/")}`).toString();
}
function parseJson(text) {
	const trimmed = text.trim();
	try {
		return JSON.parse(trimmed);
	} catch {
		const match = trimmed.match(/\{[\s\S]*\}/);
		if (!match) throw new Error("Provider returned a non-JSON response.");
		return JSON.parse(match[0]);
	}
}
var aiProvider = {
	async health(mode) {
		const endpoint = endpointFor(mode);
		if (!endpoint) return {
			available: false,
			detail: mode === "sensitive" ? "No approved production AI provider is configured for sensitive material." : "FreeLLMAPI is not configured for public-data analysis."
		};
		try {
			const response = await fetch(apiUrl(endpoint, "models"), {
				headers: { Authorization: `Bearer ${endpoint.apiKey}` },
				signal: AbortSignal.timeout(4e3)
			});
			return {
				available: response.ok,
				provider: endpoint.provider,
				detail: response.ok ? "Provider is available." : `Provider health check returned ${response.status}.`
			};
		} catch {
			return {
				available: false,
				provider: endpoint.provider,
				detail: "Provider health check timed out or failed."
			};
		}
	},
	async runStructured(request) {
		const endpoint = endpointFor(request.mode);
		if (!endpoint) return {
			ok: false,
			reason: request.mode === "sensitive" ? "Sensitive material requires an approved production provider." : "FreeLLMAPI is not configured; the evidence-only memo is still available."
		};
		try {
			const response = await fetch(apiUrl(endpoint, "chat/completions"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${endpoint.apiKey}`
				},
				signal: AbortSignal.timeout(2e4),
				body: JSON.stringify({
					model: `auto:${request.profile}`,
					temperature: .2,
					max_tokens: request.maxTokens ?? 900,
					response_format: { type: "json_object" },
					messages: [{
						role: "system",
						content: request.system
					}, {
						role: "user",
						content: request.prompt
					}]
				})
			});
			if (!response.ok) return {
				ok: false,
				reason: `AI provider returned ${response.status}.`
			};
			const body = await response.json();
			const content = body.choices?.[0]?.message?.content;
			if (!content) return {
				ok: false,
				reason: "AI provider returned no completion."
			};
			return {
				ok: true,
				value: request.schema.parse(parseJson(content)),
				provenance: {
					provider: endpoint.provider,
					model: body.model ?? `auto:${request.profile}`,
					profile: request.profile,
					completedAt: (/* @__PURE__ */ new Date()).toISOString(),
					mode: request.mode
				}
			};
		} catch (error) {
			return {
				ok: false,
				reason: error instanceof Error ? error.message : "AI provider request failed."
			};
		}
	},
	async embed(mode, input) {
		const endpoint = endpointFor(mode);
		if (!endpoint || input.length === 0) return null;
		try {
			const response = await fetch(apiUrl(endpoint, "embeddings"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${endpoint.apiKey}`
				},
				signal: AbortSignal.timeout(15e3),
				body: JSON.stringify({
					model: "auto:embedding",
					input
				})
			});
			if (!response.ok) return null;
			const embeddings = (await response.json()).data?.map((item) => item.embedding).filter((item) => Array.isArray(item));
			return embeddings?.length === input.length ? embeddings : null;
		} catch {
			return null;
		}
	}
};
//#endregion
export { aiProvider as t };
