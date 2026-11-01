# Marketing content 2026-11 manifest (MKT crew)

One line per deliverable, with status. Masked = test tenant name and TEST MODE / BETA badge hidden. All drafts until the owner approves each piece. Nothing published.

## Status key
- final: masked, ready for the owner to review and approve
- draft: usable, not yet masked or not yet final
- spec: a written specification (text), the design or video built from it

## Carousels (social/carousels)
- c01 to c12, 12 promotional carousels. Status: final (masked). Images at social/carousels/images/cNN-SS-1080x1350.png and -1080x1080.png, built from the masked real product stills and the brand tokens read from tokens.css. One cNN-*.md spec each.

## Autoplay loops (social/loops)
- a01 to a12, 12 short looping posts. Status: spec done, video build in progress (MP4, 6 to 15s, silent with captions). Built from the same masked stills.

## Walkthrough videos (videos/clips)
- supplier-long and buyer-long, MP4 at 1920x1080, 1080x1920, 1080x1080, plus captioned versions. Status: draft (recorded before masking). To be re-cut from masked captures before the board and Drive copies, so only masked video ships.

## Stills (videos/clips/stills)
- Supplier stills (s-*.png): final (masked). Includes the 7 per-bid contract screens (tender, questions, requirements, response, social-value, review, submission).
- Buyer stills (b-*.png): draft (to be re-masked from a fresh buyer capture before upload).

## Captions (videos/captions)
- 16 SRT files (2 long, 14 short). Status: final (text, no PII).

## Scripts (videos)
- shot-list.md, script-supplier-long.md, script-buyer-long.md, script-shorts.md, RECORDING-GUIDE.md. Status: final (text), shot-list corrected against the driver reference.

## Knowledge base (knowledge-base)
- help-articles-crew.ts (16 articles, platform repo), knowledge-base-gaps.md. Status: final (text), accepted by the driver.

## Social copy and calendar (social)
- copy.md (post text per network, hashtags, alt text), calendar.md (6 week plan). Status: final (text).

## Report
- REPORT.md. Status: final (text), updated with the recording method.

## Note on where files live
- Durable master: the owner's Google Drive content-2026-11 (MKT has no access yet, see the channel).
- Review board: http://192.168.1.63:8099/media/mkt/ (masked images and videos only).
- Git: branch review/r29-content-kiro-crew in both clones, plus a git bundle backup at C:\Users\apara\velstrian-backup. Nothing pushed.

## Audio (added for the owner audio rule)

Voice over:
- Engine: piper-tts (MIT licence, free, offline), run in a local venv.
- Voice model: en_GB-cori-medium. Card: https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_GB/cori/medium . Dataset: LibriVox, licence PUBLIC DOMAIN. Commercial use allowed, no attribution required.
- British English, about 150 words a minute. The product name is said as vel-STREE-an via a phonetic spelling in the TTS input only; the on-screen text and captions keep the correct spelling "Velstrian".

Music bed:
- Self-made ambient pad, synthesised with ffmpeg (layered sine tones, slow tremolo, gentle filter). Created by the crew, so no third-party rights: royalty free, commercial use fine, no attribution. Source: generated, not downloaded.
- Ducked under the voice (sidechain), whole mix normalised to about -14 LUFS integrated (loops to about -16), peaks below 0 dB, no clipping.

Audio deliverables:
- videos/supplier-long-1920x1080-audio.mp4 and buyer-long-1920x1080-audio.mp4: voice over + ducked music + matching WebVTT (captions/supplier-long.vtt, buyer-long.vtt).
- social/loops/*.mp4: all 24 now carry the music bed (they autoplay muted in feeds, sound present when unmuted).
- Self check per file: confirmed each has an audio stream and non-silent audio (supplier mean -15 dB, max 0 dB).

Status: the horizontal walkthroughs have full audio. The vertical and square walkthrough cuts and the owner's listen on the voice sample are the remaining audio steps.

## Concern log (team member / owner feedback, updated after each change)

1. "the current voice sounds very automated, non-authentic and uncanny... more friendly, positive and influential". Change: dropped the piper TTS; moved to Google Cloud TTS natural voices; reviewer picked Leda (primary) + Puck (secondary) mixed. Status: DONE (voice picked), re-render IN PROGRESS.
2. "redo only the videos containing audios and save in a separate folder". Change: new voiced videos go under videos/clips/voiced-v2 and the board v2/videos. Status: IN PROGRESS (re-rendering with chosen voice + new scripts).
3. "social/loops/v2 is useless... no voice, pictures stretched, horrible quality". Change: scrapped the v2 loops (commit d26f011a); will rebuild from the clean full-res stills, no stretching, after the voice pick. Status: IN PROGRESS.
4. "all videos have the same voices and the same script... different ones for each video" (without wasting credits on brand-new creative). Change: a distinct script per video, 2 long + 8 short, in review-pack-v2.md, each line sourced. Status: NEEDS DECISION (reviewer OK/Change per script).
5. "make it more professional like a top startup... animation, design, slides" and "ask claude what you can improve". Change: design upgrade plan from driver #193 (device frames, progress bar, Ken Burns, title/end cards, lower-thirds). Status: IN PROGRESS (loops rebuild + carousels + walkthrough cards).
6. "scripts must be 100% true... without inventing lies... influential and very good marketing style". Change: every script line carries a source on the current build; cut "Primary data stored in the EU" (not on the website); "no AI" uses the exact on-screen wording. Status: NEEDS DECISION (driver truth check + reviewer wording).
