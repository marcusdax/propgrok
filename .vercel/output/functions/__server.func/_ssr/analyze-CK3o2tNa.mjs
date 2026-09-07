import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as formatMiles } from "./utils-BOIfZi7B.mjs";
import { t as buildDossier } from "./engine-CkvdWsoW.mjs";
import { a as number, n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-CK3o2tNa.js
function pinSchema(p) {
	return object({
		id: string(),
		label: string(),
		address: string(),
		city: string(),
		state: string(),
		postcode: string(),
		lat: number(),
		lng: number(),
		neighborhood: string().optional(),
		county: string().optional(),
		source: _enum([
			"search",
			"map",
			"geofence",
			"sample"
		])
	}).parse(p);
}
async function grokJson(system, user, maxTokens = 1400) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .3,
			max_tokens: maxTokens,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return null;
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		return JSON.parse(text);
	} catch {
		const m = text.match(/\{[\s\S]*\}/);
		if (!m) return null;
		try {
			return JSON.parse(m[0]);
		} catch {
			return null;
		}
	}
}
var analyzeProperty_createServerFn_handler = createServerRpc({
	id: "cb60ffc417e2f673aac2abf8539118c94ba583d8fa3828887a8028ba38648258",
	name: "analyzeProperty",
	filename: "src/lib/server/analyze.ts"
}, (opts) => analyzeProperty.__executeServer(opts));
var analyzeProperty = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 24)
})).handler(analyzeProperty_createServerFn_handler, async ({ data }) => {
	const dossier = buildDossier(data.pin);
	const nearby = data.amenities.slice(0, 12).map((a) => `${a.name} (${a.kind}, ${formatMiles(a.distanceM)})`).join("; ");
	const json = await grokJson("You are PropertyInsight, a real-estate and renovation strategist for ODASI / VIVELLA. Return JSON only. Be numeric, cited, and conservative. Never invent a specific sold-comp address you cannot know; speak in ranges and neighborhood patterns. Keys: thesis (string), narrative (string, 90-140 words), occupancyNote (string), schoolsNote (string), laborNote (string), zoningNote (string), extraRisks (array of {label, severity: low|moderate|high|critical, detail}), playNotes (object mapping feature id to a 1-sentence local note).", `Parcel: ${data.pin.label}
Coords: ${data.pin.lat}, ${data.pin.lng}
Neighborhood: ${data.pin.neighborhood ?? "unknown"}
Modeled profile: ${JSON.stringify(dossier.profile)}
Valuation: ${JSON.stringify(dossier.valuation)}
DPS: ${dossier.dps.score} ${dossier.dps.tier}
Metro: ${dossier.metro.name} median ${dossier.metro.medianValue} yoy ${dossier.metro.yoyAppreciation}
Top plays: ${dossier.plays.slice(0, 4).map((p) => `${p.id} roi ${p.roiPct} cost ${p.costMid}`).join(", ")}
Nearby: ${nearby || "none returned"}`, 1600);
	if (json) {
		if (typeof json.thesis === "string") dossier.thesis = json.thesis;
		if (typeof json.narrative === "string") dossier.narrative = json.narrative;
		if (typeof json.occupancyNote === "string") dossier.occupancyNote = json.occupancyNote;
		if (Array.isArray(json.extraRisks)) {
			const extra = json.extraRisks;
			dossier.risks = [...dossier.risks, ...extra].slice(0, 8);
		}
		if (json.playNotes && typeof json.playNotes === "object") {
			const notes = json.playNotes;
			dossier.plays = dossier.plays.map((p) => notes[p.id] ? {
				...p,
				narrative: notes[p.id]
			} : p);
		}
		dossier.enriched = true;
		dossier.evidence.sources.push({
			sourceType: "llm",
			sourceId: "grok-4.5",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			meta: { role: "narrative overlay" }
		});
		dossier.evidence.modelVersions.narrative = { version: "grok-4.5" };
	}
	return {
		ok: true,
		dossier
	};
});
var analyzeNeighborhood_createServerFn_handler = createServerRpc({
	id: "f1968ec9ed2448ddbc30f2267e08ba6473adc249a6a7f57593229511d6b085dc",
	name: "analyzeNeighborhood",
	filename: "src/lib/server/analyze.ts"
}, (opts) => analyzeNeighborhood.__executeServer(opts));
var analyzeNeighborhood = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 40)
})).handler(analyzeNeighborhood_createServerFn_handler, async ({ data }) => {
	const counts = /* @__PURE__ */ new Map();
	for (const a of data.amenities) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
	const clusters = [...counts.entries()].map(([kind, count]) => ({
		kind,
		count
	})).sort((a, b) => b.count - a.count).slice(0, 10);
	const schoolCount = data.amenities.filter((a) => /school|kindergarten|university/.test(a.kind)).length;
	const parkCount = data.amenities.filter((a) => /park|playground/.test(a.kind)).length;
	const transitCount = data.amenities.filter((a) => /station|bus_stop|tram/.test(a.kind)).length;
	const walkScore = Math.max(18, Math.min(96, Math.round(32 + data.amenities.length * 1.1 + parkCount * 3 + transitCount * 4)));
	const intel = {
		pin: data.pin,
		summary: `${data.pin.neighborhood || data.pin.city || "This tract"} shows ${data.amenities.length} mapped points of interest within the search radius — ${schoolCount} education, ${parkCount} parks, ${transitCount} transit.`,
		walkScore,
		amenities: data.amenities.slice(0, 40),
		clusters,
		schoolsNote: schoolCount > 0 ? `${schoolCount} education POIs in radius. Treat ratings as a follow-up, not a fact in this pass.` : "No school nodes returned in this radius — widen the geofence or verify district maps.",
		laborNote: "Commute and wage bands are inferred from metro ACS-style benchmarks until a tract overlay is licensed.",
		zoningNote: "Municipal zoning is not parsed live. Flag any planned ADU, short-term rental, or overlay district before bidding.",
		trend: "Use metro appreciation as the prior; parcel-level residuals come from condition, not from this neighborhood layer.",
		enriched: false
	};
	const json = await grokJson("You are a spatial demographer. JSON keys: summary (90-130 words), schoolsNote, laborNote, zoningNote, trend (40-70 words). Be honest about uncertainty. No fake school ratings.", `Location ${data.pin.label} (${data.pin.lat}, ${data.pin.lng}). POI clusters: ${JSON.stringify(clusters)}. WalkScore proxy ${walkScore}.`, 900);
	if (json) {
		if (typeof json.summary === "string") intel.summary = json.summary;
		if (typeof json.schoolsNote === "string") intel.schoolsNote = json.schoolsNote;
		if (typeof json.laborNote === "string") intel.laborNote = json.laborNote;
		if (typeof json.zoningNote === "string") intel.zoningNote = json.zoningNote;
		if (typeof json.trend === "string") intel.trend = json.trend;
		intel.enriched = true;
	}
	return {
		ok: true,
		intel
	};
});
var generateCampaign_createServerFn_handler = createServerRpc({
	id: "ea17c7b19480b7b20f8e9acb28c21eb16498146191b7e49388a282048c4b0ec5",
	name: "generateCampaign",
	filename: "src/lib/server/analyze.ts"
}, (opts) => generateCampaign.__executeServer(opts));
var generateCampaign = createServerFn({ method: "POST" }).validator((input) => ({
	pins: array(any()).max(12).parse(input.pins),
	industry: string().max(80).parse(input.industry || "Garage Doors"),
	neighborhood: string().max(80).parse(input.neighborhood || "the target zone")
})).handler(generateCampaign_createServerFn_handler, async ({ data }) => {
	const fallback = () => data.pins.map((p, i) => ({
		id: p.id || `pg_${i}`,
		address: p.address || p.label,
		headline: `${data.industry} that photographs on ${p.address || "this street"}`,
		summary: `Personalized ${data.industry.toLowerCase()} one-pager for ${p.label} in ${data.neighborhood}. Before/after render, modeled ROI, and a same-week inspect CTA.`,
		cta: "Book a 15-minute site check"
	}));
	const json = await grokJson("Return JSON { items: [{ address, headline, summary, cta }] } — one item per address. Headlines under 10 words, no emoji, contractor-credible.", `Industry: ${data.industry}. Neighborhood: ${data.neighborhood}. Addresses:\n${data.pins.map((p) => p.label).join("\n")}`, 1200);
	if (json && Array.isArray(json.items)) {
		const items = json.items;
		return {
			ok: true,
			pages: data.pins.map((p, i) => ({
				id: p.id,
				address: items[i]?.address || p.address,
				headline: items[i]?.headline || `${data.industry} for ${p.address}`,
				summary: items[i]?.summary || "",
				cta: items[i]?.cta || "Request a site check"
			}))
		};
	}
	return {
		ok: true,
		pages: fallback()
	};
});
//#endregion
export { analyzeNeighborhood_createServerFn_handler, analyzeProperty_createServerFn_handler, generateCampaign_createServerFn_handler };
