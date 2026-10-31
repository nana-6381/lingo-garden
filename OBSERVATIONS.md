# Observation and test log — 31 October 2026

Source: the user's open Safari Duolingo Korean web tab. Scope is one account and visible interactions, not a course-wide or platform-wide claim.

| Screen | Observed | Limit |
|---|---|---|
| Learning path | Lessons, Stories, Radio, Practice, Unit Review visible near Section 2 Unit 6 | This account and position in path |
| Unit 6 Guidebook | Key phrases and a location-particle explanation (-에 destination vs -에서 location of action) | One unit |
| Lesson prompt | "Write this in English" with Korean sentence and English word bank | One exercise |
| Correct-answer feedback | "Awesome!" after assembling a correct answer | Wrong-answer behavior not tested |
| Practice Hub | Target Practice, Mistakes, Words, Stories visible | Does not establish all course/device availability |
| Max Roleplay | Not visible in inspected Korean web screens | Korean Roleplay behavior not tested |

The focused learning gap: the observed word-bank exercise checked recognition and sentence assembly. It did not test whether the learner could use a location phrase in a shop exchange or repair a misunderstanding.

The Guidebook phrase `우리는 시내에서 식사해요.` was visible. Bridge's shop and café dialogues are original demo scenarios inspired by the grammar transfer, not copied Duolingo lesson content.

## Prototype checks

- Guidebook to scenario navigation
- Typed first response and context-specific feedback
- Polite register, location particle, and clarity patterns
- Second response and side-by-side comparison
- New café transfer prompt
- Browser-local persistence
- Speech input fallback when Web Speech API is unavailable

## Evidence still needed for the hackathon

- Current account- and region-specific price for the paid comparison target.
- Measured hosting and speech-processing cost per learner.
- A public source repository linked from the demo.
- Korean speaker validation and learner testing.

## Full-interface rebuild, 31 October 2026

After feedback that the Bridge-only site omitted the familiar course interface, the prototype now includes a learning path, Guidebook, word-bank lesson, grammar question, typed response, feedback, story reader, radio exercise, Practice Hub, Hangul letters, leaderboard, quests, profile, and the Bridge handoff. The layout follows the observed navigation and path structure. All artwork is original CSS; the supplied character guide informed its flat color, rounded shapes, large eyes, and orange details. This is a working scope-limited replica, not a claim to reproduce every Duolingo feature.

Browser checks completed: correct word-bank sentence, grammar choice, typed Korean response, lesson completion and Bridge handoff; Guidebook rendering; Practice Hub; story reader; radio answer feedback; letters screen; course picker; desktop and mobile layouts. The Bridge first-attempt, feedback, retry, and café transfer flow was checked in the previous build and remains linked from this one.
