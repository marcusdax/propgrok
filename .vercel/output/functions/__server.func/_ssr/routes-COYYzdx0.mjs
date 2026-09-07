import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as pct, i as formatMiles, n as cn, r as compactUsd, u as usd } from "./utils-BOIfZi7B.mjs";
import { i as SAMPLES, n as FEATURE_STYLES, t as FEATURES$1 } from "./knowledge-CO2vv4iv.mjs";
import { t as buildDossier } from "./engine-CkvdWsoW.mjs";
import { a as number, n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Compass, i as LoaderCircle, n as Search, o as ChevronDown, r as MapPin, s as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
import { n as Root$1, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root$3 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { n as Root2, r as Trigger, t as List } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-COYYzdx0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComparisonSlider({ before, after, loading }) {
	const [pos, setPos] = (0, import_react.useState)(56);
	const ref = (0, import_react.useRef)(null);
	const move = (clientX) => {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		setPos(Math.max(0, Math.min(100, (clientX - r.left) / r.width * 100)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("relative h-64 w-full overflow-hidden rounded-lg bg-muted md:h-80", after && "cursor-ew-resize touch-none"),
		onMouseDown: (e) => move(e.clientX),
		onMouseMove: (e) => {
			if (e.buttons === 1) move(e.clientX);
		},
		onTouchMove: (e) => {
			if (e.touches[0]) move(e.touches[0].clientX);
		},
		children: [
			!before && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center text-sm text-muted-foreground",
				children: "Upload a facade photo to run Alter"
			}),
			before && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: before,
				alt: "Before",
				className: "absolute inset-0 size-full object-cover"
			}),
			after && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 overflow-hidden",
				style: { clipPath: `inset(0 ${100 - pos}% 0 0)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: after,
					alt: "After render",
					className: "absolute inset-0 size-full object-cover"
				})
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background/50 text-sm text-primary",
				children: "Alter rendering…"
			}),
			before && after && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-0 bottom-0 w-px bg-foreground",
					style: { left: `${pos}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card",
					style: { left: `${pos}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[11px] uppercase tracking-wider",
					children: "Before"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-[11px] uppercase tracking-wider text-primary-foreground",
					children: "Alter"
				})
			] })
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			outline: "border border-border bg-transparent hover:bg-accent",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-md px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-card text-card-foreground shadow-border", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 p-4 pb-2", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-base font-medium tracking-tight", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-4 pt-2", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium uppercase tracking-wider text-muted-foreground", className),
		...props
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-11 w-full items-center justify-between rounded-md border border-input bg-card px-3 text-sm shadow-border focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })
		})]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-border", className),
		position: "popper",
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none data-[highlighted]:bg-accent", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var SAMPLE_PINS = SAMPLES.map((s) => ({
	label: s.label,
	blurb: s.blurb,
	pin: {
		id: `sample_${s.lat}`,
		label: `${s.address}, ${s.city}, ${s.state}`,
		address: s.address,
		city: s.city,
		state: s.state,
		postcode: s.postcode,
		lat: s.lat,
		lng: s.lng,
		neighborhood: s.neighborhood,
		source: "sample"
	}
}));
var memoryStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
var usePropertyStore = create()(persist((set, get) => ({
	selected: null,
	geofenceMode: false,
	geofenceRadiusM: 800,
	zoneHits: [],
	dossier: null,
	dossierStatus: "idle",
	dossierError: null,
	neighborhood: null,
	neighborhoodStatus: "idle",
	amenities: [],
	panelTab: "dossier",
	render: null,
	campaign: [],
	campaignStatus: "idle",
	history: [],
	mapCenter: {
		lat: 32.7555,
		lng: -97.3308,
		zoom: 11
	},
	selectPin: (pin) => {
		set({
			selected: pin,
			history: [pin, ...get().history.filter((h) => h.id !== pin.id)].slice(0, 12),
			mapCenter: {
				lat: pin.lat,
				lng: pin.lng,
				zoom: 16
			},
			dossier: null,
			dossierStatus: "idle",
			dossierError: null,
			neighborhood: null,
			neighborhoodStatus: "idle",
			amenities: [],
			campaign: [],
			panelTab: "dossier"
		});
	},
	clearSelection: () => set({
		selected: null,
		dossier: null,
		dossierStatus: "idle",
		neighborhood: null,
		zoneHits: [],
		render: null
	}),
	setGeofenceMode: (on) => set({ geofenceMode: on }),
	setGeofenceRadius: (m) => set({ geofenceRadiusM: m }),
	setZoneHits: (hits) => set({ zoneHits: hits }),
	setDossier: (d, status = d ? "ready" : "idle", error = null) => set({
		dossier: d,
		dossierStatus: status,
		dossierError: error
	}),
	setNeighborhood: (n, status = n ? "ready" : "idle") => set({
		neighborhood: n,
		neighborhoodStatus: status
	}),
	setAmenities: (a) => set({ amenities: a }),
	setPanelTab: (t) => set({ panelTab: t }),
	setRender: (r) => set({ render: r }),
	patchRender: (p) => {
		const cur = get().render;
		if (!cur) return;
		set({ render: {
			...cur,
			...p
		} });
	},
	setCampaign: (c, status = "ready") => set({
		campaign: c,
		campaignStatus: status
	}),
	setMapCenter: (c) => set({ mapCenter: c })
}), {
	name: "propertyinsight-v1",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage : localStorage),
	partialize: (s) => ({
		history: s.history,
		geofenceRadiusM: s.geofenceRadiusM,
		mapCenter: s.mapCenter
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var FEATURES = [
	"garage_door",
	"roof",
	"windows",
	"siding",
	"paint",
	"landscaping"
];
var composeRender = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().min(1).max(80).parse(input.style),
	imageDataUrl: string().min(32).max(65e5).parse(input.imageDataUrl),
	context: string().max(400).optional().parse(input.context)
})).handler(createSsrRpc("6c31d9013620abc66d8483e7a74ad81a492d23f7d72b3b34f2f50587987fa31d"));
var composeCopy = createServerFn({ method: "POST" }).validator((input) => ({
	feature: _enum(FEATURES).parse(input.feature),
	style: string().parse(input.style),
	address: input.address ? string().max(160).parse(input.address) : void 0,
	roiPct: typeof input.roiPct === "number" ? input.roiPct : void 0
})).handler(createSsrRpc("44a84b2c3e0798b51490767dbf19d3b012f64f7b0318831056f4165a8415cd62"));
async function fileToDataUrl(file) {
	const bmp = await createImageBitmap(file);
	const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
	const w = Math.round(bmp.width * scale);
	const h = Math.round(bmp.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(bmp, 0, 0, w, h);
	return canvas.toDataURL("image/jpeg", .84);
}
function AlterStudio() {
	const dossier = usePropertyStore((s) => s.dossier);
	const selected = usePropertyStore((s) => s.selected);
	const render = usePropertyStore((s) => s.render);
	const setRender = usePropertyStore((s) => s.setRender);
	const patchRender = usePropertyStore((s) => s.patchRender);
	const setPanelTab = usePropertyStore((s) => s.setPanelTab);
	const [feature, setFeature] = (0, import_react.useState)("garage_door");
	const [style, setStyle] = (0, import_react.useState)(FEATURE_STYLES.garage_door[0].id);
	const [notes, setNotes] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const styles = FEATURE_STYLES[feature];
	const play = dossier?.plays.find((p) => p.id === feature);
	const onFeature = (v) => {
		setFeature(v);
		setStyle(FEATURE_STYLES[v][0].id);
	};
	const onFile = async (file) => {
		if (!file) return;
		try {
			const dataUrl = await fileToDataUrl(file);
			setRender({
				feature,
				style,
				prompt: "",
				beforeDataUrl: dataUrl,
				afterDataUrl: null,
				headline: "",
				body: "",
				roiStatement: "",
				status: "idle"
			});
		} catch {
			toast.error("Could not read that image");
		}
	};
	const run = async () => {
		if (!render?.beforeDataUrl) {
			toast.error("Upload a facade photo first");
			return;
		}
		patchRender({
			status: "running",
			error: void 0,
			feature,
			style
		});
		try {
			const [img, copy] = await Promise.all([composeRender({ data: {
				feature,
				style,
				imageDataUrl: render.beforeDataUrl,
				context: [selected?.label, notes].filter(Boolean).join(". ")
			} }), composeCopy({ data: {
				feature,
				style,
				address: selected?.address,
				roiPct: play?.roiPct
			} })]);
			if (!img.ok) {
				patchRender({
					status: "error",
					error: img.error
				});
				toast.error(img.error);
				return;
			}
			patchRender({
				status: "done",
				afterDataUrl: img.afterUrl,
				prompt: img.prompt,
				headline: copy.ok ? copy.headline : "",
				body: copy.ok ? copy.body : "",
				roiStatement: copy.ok ? copy.roiStatement : ""
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Render failed";
			patchRender({
				status: "error",
				error: msg
			});
			toast.error(msg);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Alter Rendering Engine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Photoreal before/after on the actual elevation. Highest-ROI exteriors first — garage, roof, siding, windows, paint."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center",
				onClick: () => inputRef.current?.click(),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					onFile(e.dataTransfer.files[0]);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Drop a street photo or click to upload"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "JPEG or PNG · resized on-device to 1024px"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: "image/*",
						className: "hidden",
						onChange: (e) => void onFile(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Feature" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: feature,
						onValueChange: (v) => onFeature(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FEATURES$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: f.key,
							children: [
								f.label,
								" · ",
								f.roiPct,
								"% ROI"
							]
						}, f.key)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Style" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: style,
						onValueChange: setStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: styles.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.id,
							children: s.label
						}, s.id)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Direction (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: "e.g. keep the existing brick, darker hardware, no cars in frame"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void run(),
				disabled: render?.status === "running" || !render?.beforeDataUrl,
				children: render?.status === "running" ? "Rendering…" : "Generate Alter render"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonSlider, {
				before: render?.beforeDataUrl ?? null,
				after: render?.afterDataUrl ?? null,
				loading: render?.status === "running"
			}),
			play && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Mid cost",
						value: usd(play.costMid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Modeled ROI",
						value: `${play.roiPct.toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
						label: "Value add",
						value: usd(play.valueAdd)
					})
				]
			}),
			(render?.headline || render?.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: render.error ? "Render note" : render.headline }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2 text-sm",
				children: render.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-destructive",
					children: render.error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: render.body }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: render.roiStatement
				})] })
			})] }),
			render?.afterDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => setPanelTab("campaign"),
				children: "Push into a campaign one-pager"
			})
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 tabular text-sm",
			children: value
		})]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-primary bg-foreground shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" })]
	});
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
var analyzeProperty = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 24)
})).handler(createSsrRpc("cb60ffc417e2f673aac2abf8539118c94ba583d8fa3828887a8028ba38648258"));
var analyzeNeighborhood = createServerFn({ method: "POST" }).validator((input) => ({
	pin: pinSchema(input.pin),
	amenities: (input.amenities ?? []).slice(0, 40)
})).handler(createSsrRpc("f1968ec9ed2448ddbc30f2267e08ba6473adc249a6a7f57593229511d6b085dc"));
var generateCampaign = createServerFn({ method: "POST" }).validator((input) => ({
	pins: array(any()).max(12).parse(input.pins),
	industry: string().max(80).parse(input.industry || "Garage Doors"),
	neighborhood: string().max(80).parse(input.neighborhood || "the target zone")
})).handler(createSsrRpc("ea17c7b19480b7b20f8e9acb28c21eb16498146191b7e49388a282048c4b0ec5"));
var searchAddress = createServerFn({ method: "POST" }).validator((input) => {
	return { q: string().trim().min(2).max(180).parse(input.q) };
}).handler(createSsrRpc("b3efc04aff8c4069056ac148ae822f19c19c0cc0728b8876fe34f1aa056b9a21"));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().min(-90).max(90).parse(input.lat),
	lng: number().min(-180).max(180).parse(input.lng)
})).handler(createSsrRpc("6aca30eeffc03e3b8e7fa2fde75f248da391620a2d5de592a10406a13c4305dc"));
var fetchAmenities = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(80).max(4e3).parse(input.radiusM)
})).handler(createSsrRpc("b7bcf0e48cdb6783cd5366ceb0a6db6de6fe672fff6009aa4400afbe69232141"));
var scanGeofence = createServerFn({ method: "POST" }).validator((input) => ({
	lat: number().parse(input.lat),
	lng: number().parse(input.lng),
	radiusM: number().min(120).max(3200).parse(input.radiusM)
})).handler(createSsrRpc("d74fa70d7d149500ae13ad308c37cebb78104aa55f623595be00c7a799f1cb78"));
function CampaignPanel() {
	const selected = usePropertyStore((s) => s.selected);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const setGeofenceMode = usePropertyStore((s) => s.setGeofenceMode);
	const zoneHits = usePropertyStore((s) => s.zoneHits);
	const setZoneHits = usePropertyStore((s) => s.setZoneHits);
	const campaign = usePropertyStore((s) => s.campaign);
	const setCampaign = usePropertyStore((s) => s.setCampaign);
	const campaignStatus = usePropertyStore((s) => s.campaignStatus);
	const dossier = usePropertyStore((s) => s.dossier);
	const [industry, setIndustry] = (0, import_react.useState)("Garage Doors");
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const scan = async () => {
		if (!selected) {
			toast.error("Drop a pin first");
			return;
		}
		setGeofenceMode(true);
		setScanning(true);
		setCampaign([], "loading");
		try {
			const res = await scanGeofence({ data: {
				lat: selected.lat,
				lng: selected.lng,
				radiusM: radius
			} });
			if (!res.ok) toast.error(res.error);
			setZoneHits(res.hits);
			if (res.hits.length === 0) toast.message("No addressed buildings in this radius — widen the fence.");
		} catch {
			toast.error("Geofence scan failed");
		} finally {
			setScanning(false);
		}
	};
	const generate = async () => {
		const pins = zoneHits.length ? zoneHits.slice(0, 10) : selected ? [selected] : [];
		if (pins.length === 0) {
			toast.error("Scan a geofence or select a parcel");
			return;
		}
		setCampaign([], "loading");
		try {
			const res = await generateCampaign({ data: {
				pins,
				industry,
				neighborhood: selected?.neighborhood || selected?.city || "the zone"
			} });
			if (res.ok) {
				const pages = res.pages.map((p, i) => ({
					...p,
					dps: dossier?.dps.score,
					estimate: dossier?.valuation.estimate,
					id: p.id || pins[i]?.id || `pg_${i}`
				}));
				setCampaign(pages, "ready");
			}
		} catch {
			toast.error("Campaign generation failed");
			setCampaign([], "idle");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Campaign geofence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Draw a radius around the pin, harvest addressed buildings from OpenStreetMap, and mint one-pagers for the vertical."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Radius · ", formatMiles(radius)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: geofenceMode ? "visible on map" : "hidden"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 200,
						max: 2400,
						step: 50,
						value: [radius],
						onValueChange: (v) => setRadius(v[0] ?? 800)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setGeofenceMode(!geofenceMode),
							children: geofenceMode ? "Hide fence" : "Show fence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => void scan(),
							disabled: scanning || !selected,
							children: scanning ? "Scanning…" : "Scan zone"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [zoneHits.length, " addressed buildings in the current result set."]
					})
				]
			}),
			zoneHits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Harvest" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-48 space-y-1 overflow-y-auto text-sm",
				children: zoneHits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate text-muted-foreground",
					children: [h.address, h.city ? ` · ${h.city}` : ""]
				}, h.id))
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vertical" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: industry,
					onValueChange: setIndustry,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FEATURES$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: f.label,
						children: f.label
					}, f.key)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void generate(),
				disabled: campaignStatus === "loading",
				children: campaignStatus === "loading" ? "Writing one-pagers…" : "Generate one-pagers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: campaign.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: p.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-lg tracking-tight",
							children: p.headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: p.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-primary",
							children: p.cta
						})
					]
				}, p.id))
			})
		]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
function CommandSearch({ onSelect }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hits, setHits] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const box = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		const onDoc = (e) => {
			if (!box.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	(0, import_react.useEffect)(() => {
		const t = q.trim();
		if (t.length < 3) {
			setHits([]);
			return;
		}
		const handle = window.setTimeout(async () => {
			setLoading(true);
			try {
				const res = await searchAddress({ data: { q: t } });
				if (res.ok) setHits(res.hits);
				else toast.error(res.error);
			} catch {
				toast.error("Address search failed");
			} finally {
				setLoading(false);
			}
		}, 380);
		return () => window.clearTimeout(handle);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		className: "relative w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				ref: inputRef,
				value: q,
				onChange: (e) => {
					setQ(e.target.value);
					setOpen(true);
				},
				onFocus: () => setOpen(true),
				placeholder: "Search an address — street, city, ZIP",
				className: "h-12 rounded-lg border-border bg-background/80 pl-10 pr-12 backdrop-blur-sm",
				"aria-label": "Search address"
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
				className: "absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block",
				children: "/"
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-border",
				children: hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-72 overflow-y-auto py-1",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-accent",
						onClick: () => {
							onSelect(h);
							setQ(h.address);
							setOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm text-foreground",
								children: h.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: [
									h.city,
									h.state,
									h.postcode
								].filter(Boolean).join(", ")
							})]
						})]
					}) }, h.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
						children: "Sample parcels"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-1",
						children: SAMPLE_PINS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-accent"),
							onClick: () => {
								onSelect(s.pin);
								setQ(s.pin.address);
								setOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: s.blurb
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5 text-muted-foreground" })]
						}, s.pin.id))
					})]
				})
			})
		]
	});
}
function BrandMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-8 items-center justify-center rounded-md border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
				className: "size-4 text-primary",
				strokeWidth: 1.6
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[15px] tracking-tight",
				children: "PropertyInsight"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
				children: "VIVELLA · Alter"
			})]
		})]
	});
}
function GeofenceToggle() {
	const on = usePropertyStore((s) => s.geofenceMode);
	const set = usePropertyStore((s) => s.setGeofenceMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: on ? "default" : "outline",
		size: "sm",
		onClick: () => set(!on),
		className: "shrink-0",
		children: ["Geofence ", on ? "on" : "off"]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-transparent bg-primary/15 text-primary",
		outline: "border-border text-muted-foreground",
		warn: "border-transparent bg-warn/15 text-warn",
		danger: "border-transparent bg-destructive/15 text-destructive",
		ok: "border-transparent bg-ok/15 text-ok",
		muted: "border-transparent bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
		className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "h-full bg-primary transition-transform duration-300 ease-out",
			style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
		})
	});
}
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function dpsVariant(tier) {
	if (tier === "CRITICAL" || tier === "HIGH") return "danger";
	if (tier === "MODERATE") return "warn";
	return "ok";
}
function severityVariant(s) {
	if (s === "critical" || s === "high") return "danger";
	if (s === "moderate") return "warn";
	return "ok";
}
function DossierPanel({ dossier, loading, neighborhood }) {
	if (loading && !dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierSkeleton, {});
	if (!dossier) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-start justify-center gap-3 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tracking-tight",
			children: "Scout a parcel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-sm text-muted-foreground",
			children: "Search an address, drop a pin, or load a sample. The dossier models value, condition, storm probability, and the cheapest renovation that photographs."
		})]
	});
	const { valuation, profile, dps, plays, condition } = dossier;
	const condEntries = Object.entries(condition);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: dpsVariant(dps.tier),
								children: [
									"DPS ",
									dps.score,
									" · ",
									dps.tier
								]
							}),
							dossier.enriched ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "ok",
								children: "Grok overlay"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: "Local model"
							}),
							profile.occupancy !== "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: profile.occupancy
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight tracking-tight md:text-3xl",
						children: dossier.pin.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							dossier.pin.neighborhood,
							dossier.pin.city,
							dossier.pin.state,
							dossier.pin.postcode
						].filter(Boolean).join(" · ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-foreground/90",
						children: dossier.thesis
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Modeled value",
						value: compactUsd(valuation.estimate),
						hint: `${compactUsd(valuation.low)}–${compactUsd(valuation.high)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Confidence",
						value: pct(valuation.confidence * 100),
						hint: valuation.method.split("—")[0]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Year / area",
						value: `${profile.yearBuilt}`,
						hint: `${profile.sqft.toLocaleString()} sf · ${profile.beds} bd`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Top play ROI",
						value: pct(plays[0]?.roiPct ?? 0),
						hint: plays[0]?.label
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Condition" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: condEntries.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize text-muted-foreground",
								children: k.replace("_", " ")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-foreground",
								children: [v.score, v.ageYears != null ? ` · ${v.ageYears}y` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: v.score }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: v.note
						})
					]
				}, k))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Renovation ROI matrix" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: plays,
							margin: {
								top: 4,
								right: 4,
								left: -18,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "rgb(236 234 228 / 8%)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fill: "#9c9a92",
										fontSize: 10
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#9c9a92",
										fontSize: 10
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#151613",
										border: "1px solid rgb(236 234 228 / 10%)",
										borderRadius: 8
									},
									formatter: (v) => [`${Number(v).toFixed(1)}%`, "ROI"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "roiPct",
									fill: "#8aa07a",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Play"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Mid cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "ROI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 font-medium",
									children: "Value add"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: plays.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.rank, "."] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: p.demand === "hot" ? "ok" : p.demand === "steady" ? "outline" : "muted",
												children: p.demand
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular py-2",
									children: usd(p.costMid)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "tabular py-2",
									children: [p.roiPct.toFixed(1), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular py-2",
									children: usd(p.valueAdd)
								})
							]
						}, p.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						"Costs scaled by ",
						dossier.metro.name,
						" construction index ",
						dossier.metro.costIndex.toFixed(2),
						". ROI priors from NAR Cost vs. Value, residualized by condition."
					]
				})
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Storm intelligence · Recon DPS" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: dps.action
				}), dps.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									f.name,
									" · ",
									f.weight,
									"%"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular",
								children: f.points
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: f.points }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: f.note
						})
					]
				}, f.name))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Metro path" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: dossier.appreciation,
						margin: {
							top: 8,
							right: 8,
							left: -12,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "rgb(236 234 228 / 8%)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "year",
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "#9c9a92",
									fontSize: 10
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => compactUsd(Number(v))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "#151613",
									border: "1px solid rgb(236 234 228 / 10%)",
									borderRadius: 8
								},
								formatter: (v) => [usd(Number(v)), "Modeled"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "value",
								stroke: "#8aa07a",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					dossier.metro.name,
					" · ",
					dossier.metro.yoyAppreciation.toFixed(1),
					"% modeled CAGR · rent yield ",
					dossier.metro.rentYield.toFixed(1),
					"%"
				]
			})] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investor fit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: dossier.investorFit.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.strategy }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-primary",
								children: f.score
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: f.score,
							className: "mt-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: f.why
						})
					] }, f.strategy))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Demographics" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "grid grid-cols-2 gap-3",
					children: dossier.demographics.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: d.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-sm",
							children: d.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: d.detail
						})
					] }, d.label))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Risks" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: dossier.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: severityVariant(r.severity),
						children: r.severity
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.detail
					})] })]
				}, r.label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Incentives" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: dossier.incentives.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: i.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: i.kind
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: i.valueNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: i.eligibility
					})
				] }, i.name))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Underwriting narrative" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dossier.narrative }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: dossier.occupancyNote
					}),
					neighborhood && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: neighborhood.summary }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: neighborhood.trend
						})
					] })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Evidence chain" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						dossier.evidence.evidenceId,
						" · overall confidence ",
						pct(dossier.evidence.confidence.overall * 100)
					] }),
					dossier.evidence.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						s.sourceType,
						" · ",
						s.sourceId,
						" · ",
						s.timestamp.slice(0, 16).replace("T", " ")
					] }, s.sourceId + s.sourceType)),
					dossier.evidence.assertions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						a.type,
						": ",
						a.value,
						" — ",
						a.explanation
					] }, a.type))
				]
			})] })
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl tabular tracking-tight",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 truncate text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function DossierSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 p-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-2/3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
		]
	});
}
function NeighborhoodPanel({ intel, loading }) {
	if (loading && !intel) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40" })]
	});
	if (!intel) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Select a parcel to load neighborhood intelligence."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Neighborhood"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: intel.pin.neighborhood || intel.pin.city
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: "Walk proxy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular",
						children: intel.walkScore
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed",
				children: intel.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: intel.clusters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: c.kind.replace("_", " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular text-lg",
						children: c.count
					})]
				}, c.kind))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 pt-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intel.schoolsNote }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: intel.laborNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: intel.zoningNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: intel.trend })
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mapped amenities" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm",
				children: [intel.amenities.slice(0, 18).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: [
							a.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["· ", a.kind]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 tabular text-muted-foreground",
						children: [(a.distanceM / 1609.344).toFixed(2), " mi"]
					})]
				}, a.id)), intel.amenities.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted-foreground",
					children: "No POIs returned for this radius."
				})]
			}) })] })
		]
	});
}
function PropertyMap({ onMapClick }) {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const pinRef = (0, import_react.useRef)(null);
	const circleRef = (0, import_react.useRef)(null);
	const zoneRef = (0, import_react.useRef)(null);
	const onClickRef = (0, import_react.useRef)(onMapClick);
	onClickRef.current = onMapClick;
	const selected = usePropertyStore((s) => s.selected);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const zoneHits = usePropertyStore((s) => s.zoneHits);
	const mapCenter = usePropertyStore((s) => s.mapCenter);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (!host.current) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			await Promise.resolve({});
			if (cancelled || !host.current) return;
			const map = L.map(host.current, {
				zoomControl: true,
				attributionControl: true,
				minZoom: 3
			}).setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);
			L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
				attribution: "&copy; OpenStreetMap &copy; CARTO",
				subdomains: "abcd",
				maxZoom: 20
			}).addTo(map);
			map.on("click", (e) => {
				onClickRef.current(e.latlng.lat, e.latlng.lng);
			});
			zoneRef.current = L.layerGroup().addTo(map);
			mapRef.current = map;
		})();
		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		map.flyTo([mapCenter.lat, mapCenter.lng], mapCenter.zoom, { duration: .8 });
	}, [
		mapCenter.lat,
		mapCenter.lng,
		mapCenter.zoom
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			pinRef.current?.remove();
			pinRef.current = null;
			if (!selected) return;
			const icon = L.divIcon({
				className: "pi-pin",
				html: `<div style="width:22px;height:22px;border-radius:999px;background:#8aa07a;border:2px solid #eceae4;box-shadow:0 0 0 6px rgb(138 160 122 / 25%)"></div>`,
				iconSize: [22, 22],
				iconAnchor: [11, 11]
			});
			pinRef.current = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
		})();
	}, [selected]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			circleRef.current?.remove();
			circleRef.current = null;
			if (!geofenceMode || !selected) return;
			circleRef.current = L.circle([selected.lat, selected.lng], {
				radius,
				color: "#8aa07a",
				weight: 1.5,
				fillColor: "#8aa07a",
				fillOpacity: .12
			}).addTo(map);
			circleRef.current.bindTooltip(`${formatMiles(radius)} radius`, { permanent: false });
		})();
	}, [
		geofenceMode,
		radius,
		selected
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		const group = zoneRef.current;
		if (!map || !group) return;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			group.clearLayers();
			const icon = L.divIcon({
				className: "pi-pin",
				html: `<div style="width:10px;height:10px;border-radius:999px;background:#c4b49a;border:1px solid #eceae4"></div>`,
				iconSize: [10, 10],
				iconAnchor: [5, 5]
			});
			for (const h of zoneHits) L.marker([h.lat, h.lng], { icon }).bindTooltip(h.address).addTo(group);
		})();
	}, [zoneHits]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "h-full w-full"
	});
}
function MapHost({ onMapClick }) {
	const selected = usePropertyStore((s) => s.selected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full min-h-[280px] w-full overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyMap, { onMapClick }), !selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-muted-foreground backdrop-blur-sm",
				children: "Click the map to drop a pin, or search an address"
			})
		})]
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$3, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex touch-none select-none p-0.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-border", className),
		...props
	});
}
var STAGES = [
	"Geocoding parcel",
	"Overlaying amenities",
	"Scoring condition",
	"Modeling ROI",
	"Writing evidence"
];
function ScoutWorkspace() {
	const selected = usePropertyStore((s) => s.selected);
	const selectPin = usePropertyStore((s) => s.selectPin);
	const dossier = usePropertyStore((s) => s.dossier);
	const dossierStatus = usePropertyStore((s) => s.dossierStatus);
	const setDossier = usePropertyStore((s) => s.setDossier);
	const neighborhood = usePropertyStore((s) => s.neighborhood);
	const neighborhoodStatus = usePropertyStore((s) => s.neighborhoodStatus);
	const setNeighborhood = usePropertyStore((s) => s.setNeighborhood);
	const setAmenities = usePropertyStore((s) => s.setAmenities);
	const panelTab = usePropertyStore((s) => s.panelTab);
	const setPanelTab = usePropertyStore((s) => s.setPanelTab);
	const geofenceMode = usePropertyStore((s) => s.geofenceMode);
	const radius = usePropertyStore((s) => s.geofenceRadiusM);
	const setRadius = usePropertyStore((s) => s.setGeofenceRadius);
	const history = usePropertyStore((s) => s.history);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [mapReady, setMapReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMapReady(true);
	}, []);
	const runIntel = async (pin) => {
		setDossier(buildDossier(pin), "loading");
		setNeighborhood(null, "loading");
		setStage(0);
		try {
			setStage(1);
			const am = await fetchAmenities({ data: {
				lat: pin.lat,
				lng: pin.lng,
				radiusM: 1200
			} });
			const amenities = am.ok ? am.amenities : [];
			setAmenities(amenities);
			setStage(2);
			const [prop, hood] = await Promise.all([analyzeProperty({ data: {
				pin,
				amenities
			} }), analyzeNeighborhood({ data: {
				pin,
				amenities
			} })]);
			setStage(4);
			if (prop.ok) setDossier(prop.dossier, "ready");
			else setDossier(buildDossier(pin), "ready");
			if (hood.ok) setNeighborhood(hood.intel, "ready");
			else setNeighborhood(null, "idle");
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Analysis failed";
			toast.error(msg);
			setDossier(buildDossier(pin), "ready", msg);
			setNeighborhood(null, "idle");
		}
	};
	const onHit = (hit) => {
		const pin = {
			...hit,
			source: hit.id.startsWith("sample_") ? "sample" : "search"
		};
		selectPin(pin);
		runIntel(pin);
	};
	const onMapClick = async (lat, lng) => {
		try {
			const res = await reverseGeocode({ data: {
				lat,
				lng
			} });
			const pin = {
				...res.ok ? res.hit : {
					id: `pin_${lat}`,
					label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
					address: "Dropped pin",
					city: "",
					state: "",
					postcode: "",
					lat,
					lng
				},
				lat,
				lng,
				source: "map"
			};
			selectPin(pin);
			runIntel(pin);
		} catch {
			toast.error("Reverse geocode failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "z-20 flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSearch, { onSelect: onHit })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeofenceToggle, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative h-[42vh] min-h-[240px] w-full shrink-0 lg:h-auto lg:w-[46%]",
					children: [
						mapReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapHost, { onMapClick }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-muted" }),
						geofenceMode && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-3 right-3 top-3 rounded-lg border border-border bg-background/85 p-3 backdrop-blur-sm lg:right-auto lg:w-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Geofence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: formatMiles(radius)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 200,
								max: 2400,
								step: 50,
								value: [radius],
								onValueChange: (v) => setRadius(v[0] ?? 800)
							})]
						}),
						dossierStatus === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-background/85 px-3 py-2 text-xs backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-primary",
								children: STAGES[Math.min(stage, STAGES.length - 1)]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex min-h-0 flex-1 flex-col border-t border-border lg:border-l lg:border-t-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b border-border px-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
							value: panelTab,
							onValueChange: (v) => setPanelTab(v),
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "w-full justify-start overflow-x-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "dossier",
										children: "Dossier"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "neighborhood",
										children: "Neighborhood"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "alter",
										children: "Alter"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "campaign",
										children: "Campaign"
									})
								]
							})
						}), dossier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "hidden shrink-0 sm:inline-flex",
							children: dossier.metro.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
						className: "min-h-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [
								panelTab === "dossier" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierPanel, {
									dossier,
									loading: dossierStatus === "loading",
									neighborhood
								}),
								panelTab === "neighborhood" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeighborhoodPanel, {
									intel: neighborhood,
									loading: neighborhoodStatus === "loading"
								}),
								panelTab === "alter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlterStudio, {}),
								panelTab === "campaign" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignPanel, {})
							]
						})
					})]
				})]
			}),
			history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "hidden shrink-0 items-center gap-2 overflow-x-auto border-t border-border px-4 py-2 md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground",
					children: "Recent"
				}), history.slice(0, 6).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					className: "h-8 shrink-0",
					onClick: () => {
						selectPin(h);
						runIntel(h);
					},
					children: h.address
				}, h.id))]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoutWorkspace, {});
}
//#endregion
export { Home as component };
