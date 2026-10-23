#!/usr/bin/env node
/**
 * build-people-photos.mjs: the ONE place a people photograph's derivatives are made.
 *
 * Added 2026-10-23, owner direction D305, R285-WEB-IMAGERY-AND-DISCLOSURE-01 lane D:
 * a few real people at work so a visitor connects, at most three on the whole
 * site. Each source is a licensed original kept in Assets/people/originals/ and
 * logged in Assets/people/PHOTO-CREDITS.md with its source page and licence.
 *
 * WHAT IT EMITS, per photograph, into Assets/people/:
 *
 *   {base}-600.avif   {base}-600.webp
 *   {base}-1200.avif  {base}-1200.webp
 *
 * That is the two width shape components/ui/Photo.astro reads (`widths`), and
 * the 1200 AVIF is the file astro/src/data/image-credits.json describes. Every
 * master is cut at 4:3, the ratio the placements render at, so no pixels are
 * downloaded only to be cropped away by the browser.
 *
 * The encoder settings are the blog's (photo-encoders.mjs), so the two sets
 * cannot drift. Like build-blog-photos.mjs it REFUSES TO OVERWRITE: /Assets/*
 * is served immutable, so moving the bytes under a published URL reaches nobody
 * who already holds the old file. Pass --force only together with a rename.
 *
 * Usage:
 *   node scripts/build-people-photos.mjs           # make what is missing
 *   node scripts/build-people-photos.mjs --force   # re-encode everything
 *   node scripts/build-people-photos.mjs --check   # report gaps, write nothing
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { WEBP_MASTER, WEBP_RUNG, AVIF } from "./photo-encoders.mjs";

const OUT = path.resolve("Assets/people");
const SRC = path.join(OUT, "originals");

/** The two widths Photo.astro is given. The larger is the master. */
const SMALL = 600;
const LARGE = 1200;
const RATIO = 3 / 4;

/**
 * `top` is where the 4:3 window starts, as a fraction of the original height.
 * It is set per photograph because a portrait original needs a window placed on
 * the person, and the default centre would cut through the face or the desk.
 */
const PHOTOS = [
  {
    base: "site-paperwork-in-hi-vis",
    source: "pexels-kindel-media-8488034.jpg",
    top: 0,
  },
  {
    base: "sorting-paperwork-at-a-home-desk",
    source: "pexels-mizuno-k-12912118.jpg",
    /* 4000x6000 portrait. The window runs from just above her head to the
       laptop and the papers on the desk, and leaves out the plants above. */
    top: 0.3,
  },
];

const force = process.argv.includes("--force");
const check = process.argv.includes("--check");

let written = 0;
let missing = 0;

async function emit(pipeline, dest) {
  const exists = fs.existsSync(dest);
  if (exists && !force) return;
  if (check) {
    if (!exists) {
      console.log(`  MISSING  ${path.basename(dest)}`);
      missing += 1;
    }
    return;
  }
  await pipeline.toFile(dest);
  written += 1;
}

async function run() {
  for (const photo of PHOTOS) {
    console.log(`\n${photo.base}`);
    const src = path.join(SRC, photo.source);
    if (!fs.existsSync(src)) {
      console.error(`  REFUSING: source not found: ${src}`);
      process.exitCode = 1;
      continue;
    }
    const meta = await sharp(src).metadata();
    const width = meta.width;
    const height = Math.round(width * RATIO);
    const top = Math.min(Math.round(meta.height * photo.top), meta.height - height);
    const master = await sharp(src)
      .rotate()
      .extract({ left: 0, top, width, height })
      .resize(LARGE, Math.round(LARGE * RATIO))
      .toBuffer();

    for (const w of [SMALL, LARGE]) {
      const rung = () => sharp(master).resize(w);
      const webp = w === LARGE ? WEBP_MASTER : WEBP_RUNG;
      await emit(rung().avif(AVIF), path.join(OUT, `${photo.base}-${w}.avif`));
      await emit(rung().webp(webp), path.join(OUT, `${photo.base}-${w}.webp`));
    }
    for (const w of [SMALL, LARGE]) {
      for (const ext of ["avif", "webp"]) {
        const f = path.join(OUT, `${photo.base}-${w}.${ext}`);
        if (fs.existsSync(f)) console.log(`  ${path.basename(f)}  ${fs.statSync(f).size} B`);
      }
    }
  }
  if (check) {
    console.log(`\n${missing} derivative(s) missing.`);
    if (missing) process.exitCode = 1;
  } else {
    console.log(`\n${written} file(s) written.`);
  }
}

run().catch((error) => {
  console.error(
    JSON.stringify({
      level: "error",
      service: "build-people-photos",
      operation: "run",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    })
  );
  process.exit(1);
});
