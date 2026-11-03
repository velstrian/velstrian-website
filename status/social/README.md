# Social posts, approval gated

Row R29-GA-SOCIAL-LAUNCH-01. Decisions D533 (free only, every post approved by email) and D535 (accounts and approvers).

## What is here

- `ga-launch-posts-2026-11-03.md`: the launch posts, one section per post, each with its account, format, image and the source of every fact.
- `ga-launch-approval.html`: a readable page of the same posts, generated from the posts file. Do not edit it by hand.
- `post-approvals.mjs`: prepares and tracks. It never posts and never sends email.
- `approvals.json`: created on the first approval. One record per post: decision, who, when, the email message id and a hash of the approved text.

## How it works

1. Edit the posts file, then run `node post-approvals.mjs render` to refresh the page.
2. The approval request goes to the approver by email (Gmail draft "Velstrian launch posts for your approval", sent by the driver once production is live).
3. When the approver replies, record it per post with the reply's Gmail message id:
   `node post-approvals.mjs approve P01 --by aparajita.parihar@gmail.com --at 2026-11-04T09:00:00Z --message-id <id>`
   Use `reject` the same way, with `--note` for the edits asked for.
4. `node post-approvals.mjs publishable` lists only posts with a valid approval for their current text.
5. The driver publishes by hand in the browser, then records it:
   `node post-approvals.mjs published P01 --url <post url>`
   This is refused unless the post is approved for its current text.

## The rules the script enforces

- Only the approvers in D535 can approve: aparajita.parihar@gmail.com, with backups crowagent.platform@gmail.com and monikaparul.singh@gmail.com.
- An approval needs who, when and the email message id.
- An approval binds to the exact text. Change the text and it must be approved again.

## Cost

None. It runs only when someone runs it on this machine. No timer, no cloud job, no paid tool or API (D533). Adding a schedule needs a written cost statement and the owner's approval first.
