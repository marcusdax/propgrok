import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as formatMiles } from "./utils-BOIfZi7B.mjs";
import { t as buildDossier } from "./engine-CkvdWsoW.mjs";
import { t as aiProvider } from "./ai-provider-2njZqQPi.mjs";
import { c as object, f as unknown, l as record, n as any, r as array, s as number, t as _enum, u as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-tnTA7mVB.js
var isK12School = (kind) => /^(school|kindergarten)$/i.test(kind);
var isEducation = (kind) => /^(school|kindergarten|university)$/i.test(kind);
async function fetchCensusProfile(postcode) {
	if (!/^\d{5}$/.test(postcode)) return null;
	const apiKey = process.env.CENSUS_API_KEY;
	if (!apiKey) return null;
	const variables = [
		"NAME",
		"B01003_001E",
		"B19013_001E",
		"B01002_001E",
		"B15003_001E",
		"B15003_022E",
		"B15003_023E",
		"B15003_024E",
		"B15003_025E",
		"B25003_001E",
		"B25003_002E",
		"B25001_001E"
	].join(",");
	const url = new URL("https://api.census.gov/data/2024/acs/acs5");
	url.searchParams.set("get", variables);
	url.searchParams.set("for", `zip code tabulation area:${postcode}`);
	url.searchParams.set("key", apiKey);
	try {
		const response = await fetch(url, { headers: { Accept: "application/json" } });
		if (!response.ok) return null;
		const rows = await response.json();
		const header = rows[0];
		const values = rows[1];
		if (!header || !values) return null;
		const value = (name) => {
			const raw = values[header.indexOf(name)];
			const parsed = Number(raw);
			return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
		};
		const population = value("B01003_001E");
		const medianIncome = value("B19013_001E");
		const medianAge = value("B01002_001E");
		const adults = value("B15003_001E");
		const bachelorPlus = [
			"B15003_022E",
			"B15003_023E",
			"B15003_024E",
			"B15003_025E"
		].map(value).reduce((sum, current) => sum + (current ?? 0), 0);
		const tenureTotal = value("B25003_001E");
		const ownerOccupied = value("B25003_002E");
		return {
			geography: `ZIP ${postcode}`,
			vintage: "ACS 2024 5-year",
			source: "U.S. Census Bureau API",
			population,
			medianIncome,
			medianAge,
			bachelorPlusPct: adults && bachelorPlus != null ? Math.round(bachelorPlus / adults * 1e3) / 10 : null,
			ownerOccupancyPct: tenureTotal && ownerOccupied != null ? Math.round(ownerOccupied / tenureTotal * 1e3) / 10 : null,
			householdSize: null
		};
	} catch {
		return null;
	}
}
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
async function modelJson(system, user, maxTokens = 1400) {
	const result = await aiProvider.runStructured({
		mode: "public",
		profile: "smart",
		system,
		prompt: user,
		maxTokens,
		schema: record(string(), unknown())
	});
	return result.ok ? result.value : null;
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
	const json = await modelJson("You are PropertyInsight, a real-estate and renovation strategist for ODASI / VIVELLA. Return JSON only. Be numeric, cited, and conservative. Never invent a specific sold-comp address you cannot know; speak in ranges and neighborhood patterns. Keys: thesis (string), narrative (string, 90-140 words), occupancyNote (string), schoolsNote (string), laborNote (string), zoningNote (string), extraRisks (array of {label, severity: low|moderate|high|critical, detail}), playNotes (object mapping feature id to a 1-sentence local note).", `Parcel: ${data.pin.label}
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
			sourceId: "routed-model",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			meta: { role: "narrative overlay" }
		});
		dossier.evidence.modelVersions.narrative = { version: "ai-provider/smart" };
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
	const schoolCount = data.amenities.filter((a) => isK12School(a.kind)).length;
	const universityCount = data.amenities.filter((a) => /^university$/i.test(a.kind)).length;
	const parkCount = data.amenities.filter((a) => /park|playground/.test(a.kind)).length;
	const transitCount = data.amenities.filter((a) => /station|bus_stop|tram/.test(a.kind)).length;
	const schoolHighlights = data.amenities.filter((a) => isEducation(a.kind)).sort((a, b) => a.distanceM - b.distanceM).slice(0, 5).map(({ name, kind, distanceM }) => ({
		name,
		kind,
		distanceM
	}));
	const amenityHighlights = data.amenities.filter((a) => !isEducation(a.kind)).sort((a, b) => a.distanceM - b.distanceM).slice(0, 3);
	const amenityDensity = (data.amenities.length / Math.max(.1, Math.PI * (1200 / 1609.344) ** 2)).toFixed(1);
	const walkScore = Math.max(18, Math.min(96, Math.round(32 + data.amenities.length * 1.1 + parkCount * 3 + transitCount * 4)));
	const census = await fetchCensusProfile(data.pin.postcode);
	const intel = {
		pin: data.pin,
		summary: `${data.pin.neighborhood || data.pin.city || "This tract"} shows ${data.amenities.length} mapped points of interest within the search radius — ${schoolCount} schools${universityCount ? ` and ${universityCount} higher-ed` : ""}, ${parkCount} parks, ${transitCount} transit.`,
		walkScore,
		amenities: data.amenities.slice(0, 40),
		clusters,
		schoolHighlights,
		amenityHighlights,
		census,
		demographicHighlights: [
			...census ? [
				{
					label: "ACS population",
					value: census.population?.toLocaleString() ?? "Not available",
					detail: `${census.geography} · ${census.vintage} · ${census.source}.`
				},
				{
					label: "ACS median income",
					value: census.medianIncome != null ? `$${census.medianIncome.toLocaleString()}` : "Not available",
					detail: "ACS household median-income estimate; not a current asking-rent or tenant-income measure."
				},
				{
					label: "Owner occupancy",
					value: census.ownerOccupancyPct != null ? `${census.ownerOccupancyPct}%` : "Not available",
					detail: "Owner-occupied share of occupied housing units in the ZIP geography."
				}
			] : [{
				label: "Census profile",
				value: "Not available",
				detail: "A valid ZIP code was not available or the Census API did not respond."
			}],
			{
				label: "Mapped amenity density",
				value: `${amenityDensity}/sq mi`,
				detail: `Derived from ${data.amenities.length} mapped POIs in the 1,200 m analysis radius; this is a local access proxy, not a Census statistic.`
			},
			{
				label: "Education access",
				value: `${schoolCount} schools${universityCount ? ` · ${universityCount} higher-ed` : ""}`,
				detail: "Counts are mapped POIs, not official enrollment or attendance-boundary data; verify the district before underwriting."
			},
			{
				label: "Recreation access",
				value: `${parkCount} mapped parks`,
				detail: "Park count is based on returned POI categories and should be read as an accessibility signal."
			}
		],
		marketSignals: [
			{
				label: "Walk proxy",
				value: `${walkScore}/100`,
				detail: "Heuristic from mapped POIs, parks, and transit nodes; not an official Walk Score."
			},
			{
				label: "Transit access",
				value: `${transitCount} mapped nodes`,
				detail: transitCount ? "Transit-related POIs were returned in the search radius." : "No transit-related POIs were returned in the search radius."
			},
			{
				label: "Investor posture",
				value: transitCount + parkCount > 0 ? "Amenity-supported" : "Needs verification",
				detail: "Use verified rent, tax, vacancy, school, and zoning data before setting a purchase price."
			}
		],
		dataGaps: [
			census ? "ACS is ZIP-level and does not establish parcel-specific school boundaries, rents, or sale values." : "Census ACS profile unavailable for this pin; confirm the ZIP code and retry.",
			"No live rent, sale, vacancy, tax, or days-on-market dataset is attached to this neighborhood pass.",
			"School ratings and attendance boundaries are not verified from an official provider.",
			"Zoning, short-term-rental, ADU, and incentive eligibility require municipal or county confirmation."
		],
		investorRead: "This is an access-and-context screen, not a valuation. The strongest local signal is the combination of mapped family amenities and nearby services; the next decision should be driven by verified rent, tax, insurance, condition, and comparable-sale evidence.",
		schoolsNote: schoolCount > 0 ? `${schoolCount} school POIs returned in this radius. Ratings and attendance boundaries require official district verification.` : "No mapped school buildings or nodes returned in this radius — widen the radius or verify district maps.",
		laborNote: "Commute and wage bands are inferred from metro ACS-style benchmarks until a tract overlay is licensed.",
		zoningNote: "Municipal zoning is not parsed live. Flag any planned ADU, short-term rental, or overlay district before bidding.",
		trend: "Use metro appreciation as the prior; parcel-level residuals come from condition, not from this neighborhood layer.",
		enriched: false
	};
	const json = await modelJson("You are a spatial demographer. JSON keys: summary (90-130 words), schoolsNote, laborNote, zoningNote, trend (40-70 words). Be honest about uncertainty. No fake school ratings.", `Location ${data.pin.label} (${data.pin.lat}, ${data.pin.lng}). POI clusters: ${JSON.stringify(clusters)}. WalkScore proxy ${walkScore}.`, 900);
	if (json) {
		if (typeof json.summary === "string") intel.summary = json.summary;
		if (typeof json.schoolsNote === "string") intel.schoolsNote = json.schoolsNote;
		if (typeof json.laborNote === "string") intel.laborNote = json.laborNote;
		if (typeof json.zoningNote === "string") intel.zoningNote = json.zoningNote;
		if (typeof json.trend === "string") intel.trend = json.trend;
		if (typeof json.investorRead === "string") intel.investorRead = json.investorRead;
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
	const json = await modelJson("Return JSON { items: [{ address, headline, summary, cta }] } — one item per address. Headlines under 10 words, no emoji, contractor-credible.", `Industry: ${data.industry}. Neighborhood: ${data.neighborhood}. Addresses:\n${data.pins.map((p) => p.label).join("\n")}`, 1200);
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
