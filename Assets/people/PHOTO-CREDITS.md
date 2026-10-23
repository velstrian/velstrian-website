# People photo credits

The record of every photograph of a real person on the site: where it came from, under what licence,
what it shows and where it is used. Started 2026-10-23, owner direction D305,
R285-WEB-IMAGERY-AND-DISCLOSURE-01 lane D ("add a few real human faces so visitors connect"). Same
practice as `blog/PHOTO-CREDITS.md`.

## The rules these photographs are held to

- **One people photograph per home audience card, plus the construction sector page.** Four are in use.
  Amended 2026-10-23 (R285-WEB-AUDIENCE-PHOTOS-01, driver decision on the owner's report that one
  card of three with a face looked inconsistent). It was "at most three on the whole site" before.
- **Free licensed sources only** (Pexels, Unsplash, Pixabay free photos). No AI generated faces: the
  files under `Assets/images/r285-gemini/people-*` are banned from use.
- **No caption names the person or calls them a customer, a user or a member of staff.** The Pexels
  Licence says "Don't imply endorsement of your product by people or brands on the imagery", and no
  model release is promised by the source. A photograph sits beside plain copy, never beside a
  testimonial, a customer name or an "our team" line.
- **Every photograph passed a look test before use:** the original was downloaded and viewed, and
  rejected if it looked staged, off brand, low quality, showed a readable trade mark or a sensitive
  setting, or did not look like UK work.

## Licence, quoted from the current page

Pexels Licence, https://www.pexels.com/license/ (read 2026-10-23, quoted in
`crowagent-platform/docs/release-2.8.5/design/IMAGERY-AND-DISCLOSURE-ANALYSIS-2026-10-23.md`
section 3.1): "All photos and videos on Pexels are free to use." "You can modify the photos."
"Attribution is not required." Restrictions: "Identifiable people may not appear in a bad light or in
a way that is offensive", "Don't sell unaltered copies", "Don't use the photos or videos as part of
your trade-mark", "Don't imply endorsement of your product by people or brands on the imagery".

Each photo page below showed its own "Free" badge on 2026-10-23. The licence is not assumed from the
site.

## In use

| File stem | Source page | Photographer | Licence | Fetched | What it shows | Where it is used |
| --- | --- | --- | --- | --- | --- | --- |
| `site-paperwork-in-hi-vis` | https://www.pexels.com/photo/woman-engineer-writing-down-on-paper-8488034/ | Kindel Media | Pexels Licence, https://www.pexels.com/license/ | 2026-10-23 | A woman in a yellow hard hat and hi-vis vest sits on a building site filling in a form on a clipboard. Page date 25 June 2021. | `/sectors/construction/`, under the "Who asks you to bid" heading (`person` in `astro/src/content/sectors/construction.md`) |
| `small-team-working-at-an-office-table` | https://www.pexels.com/photo/group-of-women-talking-in-an-office-8837459/ | Yan Krukau | Pexels Licence, https://www.pexels.com/license/ | 2026-10-23 | Four women work together at a table in a small office: one on a tablet, one writing while two look over a document with her. No readable trade mark. Page date 20 July 2021, page showed the Free badge on 2026-10-23. Chosen by the owner from three they proposed. | Home page, the "I run a small business" panel of the audience band (`astro/src/components/evidenced/Audience.astro`) |
| `team-lead-running-a-meeting` | https://www.pexels.com/photo/colleagues-in-a-meeting-7693734/ | Yan Krukau | Pexels Licence, https://www.pexels.com/license/ | 2026-10-23 | A team lead in a check blazer leans over a white office table to go through the work with three colleagues, one of them at a laptop, under a skylight. No readable trade mark (the laptop lid is plain). Page date 28 April 2021, page showed the Free badge on 2026-10-23. Same photographer as the small team photograph, so the light and colour match. | Home page, the "I lead a growing team" panel of the audience band |
| `reading-a-proposal-at-a-desk` | https://www.pexels.com/photo/woman-with-red-and-black-headscarf-reading-a-paperwork-8154455/ | Cedric Fauntleroy | Pexels Licence, https://www.pexels.com/license/ | 2026-10-23 | A woman in a headscarf reads through one open document at a white desk by a window, a plain laptop beside her, plants on shelves behind. Natural light, one document and no clutter, no readable names, logos or sector signs, so it reads as public or private alike. Page date 1 June 2021, page showed the Free badge on 2026-10-23. Chosen after the owner rejected the first buyer photograph. | Home page, the "I buy services" panel of the audience band |

Originals as downloaded, unedited: `originals/pexels-kindel-media-8488034.jpg` (5184x3888, 1,080,287 B)
, `originals/pexels-mizuno-k-12912118.jpg` (4000x6000, 3,348,600 B) and
`originals/pexels-yan-krukau-8837459.jpg` (6000x4000, 2,365,314 B), `originals/pexels-yan-krukau-7693734.jpg`
(6000x4000, 2,458,287 B) and `originals/pexels-cedric-fauntleroy-8154455.jpg` (6562x4369, 3,078,456 B). They are never served:
`astro/scripts/copy-assets.js` copies only files the built pages reference.

Edits, which the licence permits: each is cut to 4:3 and resized to 1200x900 and 600x450 by
`scripts/build-people-photos.mjs`, AVIF and WebP, with the blog's encoder settings
(`scripts/photo-encoders.mjs`). The construction photograph keeps the full frame. The home photograph
is a landscape original, so the 4:3 window is the full height and centred, which keeps all four people
and trims only the window frame and the edge of a chair. The two other home photographs get the same treatment (full
height, centred 4:3 window, `left: 0.5`, no blur), so the three audience cards share one crop, one size
and one processing. No colour, brightness or retouching change. Alt text lives in `astro/src/data/image-credits.json`.

## Looked at and rejected, 2026-10-23

The new candidates in the analysis shortlist (section 3.2, numbers 5 to 11) and the results of a
further Pexels search were downloaded and viewed, except where the row says otherwise. Number 12
(elderly care) was left out on the analysis's own reasoning, a sensitive setting.

| Candidate | Why rejected |
| --- | --- |
| Pexels 32497160, electrician at a fuse box | A US breaker panel in a US garage. Does not look UK. |
| Pexels 8961065, two engineers on site | Posed pointing gesture, reads as staged, not UK looking. |
| Pexels 3680959, two men on a construction site | The Hilti trade mark is readable on the helmet and the shirt. |
| Pexels 17842832, electrician at a cabinet | Turkish warning label, a Schuko socket and a readable meter brand. Not UK, trade mark. |
| Pexels 8134104, team round a laptop | Hotel lobby with chandeliers, staged corporate. |
| Pexels 7495291, office team meeting | Creative studio set dressing, reads as staged. |
| Unsplash GoDbzYs7cJU, woman at a desk | Not viewable: Unsplash served a bot check to every request, so it could not be looked at and was not used. |
| Shortlist 1 to 4, the blog photographs (Pexels 5973975, 12234106, 7841499, 12903101) | Not reused: each already heads a blog post, so a reader would meet the same picture twice, and 5973975 is cropped with no face. Not re-viewed for this pass. |
| Pexels 5973964, joiner at a laptop | First rejected for the readable Marshall amplifier logo. Tried on the home page on 2026-10-23 with the logo blurred, and the owner did not like it: a team reads more like a small business than one person. Never shipped. |
| Pexels 15543212, women in a conference room | Owner proposed. The photographer is Walls.io and its own product and logo fill the screen: a company advert and a readable trade mark. |
| Pexels 7675016, three people at a desk | Owner proposed. All three face the same way in profile, nobody interacts, and the table is dressed with ceramic props. |
| Pexels 4491881, woodworker at a laptop | Natural, but the dust mask dates it to 2020 and hides the face. |
| Pexels 8960941, 8960933, 8961300 | Same staged shoot as 8961065, posed pointing, a Schuko socket in 8961300. |
| Pexels 8293666, man in hard hat with clipboard | Posed portrait looking at the camera. |
| Pexels 11429199, 16468074 | Hollow clay or concrete block building, not UK house building. |
| Pexels 4276427, builder on a lift platform | FRACO and PABCO trade marks readable. |
| Pexels 7857531, woman among parcels | Posed smile at nothing, reads as staged. |
| Pexels 12911217, woman with papers at a computer | Natural, the same shoot as the photograph in use. Kept as the reserve. |
| Pexels 8428049 (Kampus Production), older man in a suit reading papers at a desk | Wired for the buyer card on 2026-10-23 and rejected by the owner on the home page: the buyer card should show a woman. Never committed, derivatives deleted. Replaced by 8154455. |
| Pexels 8190827 (Kampus Production), team lead standing at a meeting | Tried first for the team card on 2026-10-23 and looked at on the built page: darker and warmer than the other two, a busy glass office behind and a colleague's back filling the front, so it broke the set. Replaced by 7693734. |
| Pexels 7876895 and its shoot (Karola G), team at a whiteboard | Bright and natural, but two readable Apple logos, a posed hand on the head and, in sibling frames, shouting and phone calls. |
| Pexels 8276626 (PNW Production), man laughing over a document | A wide stock grin and a readable coffee cup logo. |
| Pexels 8730857 (Mikhail Nilov), man reading at a table | Plain studio wall, reads as a portrait shoot rather than a workplace. |
| Pexels 7691663 (Yan Krukau), woman reading a report | Moody low key light and a trading screen behind, does not match the bright set. |
| Pexels 7129680 (Michael Burrows), man reading papers | Natural, but on a sofa with a cluttered table, and the owner has rejected paperwork clutter. |

## Retired

| File stem | Used | Why retired |
| --- | --- | --- |
| `sorting-paperwork-at-a-home-desk` (Pexels 12912118, Mizuno K) | Home page audience band, 2026-10-23 | The owner asked for a different home photograph on 2026-10-23: a person buried in paper reads as the problem, not the help. The derivatives stay in this folder because /Assets/* is served immutable, but no page references them, so `copy-assets.js` no longer ships them. |

`/about/` deliberately has no people photograph. It is the page about who is behind the company, so
any face there reads as "our team", which is the endorsement and employment implication the licence
section above rules out.
