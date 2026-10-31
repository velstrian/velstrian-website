# Recording guide (for the team member at the keyboard)

One page to record the product videos from staging. The crew set up the tools and wrote the shot list. You press record and follow the shots. The crew then trims, scales, burns in the captions and makes the thumbnails.

## Before you start

- Tools are installed: OBS Studio 33.0.0 and ffmpeg 9.0.2. Nothing else to install.
- You will get two things from the owner, privately, never in the channel: the sign ins for three staging test personas (supplier public, supplier private, buyer public) and a Vercel share link for the staging app. Treat the share link like a password.
- Keep free memory above 1.5 GB. Close other heavy apps while OBS runs.

## Clean browser profile

1. In Chrome or Edge, make a fresh profile used only for recording. No personal sign ins, no extensions, no bookmarks bar showing.
2. Open the Vercel share link once in that profile. That sets the cookie that lets you past the staging login.
3. Sign in as the persona the shot calls for. Tick the Turnstile check like a normal user.
4. Accept only the necessary cookies, so the banner goes away before you record.

## OBS settings

- Scene 1 "desktop": canvas 1920x1080, 30 fps. Source: Window Capture on the browser window (not the whole screen, so no taskbar or clock shows). Output MP4 (Settings, Output, Recording Format mp4). If OBS only offers mkv, record mkv then File, Remux Recordings to mp4.
- Scene 2 "vertical": canvas 1080x1920, 30 fps, same window capture scaled to fit. Use this for the vertical cuts.
- Put recordings somewhere easy to find, then tell the crew the folder.

## How to record each shot

- Open `shot-list.md` in this folder. Record the two long walkthroughs and the shorts.
- Move slowly. Hold each screen 3 to 6 seconds so the crew can trim cleanly. Smooth, unhurried mouse moves.
- Do one screen per shot in the order the shot list gives. A short is one row recorded on its own.
- Before you keep a clip, check nothing private is on screen: no real email, no phone number, no web address with a token in it, and never the share link itself. If one shows, blur it or re-take.
- Do not create, delete or change real data beyond normal clicks. No invites to real people.

## STOP list, do not record or even click these

The staging checkout is on a live payment key, so these are off limits entirely:

- Checkout, upgrade, buy credits, billing payment, add a card, or anything Stripe.
- If a flow would reach one of these, stop at the screen before it and cut.

## After a session

Hand the clips to the crew (tell it the folder). The crew will, for each video:

- Trim to the script timing, scale to 1920x1080, 1080x1350, 1080x1920 and 1080x1080.
- Burn in the matching SRT from `captions/` with ffmpeg, for example:
  `ffmpeg -i clip.mp4 -vf "subtitles=captions/s1-find.srt" -c:a copy s1-find-captioned.mp4`
- Build the thumbnail to the spec in `thumbnails/thumbnail-specs.md`.
- Clips over 25 MB stay out of git: the crew lists the path and a checksum in `README.md` instead.

Then the crew posts a REVIEW-REQUEST with a line saying you reviewed the clips.
