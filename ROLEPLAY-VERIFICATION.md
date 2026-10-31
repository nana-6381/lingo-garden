# Roleplay contract and verification

The Roleplay tab uses a constrained Claude character for three Korean scenarios. Canonical scenario instructions and score schemas are in lib/roleplay.ts; POST /api/roleplay is implemented in app/api/roleplay/route.ts. Dialogue and review both use the Claude API through @anthropic-ai/sdk (default claude-opus-5-5; low effort for turns, medium for the scorecard) with structured outputs validated against zod schemas. API keys remain server-side.

## Contract

- Scenario and available facts are set server-side; learner turns cannot select an arbitrary system prompt.
- A1 uses a single short polite sentence and one question at a time. A2 permits short follow-ups.
- The model returns three goal booleans, an in-character reply, translation, hint, difficulty adjustment, and a genuine correction only when warranted.
- Review estimates accuracy, complexity relative to level, and contextual appropriateness. Correct short answers retain accuracy credit.
- User may finish early; unfinished goals are not silently awarded.
- XP is granted once per saved session; streak uses the existing local progress logic.
- Voice input is browser transcription and voice output is browser speech synthesis. There is no pronunciation score.

## Test status

**31 Oct 2026: migrated from OpenAI to the Claude API.** The OpenAI results below are kept for history; live Claude replies still need ANTHROPIC_API_KEY to be set and verified.


The first live API request returned HTTP 429 / credit_balance_exhausted. Consequently, no live character replies, scorecards, or detection percentages have been verified. The account credit-offer check returned not_qualified. Adding API credit is required before live model testing.

20 deliberately error-seeded learner replies are in tests/roleplay-seeds.json. These fixtures need Korean-speaker validation before treating them as authoritative. Run npm run dev, then node tests/run-roleplay-eval.mjs after funding. The runner stops on API errors rather than inventing results. Manually verify whether each correction identifies the seeded error; hasError alone is a flag rate, not a full accuracy measure.

The same messages have not been sent to Duolingo Max. Max Roleplay was not visible in the previously inspected Korean web course. No Max subscription or trial has been activated. A real paired comparison requires access to the feature and preserving each response as evidence.

## Checks completed during implementation

- TypeScript no-emit check passed.
- Production server build passed before final packaging.
- Browser check: Roleplay tab, scenario picker, level/language controls, opening chat, Korean keyboard attachment.
- Local-only fixture server: reply rendering, goal updates, scorecard, feedback corrections, XP award and persistence; reload left XP at 25 instead of awarding it again. Fixture summary is explicitly labelled UI TEST FIXTURE.
- Real server route: returned the expected API-credit-exhaustion message; it did not fabricate a reply.
- Safari subscription settings: current account is Super, managed in iOS App Store. Korean web Practice showed Target Practice, Mistakes, Words, Stories. No Roleplay or Max trial was exposed on these inspected screens. This is not a claim that all courses/devices lack Roleplay.
