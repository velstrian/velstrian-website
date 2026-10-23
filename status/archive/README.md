# Website board archive

## What this is

`issues-archive-pre-rebrand-2026-10-24.json` is a byte copy of `status/issues.json` as it stood
on disk on 2026-10-24 (901,903 bytes), before the website board was cleaned for the Velstrian
rebrand. It holds all 458 items, including the rows other lanes had not committed at that time.

It is a record. Nothing reads it, and it is not a release snapshot, so it is not listed in
`index.json`, which holds only release snapshots written by `build-platform-board.js --snapshot`.

## The cutoff

**2026-10-16 00:00 (Europe/London).** Items created before this date were archived or carried.
Items created on or after it are on the clean board.

Why this date:
- The earliest board item about the rebrand is A-291 (plan page, owner request 2026-10-17).
  Its creation date, from git blame, is 2026-10-17.
- The earlier of that and 2026-10-16 is 2026-10-16, as the brief asks.
- The first rebrand commit in the website repo is `7e6dc767` (2026-10-20), after A-294 was
  tracked in `a4f786ba`.
- No item in the board has a creation date between 2026-09-21 and 2026-10-17, so any cutoff in
  that gap gives the same split.

Creation dates come from `git blame` on each item's `"id"` line. `issues.json` has no
created or opened field, so every item was dated this way.

## Counts

| | Items | Notes |
|---|---|---|
| Before | 458 | FIXED 301, CLEARED 73, BUILT 38, WIP 24, DECIDED 12, OPEN 6, NOREPRO 2, CORRECTED 1, REFUTED 1 |
| Archived | 342 | Old items with status FIXED (278) or CLEARED (64) |
| Kept on the clean board | 116 | 102 created on or after the cutoff, plus 14 carried |
| Carried old items | 14 | Old and not closed, kept with the note "carried from pre rebrand board 2026-10-24" |

Of the 102 new items, 42 were uncommitted rows from other lanes on the day of the cleanup.

The 14 carried items are DECIDED (8), BUILT (2), CORRECTED (1), REFUTED (1) and NOREPRO (2).
Only FIXED and CLEARED are archived, because those are the only closed statuses in the legend.

## Reading the archive

- Each item keeps its `id`, `src`, `sev`, `title`, `status` and `note` exactly as it was.
- Archived items are old. To find one, search the archive by `id`, for example `A-106`.
- `nextId` is 391 in both files. Every id ever issued is below 391, so an archived id is
  never reissued.

## Next id

`add-issue.js` reads `nextId` from `issues.json`. The clean board keeps `nextId: 391`, so the
next new item is `A-391`.
