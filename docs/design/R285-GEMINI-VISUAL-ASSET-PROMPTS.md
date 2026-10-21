# Gemini visual asset prompts, Velstrian website

Row R285-WEB-ENTERPRISE-REDESIGN-01, design system version 3 (`R285-DESIGN-STRATEGY-2026-10-21.md` section 0.8). Written 2026-10-21 by the platform driver for the owner to run in Gemini. The driver checks every result before it is used.

## How to use this

1. Paste one prompt at a time into Gemini image generation. Generate 3 to 4 options for each.
2. Save the best option at the largest size Gemini offers, as PNG, into `crowagent-website/Assets/images/r285-gemini/` with the exact file name given.
3. Tell the driver when a batch is saved. The driver checks each image (on brand, no text, no logo, no red, no artefacts, crisp at the size used) and wires it in, or asks for a regeneration with a precise change.

## The brand palette every prompt uses

Indigo `#5E6AD2`, light indigo `#8B95E5`, Velstrian purple `#A78BFA`, near black `#08090A`, white `#FFFFFF`. No red, no pink red, no orange (D256). No text, letters, numbers or logos anywhere in any image.

## A. Brand art for resource and tool cards (4 images, 1600 x 1000)

These sit on the resource cards (guides, the free tools, the blog), the way responsive.io uses a bold typographic poster and abstract UI art on its resource row.

**A1 `card-tender-finder.png`** (the free UK and EU tender finder)
> Abstract editorial illustration for a software product card. A calm composition of overlapping translucent rounded rectangles like stacked document cards, slightly offset, floating on a smooth diagonal gradient from deep indigo #5E6AD2 to soft purple #A78BFA. One card is highlighted with a thin white outline and a soft glow, suggesting the right match was found. Subtle fine grain, soft studio light, generous negative space on the left third. Premium, minimal, modern SaaS style similar to Stripe and Linear marketing art. No text, no letters, no numbers, no logos, no people, no red or orange.

**A2 `card-compliance-matrix.png`** (the free tender compliance matrix)
> Abstract editorial illustration. A clean grid of small rounded squares in white and light indigo #8B95E5 on a dark near black #08090A background, a few squares filled with soft purple #A78BFA as if checked off, arranged with a gentle perspective tilt so the grid recedes. Soft rim light, fine grain, crisp edges, lots of calm space. Premium minimal SaaS marketing art. No text, no letters, no numbers, no logos, no people, no red.

**A3 `card-guides.png`** (guides for first time bidders)
> Abstract editorial illustration of an open book or folded document made of soft frosted glass, seen from a three quarter angle, with light passing through it and casting a gentle indigo #5E6AD2 to purple #A78BFA glow onto a smooth off white surface. Calm, welcoming, high end product photography feel, soft shadows, shallow depth of field. No text, no letters, no numbers, no logos, no people, no red.

**A4 `card-blog.png`** (blog and updates)
> Bold abstract poster composition on a near black #08090A background: three tall rounded bars rising left to right in a gradient from indigo #5E6AD2 to purple #A78BFA, crossed by a single thin white arc, fine diagonal line texture in the background. Graphic, confident, modern editorial style. No text, no letters, no numbers, no logos, no people, no red.

## B. Section textures (2 images, 2400 x 1200)

**B1 `stage-texture.png`** (a subtle layer for the gradient product stages)
> Seamless abstract texture: a smooth diagonal gradient from indigo #5E6AD2 at the top left to Velstrian purple #A78BFA at the bottom right, with a very soft light bloom near the upper centre and an extremely fine film grain. No shapes, no objects, no text. It must look like premium printed paper lit by soft daylight, suitable as a background behind white software interface cards.

**B2 `close-band-texture.png`** (the closing call to action band)
> Wide abstract background: deep indigo #5E6AD2 flowing into purple #A78BFA with soft, slow curves of lighter light indigo #8B95E5, like silk under soft light, gentle depth, fine grain, calm and confident. Darker towards the bottom edge so it can blend into a near black #08090A footer. No text, no shapes that read as objects, no logos, no red.

## C. Social sharing card base (1 image, 1200 x 630)

**C1 `og-base.png`**
> Minimal abstract background for a social sharing image: near black #08090A with a large soft diagonal gradient shape in indigo #5E6AD2 to purple #A78BFA entering from the right edge, a few translucent floating rounded rectangles suggesting software cards, plenty of empty dark space on the left half for a headline to be added later. Premium SaaS style, fine grain. No text, no letters, no logos, no red.

## D. People at work (3 images, 2048 x 1365), for the About page only

Used only on About, never presented as customers (D252, honesty rule in strategy section 9).

**D1 `people-buyer-panel.jpg`**
> Editorial photograph, over the shoulder of one seated evaluator looking across a long table at three people reviewing documents together in a UK public building meeting room. Printed pages with pencil notes in the foreground, a water jug, a closed laptop with no brand marks. Tall sash windows, soft overcast north light, dark wood panelling, no crest or signage. 35mm lens, f/2.8, shallow depth of field, faces turned away or softly out of focus. Natural, desaturated cool grade with a faint indigo cast in the shadows. No logos, no text, not a real organisation, no red.

**D2 `people-small-team.jpg`**
> Editorial photograph of two people from a small UK business working together at a shared desk in a bright, plain modern office, one pointing at a printed page while the other types on a laptop with no brand marks, a mug and a notebook nearby, window light, plants. Natural and candid, not posed, nobody looking at the camera. 50mm lens, f/2.2, soft cool grade. No logos, no text, not a real organisation, no red.

**D3 `people-delivery.jpg`**
> Editorial photograph of a facilities worker in a plain unmarked navy jacket checking a clipboard in the corridor of a clean UK school or office building in morning light, face turned away, calm and professional. 40mm lens, f/4, documentary feel, muted cool grade. No logos, no text, not a real organisation, no NHS or council identity, no red.

## What the driver checks before any image is used

- On palette, no red or pink red, no stray text or letter shapes, no fake logos.
- No AI artefacts (warped hands, melted edges, repeated patterns, odd perspective).
- Sharp at the display size, and reads well on both a light band and a dark band where used.
- Converted to AVIF and WebP at the sizes the layout needs, credited in `astro/src/data/image-credits.json` as "Generated with Gemini for Velstrian".
