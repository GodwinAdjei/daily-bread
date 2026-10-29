# Daily Bread v2 — 2023 B.R.E.A.D. Bible reading tracker

Contains 365 daily passages, transcribed from the six close-up photos supplied by the owner of the booklet. Includes all twelve months, progress tracking, a next-unfinished-reading card, links opening YouVersion NIV at the **starting chapter** of each separated passage, offline schedule access after initial installation, backup export/import, and optional import of the booklet's existing checked boxes (January–May and June 1–5).

## Publish / update on GitHub Pages

1. Unzip this package.
2. Open your existing `daily-bread` repository on GitHub.
3. **Before updating**, open the current live app and export a backup under **Backup**, then save that backup file somewhere safe.
4. Upload **the files INSIDE the `daily-bread` folder**, replacing the repository's existing files. Be sure `index.html`, `app.js`, `style.css`, `readings.json`, `sw.js`, `manifest.webmanifest`, and `icons/` are at the repository root.
5. Commit your changes. GitHub Pages republishes automatically when your existing deployment uses the `main` branch and `/(root)`.
6. Open your app online and refresh. If it still shows only five entries, fully close/reopen the web app, or refresh Safari, to load the new service-worker cache. Check the progress first.
7. Click **Import checkmarks from my booklet** once if you want to bring in the 156 marked days seen in the photos. This adds completed days to existing ones without clearing the others.

If you don't have a repository yet: create a public GitHub repository `daily-bread`, upload the files at root, then enable Settings > Pages > Deploy from branch > main > /(root). Visit `https://YOUR-USERNAME.github.io/daily-bread/` in Safari and select Share > Add to Home Screen.

## Updating readings later

Edit `readings.json`. Keep each day's `id` the same, because it identifies stored checkmarks. `bookletChecked` is used for one-time import and is not an automatically enforced completion state.

## Notes and limitations

- The checkmarks are saved in this device's browser storage, **not the cloud**. Keep backup exports. Firebase cloud sync has not been implemented.
- YouVersion links open **at the first chapter** of each listed sub-passage, not necessarily the entire multi-chapter range or verse-specific start/end. Read the full printed assignment shown in the app. Internet is needed to read NIV.
- No NIV Bible text is stored or redistributed.
- The booklet photos show 156 checked days: January 31 + February 28 + March 31 + April 30 + May 31 + June 1–5.
- If a reading needs correction, edit its `passage` string in `readings.json` and republish.
- Do not overwrite the public GitHub repository with any private backup file: those backups contain your reading progress.
