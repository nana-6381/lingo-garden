# Edge-case test report — 31 October 2026

Three layers were tested: Bridge's rule engine, the Roleplay API's input validation, and the UI in a real browser (headless Chrome).

## 1. Bridge rule engine (`assess()` in public/bridge-app.js)

Run: `node tests/bridge-edge-cases.mjs`. There are 35 cases, each with the verdict a Korean teacher would expect.

| | Before fix | After fix |
|---|---|---|
| Cases matching the expected verdict | **24 / 35 (69%)** | **34 / 35 (97%)** |

Bugs found and fixed:

| Case | Input | Was | Should be | Cause |
|---|---|---|---|---|
| B02, B30 | 여기에서 먹을게요 | wrong particle | correct | Regex `여기에\s*(서)?먹` also matched the correct full form -에서, which the Guidebook itself teaches |
| B12 | 매장에서 먹고 갈게요 | wrong particle | correct | Same regex |
| B13 | 먹고 갈게요 | unclear | correct | "Eat and go" (= eat in) wasn't recognised as a place phrase |
| B18, B19 | 먹을게요 :) / ㅎㅎ | too casual | correct | Politeness check only looked at the last character |
| B22 | 여기서 **안** 먹을게요 | success | opposite meaning | Negation not detected, so a reversed meaning passed as correct |
| B20, B21, B23 | 포장해 주세요 / 집에서 먹을게요 | unknown / unclear | opposite meaning | Takeaway intent not detected. A new "opposite meaning" explanation was added in EN/ZH/MS |

Known limit, deliberately left failing: B26 `먹을께요` (a common misspelling of 먹을게요) is accepted, because the engine doesn't check spelling.

## 2. Roleplay API validation (live site, `POST /api/roleplay`)

All of these requests are rejected before any model call, so they cost nothing.

| ID | Request | Result |
|---|---|---|
| E01–E03 | Unknown scenario, level C2, mode "admin" | 400 ✓ |
| E04–E06 | Empty messages, whitespace reply, 801-character reply | 400 ✓ |
| E07 | 9 learner turns (limit is 8) | 400 ✓ |
| E08 | Injected `system` role message | 400 ✓ |
| E09–E10 | Conversation starting with the user; two user turns in a row | 400 ✓ |
| E11 | Non-string content | 400 ✓ |
| E13 | 30 KB body | 413 ✓ |
| E14 | Unknown explanation language | Falls back to English ✓ |
| E12 | Malformed JSON | **502 → fixed to 400** |
| E16–E17 | scenario = `constructor` / `__proto__` | **502 crash → fixed** (own-key lookup with `Object.hasOwn`) |

The live deployment still runs the old route until it is redeployed.

## 3. Browser UI (headless Chrome, local dev server)

| ID | Check | Result |
|---|---|---|
| U01 | Bridge: submit empty answer | "Write a response first" ✓ |
| U02 | Bridge: 포장해 주세요 | Opposite-meaning feedback ✓ |
| U03 | Bridge: retry with 여기에서 먹을게요 | "You made the repair clearer" ✓ |
| U04–U05 | Attempts persist across reload | ✓ |
| U06 | `<img onerror>` typed as an answer | Escaped, no script ran ✓ |
| U07 | Roleplay: send empty reply | Error shown ✓ (minor: shows a pointless RETRY button) |
| U08 | Roleplay: API out of credit | Clear message, conversation kept ✓ |
| U09 | Roleplay hint with no API | Works offline ✓ |
| U10–U11 | 390 px mobile width | No horizontal overflow ✓ |

## Not yet tested (blocked)

- **Live model quality:** the 20 error-seeded sentences in `roleplay-seeds.json`. The route now calls the Claude API. Set ANTHROPIC_API_KEY, then run `npm run eval:roleplay`.
- **Paired comparison with Duolingo:** Duolingo offers Video Call but **not Roleplay** for Korean, so a like-for-like Roleplay comparison isn't possible. Compare against Video Call or a Spanish Roleplay instead.
- **Speech recognition accuracy:** the Web Speech API is browser-dependent and needs a real microphone.
