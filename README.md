# Daily Bread (test PWA)

A small, installable Bible reading tracker using local device storage. It does not include copyrighted NIV Bible text. The **Read** links open YouVersion NIV, starting at the first chapter of each assigned range (continue through the listed ending chapter in YouVersion).

## Test data

January 1: Genesis 1-3 — supplied by user
January 2: Genesis 4-7 — supplied by user
January 3: Genesis 8-11 — TEMPORARY SAMPLE (not confirmed as part of 2023 B.R.E.A.D.)
January 4: Genesis 12-15 — TEMPORARY SAMPLE
January 5: Genesis 16-19 — TEMPORARY SAMPLE

## Publish for free using GitHub Pages

1. Sign into github.com and create a **public** repository called `daily-bread`. Do not check a README option; these files already include one.
2. Select **Add file > Upload files**. Upload the CONTENTS of the `daily-bread` folder (index.html, app.js, style.css, manifest.webmanifest, sw.js, README.md, and the `icons` directory). Verify index.html is at the repository root, not nested under another daily-bread folder.
3. Commit changes.
4. Go to **Settings > Pages > Build and deployment**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
5. Visit `https://YOUR-USERNAME.github.io/daily-bread/` after GitHub reports that the site is live. It must use HTTPS for install/offline support.
6. On iPhone, open that URL in **Safari**. Tap **Share > Add to Home Screen**. Enable **Open as Web App** if shown; tap **Add**.

No domain purchase or Apple Developer account needed. GitHub Pages serves the app publicly at its URL; do not add sensitive personal data to the repo. Progress is not uploaded: it is stored locally, per device and browser app. **Export backups regularly** from the app. If site data is cleared, checkmarks can disappear.

## Editing

Edit the `READINGS` array near the top of `app.js` and commit changes to your repository. Each entry has a stable `id`; keep existing IDs unchanged to preserve checkmarks. Update `CACHE` in `sw.js` from `daily-bread-shell-v1` to `daily-bread-shell-v2` (and so on) for each release. New code will be retrieved when the device is online; close/reopen the app to see changes if needed.

All links currently open at the first chapter of a reading range, not an entire multi-chapter view. YouVersion page formats may change.

## Test locally on a computer

Run `python -m http.server 8000` from this folder, then open http://localhost:8000. Directly opening index.html from a file may disable install/offline features.
