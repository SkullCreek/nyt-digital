---
target: product page and home page of nyt-digital
total_score: 27
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\Asus\\Downloads\\NYT STUDIOS\\nyt-digital\\app\\products\\[slug]\\page.tsx"
target_fingerprint: "sha256:7b20258599c27c0503f81a488c83cdbc6d71fa39af7a6f3e1247b4e3e21ce5e6"
target_path: "C:\\Users\\Asus\\Downloads\\NYT STUDIOS\\nyt-digital\\app\\products\\[slug]\\page.tsx"
timestamp: 2026-09-29T16-15-42Z
slug: app-products-slug-page-tsx
closed: true
---
DEGRADED: single-context (sub-agents not spawned without the user's explicit request)

## Design health: 27/36 (75%, Good). Heuristic 7 n/a (persuade surface, no power-user path expected).
1 Status 3 | 2 Real world 3 | 3 Control 3 | 4 Consistency 3 | 5 Error prevention 3 | 6 Recognition 3 | 7 n/a | 8 Minimalism 3 | 9 Recovery 3 | 10 Help 3

## Specificity
Authored: viewfinder hero, lock-line code sample, chapter grid, photo-in/clip-out proof, cobalt-means-money rule. Generic: 4-step numerals, fit/not-fit checklists, +/- FAQ accordion.
Detector: CLI 0 findings. Browser: undersized-ui-text "DIGITAL" 8.5px wordmark (x2 per page, logo lockup); heading-rhythm on "Before you buy" and "Your rooms are ready to move." (false positive: spacing owned by previous section's bottom padding).

## Priority issues
1. [P1] Mobile first viewport has no visual: viewfinder sits below the spec list; Meta ad visitors see only text + cookie banner. Fix: on mobile order CTA, video, then spec list. (/impeccable adapt)
2. [P2] Two buy CTAs on screen at once on mobile (sticky nav "Get the prompts $9" + bottom bar "Get it $9"), with label drift. Fix: hide nav buy button under 760px; one label. (/impeccable distill)
3. [P2] Cookie banner covers ~40% of the first mobile viewport. Fix: compact mobile banner, one row of buttons, shorter copy. (/impeccable adapt)
4. [P2] Repeat free-prompt request inside 24h says "on its way" but sends nothing; a user who lost the email contacts support. Fix: success copy tells them to check spam and email us if it's not there in 10 minutes. (/impeccable clarify)
5. [P2] Mobile steps section: 40px numerals stacked above each title make each step ~180px tall. Fix: numeral beside title on mobile. (/impeccable layout)

## Minor
- "DIGITAL" wordmark at 8.5px (shared with the agency lockup) is hard to read; 10px keeps the lockup.
- Turnstile checkbox appears with no context line.
- "The room melted" is told, not shown; a failed-AI-room vs locked-room clip would prove it (needs an asset).
