# Daily Bread v3 — clean rebuild

- 365 reading entries are built directly into `index.html`. No `app.js`, `style.css`, or `readings.json` is needed.
- All checkmarks begin unchecked (new v3 local storage key).
- Select any month; use previous/next buttons if preferred.
- The Backup button exports and restores saved progress. Automatic cloud sync is **not** configured.
- YouVersion NIV links open the starting chapter for each semicolon-separated reading group. For a range, continue reading through the listed ending chapter.

## Update existing GitHub Pages repository
1. Back up any progress you want to keep from an old version before switching.
2. Upload `index.html`, `manifest.webmanifest`, and the `icons/` folder to the root of your existing GitHub repository. Replace matching files and commit.
3. Optionally delete old `app.js`, `style.css`, `readings.json`, and `sw.js`. This app does not use them.
4. Wait for GitHub Pages deployment; open the website URL with `?v=3` appended to force the latest page (for example `https://USERNAME.github.io/daily-bread/?v=3`). Refresh on iPhone; if an installed Home Screen icon remains stuck on old version, remove that icon and add the site again.

This is a static Progressive Web App with a manifest and Home Screen icon. The schedule is in its HTML and available offline once that page is loaded, subject to browser caching. The page does not install a service worker in this version to avoid stale-cache problems.
