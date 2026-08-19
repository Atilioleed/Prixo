# Design

<!-- impeccable:design-schema 1 -->

## World

**Mission Dossier.** Prixo reads as a personal mission-briefing folder rendered through night-ops instrument glass, not a generic SaaS chat app. The old friendly violet/lime/paper look was replaced; the violet→lime conic-gradient mark survives only as the brand seal (logo badge, avatar rings), never as a general UI accent.

Ground: near-black charcoal-navy (`--ground #0a0d13`, raised panels `--ground-raised #10141c` / `--ground-raised-2 #161b26`). Justification: a learner reviewing their personal briefing at night before the big day, glass panels lit from within.

Instrument accents: amber `--amber #ffb020` (primary — CTAs, active states, telemetry) and cyan `--cyan #4dd8d0` (secondary — nominal/success/status). Error/alert: `--red #ff6259`. A warm parchment tone `--paper #e8e2d0` exists for future paper-texture accents but is currently unused in shipped UI.

**Energy pass (post-launch feedback: "más efectos, movimientos... colores, energía, vivo, fácil, rápido")**: the seal's violet/lime were reactivated as live UI accents (`--seal-violet #5b4fe8`, `--seal-lime #c6ff5c`, plus new tint pairs), and a fifth accent `--pink #ff5ea8` was added — used for profile/waypoint color variety (each of the 5 learner profiles and 3 landing waypoints gets its own accent instead of uniform amber/cyan) and for the celebratory micro-interaction. The brand seal now continuously rotates (`animate-seal-spin`, 8s) everywhere it appears. Interactive elements (buttons, cards, chips) use a shared `.lift` utility (hover lift + shadow, spring easing) and `.glow-amber`/`.glow-cyan` for CTA emphasis. Lists (profile chips, waypoints, reasons, login features) stagger in on mount via `.animate-fade-up` with a `--stagger` custom property. Passing a Temario stage triggers a one-shot celebratory burst (`.animate-burst-pop` + `.burst-ring`) on that row. The landing hero has three large blurred gradient blobs (violet/pink/cyan) floating slowly behind the content for ambient color life, and the final CTA section carries a soft two-color radial wash.

## Type

- Display: Space Grotesk (`--font-display`) — technical geometric sans, tight tracking (-0.02em) on headings.
- Body: Inter (`--font-sans`).
- Data/telemetry: JetBrains Mono (`--font-mono`) — carries all numeric readouts, labels (`.data-label`: 10.5px, uppercase, 0.14em tracking, `--text-faint`), and countdown displays. Numbers use `.tabular` (`font-variant-numeric: tabular-nums`).

## Components

- `.panel` — base surface: `--ground-raised`, 1px `--line` border, 14px radius.
- `.panel-bracketed` — adds HUD viewfinder corner brackets (amber, `::before`/`::after`), used on primary/hero panels only, not every card.
- `Icon.tsx` — hand-authored line-icon set (1.75px stroke, round caps, 24×24 viewbox), ~30 icons. Emoji are banned as an icon system project-wide; the sole intentional exception is the six regional-indicator flag emoji in Personalize (functional language identifiers, not decorative icons).
- No kicker/eyebrow labels above headings anywhere (`ScreenHead` takes only `title` + `description`); no `01/02/03` section numbering. The one numbered list (Materiales index) is a literal document-exhibit index, not a decorative section counter.
- Stat displays avoid the identical-card grid: dashboard/admin KPIs render as one `.panel` divided by hairlines into columns, not N separate bordered boxes.

## Motion

One signature vocabulary, reused rather than scattered: `animate-rise` (tab entrance), `animate-float` (hero device), `animate-flicker-in` (device-preview slide change), `animate-pulse-dot` (live status dots), `animate-sweep-in` / `animate-radar-spin` (reserved HUD sweep primitives in `globals.css`, available for future use). All respect `prefers-reduced-motion`.

Functional live instruments, not decoration: `MissionClock` (real ticking clock, header), `PlanSummaryCard`'s `T-{n}` countdown (real days-until-deadline from the active plan).

## Copy

Spanish throughout is neutral Latin American (tuteo: "tú/tu/te"), never voseo ("vos/tenés/armá"). AI system prompts (`tutorSystemPrompt.ts`, `planSystemPrompt.ts`) explicitly instruct the model to hold this register too.

## Provenance

Direction: field-ops briefing dossier (own-world candidate list, assigned index 6 via `concept-seed.mjs --scope direction --mode persuade`, seed `a0d1098d`), raised with the collider-event-display challenger's telemetry/instrument grammar (declined on fusion, donated the HUD-readout discipline used for progress rings and stat displays). User-confirmed via structured question round before build.

Build path: code-led (no image-generation tool available in this harness; stated once, not asked per round).

Finish: `detect.mjs` returns zero findings; `tsc --noEmit` and `eslint` clean on all `src/` files. No pixel screenshots were possible in this environment (browser-pane compositing unavailable), so the finish review substituted full-content accessibility-tree + text-content inspection of every screen at the interaction level in place of the standard visual diff — recorded here as the disclosed substitution, not a silent skip.
