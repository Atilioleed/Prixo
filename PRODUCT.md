# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Five confirmed segments under one account type and one price: children (6–12), teens (13–17), young travelers, professionals, and business owners/negotiators. Each learner has a concrete real-world objective in their target language, not a generic "learn a language" goal — e.g. negotiating a supplier deal, a multi-country trip, a job interview, an upcoming exam.

## Product Purpose

Prixo ("Tu idioma, un paso a la vez.") is an AI-powered language-tutoring product. It exists to get a learner ready for a specific real situation in another language, and to keep them on track (practice, review, reminders) until they get there.

## Positioning

The AI tutor builds a study plan from the learner's own described situation and deadline — e.g. "negotiating with a supplier in China," "a full trip through Europe (restaurants, hotels, tours)," "a job interview in 10 days" — instead of assigning a generic course curriculum. The same tutor identity (avatar, voice, personality) persists across text chat, voice, and video call. One price covers all five segments; the product adapts to the client, not the price.

## Operating Context

- Learner logs in (Google / Apple / email) and lands on their personal dashboard.
- Personalize screen: target language, "who you are" segment, avatar, accent, personality sliders, goal, and today's practice scenario.
- Planificación screen: free-text real-world context + optional deadline → AI-generated short/long-term goals, milestones, and suggested roleplay scenarios.
- Chat screen: text/voice practice with inline correction bubbles, plus a "revisar mi avance" mode for progress check-ins; a video-call entry point (currently a placeholder pending a real avatar-video provider).
- Materiales: downloadable support documents by level/type.
- Dashboard: streak, weekly progress, curriculum ("Temario," staged A1–C1 with a pass-to-advance test per stage), session log, class scheduling with a calendar/time-slot picker and reminder-channel selection (app/WhatsApp/SMS/email — delivery itself needs a connected provider), and account settings.
- Panel admin (role-gated to admin emails only): conversation flows, practice scenarios, learning documents, tests, user/client roster (active/deactivated), business metrics (revenue, costs, margin), AI/agent configuration and training, API key status, and connectors.

## Capabilities and Constraints

- Built on Next.js (App Router) + TypeScript + Tailwind, deployed as an installable PWA (no native iOS/Android app; that would be a separate, larger build).
- Auth via Auth.js: Google and Apple sign-in require the operator's own OAuth credentials (currently unconfigured — buttons show disabled with an explanatory state, never a fake success); email sign-in is a demo-only passwordless flow with no real verification yet.
- The AI tutor and planner call the Anthropic API server-side; without a configured `ANTHROPIC_API_KEY` these features degrade to a clear inline error rather than failing silently.
- No backend database yet — user profile, plan, curriculum progress, session log, and scheduled classes persist in browser localStorage per device, not synced across devices or accounts.
- Reminder channels (WhatsApp/SMS/email/push) are captured and stored per scheduled class but are not actually delivered yet; real delivery needs a connected provider (Twilio, an email service, native push infra), represented honestly in Panel admin → Conectores as inactive until configured.
- Video call with a live human-presence avatar is an explicit placeholder; a real implementation needs a paid third-party avatar/video provider (e.g. HeyGen, D-ID, Tavus).

## Brand Commitments

Name: Prixo. Tagline: "Tu idioma, un paso a la vez." Existing mark: a rounded-square badge with a violet→lime conic gradient and a punched-out circle. These are binding.

## Evidence on Hand

Internal strategy doc (Documento Maestro) frames Praktika.ai as the market reference point for demand validation; that comparison is internal positioning context, not a claim to reproduce on public-facing surfaces. No real customer testimonials, logos, press, or case studies exist yet — none should be fabricated. Business metrics shown in Panel admin (revenue, client counts, etc.) are clearly-labeled example data, not real figures.

## Product Principles

- One product, one price, five segments — the AI adapts, the pricing doesn't.
- Every practice session should trace back to the learner's own stated real-world objective, not a generic syllabus.
- Never simulate a capability as if it were real: unconfigured integrations (OAuth providers, AI key, reminder delivery, video avatar) show an honest "not configured" state instead of fake success.
- One tutor identity persists across every modality (chat, voice, video) and every screen.

## Accessibility & Inclusion

No product-specific accessibility requirement confirmed yet beyond standard web accessibility practice.
