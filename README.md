# Lingo Garden + Bridge + Roleplay

An independent Korean learning prototype for Autonomous SG 2026. The course shell recreates a subset of observed Duolingo Korean web interfaces with original code and artwork. Bridge adds a curated conversation-repair loop; Roleplay adds live model-driven scenario conversations.

## Run locally

Requires Node.js 22.13 or later.

    npm install
    npm run dev

Open http://127.0.0.1:5173. The home route opens the course at /index.html.

The course, Bridge, and Roleplay picker are available without an API key. Live Roleplay replies and scorecards require a Claude API key (ANTHROPIC_API_KEY) in the ignored .env.local file. Provision the key using a secure setup flow. Never place a key in public/ or commit an environment file. Hosted deployment requires the key as an encrypted server secret.

    npm run build

The Sites integration builds the server for Cloudflare Workers. Preserve .openai/hosting.json only when updating the existing Site; use your own Site identity for a separate deployment.

## Features

- Korean course path, sequential unlocks, Guidebook, word-bank and typed exercises, stories, radio, Practice Hub, letters, leaderboard, quests, profile.
- Word translation hints, answer colors and bounce, on-screen Hangul composition keyboard.
- Bridge: a shop misunderstanding, feedback in English/Chinese/Malay, two-attempt comparison, and café transfer check.
- Roleplay tab: café, directions, and gift-shop scenarios; A1/A2 levels; text and browser voice; goal progress; translations; hints; model-generated accuracy, complexity, and appropriateness scorecards; XP and streak integration.

Roleplay uses the Claude API (official @anthropic-ai/sdk, default model claude-opus-5-5 at low effort, overridable with CLAUDE_MODEL) with structured outputs validated against zod schemas, and server-side refusal fallbacks. Scenarios and instructions are set server-side. Voice is browser speech recognition and synthesis, not pronunciation scoring. Model scores are estimates.

## Tests and scope

See ROLEPLAY-VERIFICATION.md and OBSERVATIONS.md. UI fixture tests do not prove model quality. The 20-seed evaluation runner stops on API errors; a real paired comparison with Max is still pending.

All learner progress is browser-local. No account synchronization is implemented. Fonts use Google Fonts with system fallbacks.

## License

MIT, in LICENSE. This prototype does not reproduce the full Duolingo service or use official character assets. A public source repository is still required for the hackathon's full open-source criterion.

## Reverse-engineering method and measured results

We observed the Korean course UI in our own Duolingo account, recorded visible transitions, and independently reconstructed a subset of the course loop. We did not recover Duolingo source code, scoring prompts or private algorithms. Roleplay follows its published scenario-chat design; no paired black-box Max Roleplay experiment was completed.

- Bridge regression suite: 34/35 cases match the supplied expected labels (97%); these labels have not been independently teacher-validated.
- Claude Roleplay: 20/20 planted errors identified after per-case review (100% of this fixed, deliberately incorrect test set). See tests/ROLEPLAY-RESULTS.md. This is not general accuracy, and the false-positive rate is unknown.
- End-to-end voice latency: not measured yet; no API timings are substituted for speech latency.

### Environment variables

ANTHROPIC_API_KEY is required for live Roleplay. CLAUDE_MODEL is optional; default claude-opus-5-5, with claude-haiku-5-5 as the configured cheaper option. Copy .env.example to .env.local and provision your own key securely. Never commit keys. Bridge runs without a model key.

### Public checkout setup

Copy .openai/hosting.example.json to .openai/hosting.json before npm install and npm run dev. The example contains no production Site identity. Use your own Site registration to deploy a fork.
