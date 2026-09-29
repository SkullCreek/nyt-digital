# Design direction

## Concept: the studio in daylight

NYT Studios (the agency) is the studio at night: dark sky, galaxy, cinematic.
NYT Digital is the same studio in daylight: the shop where the crew sells its tools.
Same spark mark, same fonts, same pill buttons.
Different light: a cool plaster-white gallery wall instead of a night sky.

The one bold element is the **viewfinder**: the UGC ad plays inside camera corner brackets with a live timecode and a REC dot.
It says "this makes video" before anyone reads a word.
The buy button borrows the same corner brackets on hover (reference: uiverse `cssbuttons-io/brown-otter-21`).
Everything else stays quiet.

The only dark surface is the sample prompt panel: the agency's night sky leaking into the shop, where the real work lives.

## Colour

| Token | Hex | Use |
|-------|-----|-----|
| Plaster | `#EEF0F3` | Page background |
| Paper | `#FFFFFF` | Raised surfaces, inputs |
| Ink | `#0F1A3C` | Text (navy, matches the agency's night) |
| Ink soft | `#4A5270` | Secondary text |
| Cobalt | `#2346D0` | Buy actions only (the kit's cloth colour) |
| Brass | `#B08A3E` | The spark and small marks, never text |
| Night | `#0A0F2C` | Sample prompt panel |
| Rec | `#E5484D` | REC dot and form errors only |

Rule: cobalt means money.
If it's cobalt, clicking it moves you toward checkout.

## Type

- Syne 700/800: headlines, set tight and large. Shared with the agency.
- Space Grotesk 400/500: body and UI. Shared with the agency.
- Space Mono 400: the prompt text only, because prompts are literal text you paste.

Sentence case everywhere.
No all-caps labels, no eyebrows above every heading.

## Shape

- Buttons and inputs: pill (shared with the agency).
- Media: 14px radius.
- Panels: 24px radius.
- Hairlines in `rgba(15,26,60,.12)`.

## Layout

Left-aligned, single column on mobile, 12-column grid on desktop, max width 1200px.
The product page reads top to bottom like a pitch: see it, understand it, trust it, buy it.
On mobile a sticky buy bar appears once the hero button scrolls away.

## Motion

- The viewfinder timecode follows the video.
- Buttons respond to hover and press.
- The copy button confirms "Copied".
- No scroll-triggered entrance animations.
- Everything respects `prefers-reduced-motion`.

## Component references (uiverse.io, MIT)

| Our component | Reference |
|---------------|-----------|
| Buy button | `cssbuttons-io/brown-otter-21` (corner brackets), `barisdogansutcu/yellow-husky-22` (pill glow) |
| Copy prompt | `vinodjangid07/brave-ladybug-0` (split label + icon) |
| Email signup | `andrew-demchenk0/yellow-cheetah-66`, `Yaya12085/evil-chipmunk-15` (button inside field) |
| Cookie toggles | `Bodyhc/loud-badger-7` (tick inside track) |
| Submit loader | `Bodyhc/wonderful-panther-25` |
