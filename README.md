# Daily Bread v3.2 — Clean re-upload

This ZIP contains ALL files needed for GitHub Pages, including your configured Firebase project, all 365 readings, and cross-photo icons. No booklet import feature.

## Update safely

1. On your currently working Daily Bread app, **Backup > Export backup** and save the JSON in Files/iCloud or your computer. Do this before touching GitHub. Deleting GitHub files does not erase on-device checkmarks, but clearing iPhone website data can.
2. Open the GitHub `daily-bread` repository. Delete the old website files (and old `icons` directory contents) from the repository, **not the entire repository**. If GitHub makes this cumbersome, it is fine to replace the files by uploading with identical paths, but verify there is exactly one copy of each at the repository root.
3. Extract this ZIP, then upload its **contents**, not the ZIP itself. Include the `icons` folder and all .js/.css/.json/.webmanifest files. The `firestore.rules` file is for reference; it is not used by GitHub Pages. `README.md` is documentation.
4. Commit changes and let GitHub Pages deploy. In a fresh regular browser tab open `https://YOUR-USERNAME.github.io/daily-bread/?v=3.2` and test the Cloud sync button. If an installed home screen copy still shows old code, open the browser URL first; service workers can keep old assets briefly. Do not clear browser data to troubleshoot until cloud backup has been verified.
5. In Firebase: enable Google Authentication, authorize `YOUR-USERNAME.github.io` under Auth > Settings > Authorized domains, and publish the rules in `firestore.rules` in Firestore Rules.
6. Sign in from the browser and check a day; confirm Firestore records exist under `users/{uid}/readingProgress/{dayId}` and the status says 'All progress synced to cloud'. Confirm the checkmark appears when signing in through a different browser BEFORE trusting restoration.

## Notes

- This package uses your Firebase web configuration (`sustenance-9c9a9`). Firebase web config is public metadata; Firestore rules protect user data.
- All checkmarks are stored locally immediately; Firebase is an optional synchronized copy and requires successful sign-in and network access.
- Service worker cache bumped to v3.2. The Cloud sync dialog is independently wired so the button opens even when Firebase libraries are blocked; it then displays an error instead of silently doing nothing.
- The previous v3 code didn't dispatch `dailybread:ready`, so the fixed `app.js` now emits that event after loading readings.
- A GitHub repository used for Pages is public. Do not commit backup JSON files containing personal reading progress.
- ZIP is not a deployment; cloud sync is not validated until you've uploaded and verified it in your Firebase project.
