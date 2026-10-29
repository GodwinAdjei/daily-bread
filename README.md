# Daily Bread v3 — Sunrise design + optional cloud sync

This release retains the **original 365 readings** and the existing local progress storage key. It removes the **booklet progress import** button. The backup-file export and restore remain available as an extra safety net.

## Important: Firebase is not automatically connected

The ZIP includes a working **local** version. Automatic cloud backup starts **only after** you set up your own Firebase project and fill out `firebase-config.js`.

## Part A: Deploy the visual refresh safely

1. On your current Daily Bread app, use **Backup > Export backup**, and save the JSON somewhere safe. Do not commit your personal backup JSON to a public GitHub repository.
2. In your GitHub repository, delete the older app files or replace each file and folder **at the same repository path**. Upload the contents of this ZIP's `daily-bread-v3-cloud` folder to the repository root. `index.html`, `app.js`, `readings.json`, etc. must be at the repository root, with the 3 icons inside `icons/`.
3. Verify `https://YOUR-USERNAME.github.io/daily-bread/` now displays the warm sunrise colors, cross photo icon, 365 readings, and a `Cloud sync` button.
4. Until Firebase is configured, the status will say **Saved on this device · Cloud setup required**. This is expected. You can check days as normal.

## Part B: Enable automatic Google cloud sync

1. Go to https://console.firebase.google.com/ and **Create a project**. For this personal app you can keep it on the free **Spark** plan. Google Analytics is not necessary.
2. Click **Build > Authentication > Get started > Sign-in method > Google > Enable**. Choose a project support email and save.
3. Under **Authentication > Settings > Authorized domains**, add `YOUR-USERNAME.github.io` (just the domain, not `https://` or `/daily-bread/`).
4. Under **Build > Firestore Database**, create a database (choose your preferred region). Start in **production mode** so it doesn't temporarily grant open access.
5. Open **Firestore Database > Rules** and paste the content of `firestore.rules`, then click **Publish**. These rules restrict each user to their own documents.
6. In **Project settings** (gear icon) > **General > Your apps**, register a **Web app** (`</>`). You do not need to enable Firebase Hosting. Copy the `firebaseConfig` fields.
7. Open `firebase-config.js` in the app files. Replace `PASTE_API_KEY`, `PASTE_PROJECT_ID` and `PASTE_APP_ID` with the values from your web-app configuration. The `authDomain` normally looks like `your-project-id.firebaseapp.com`. The Firebase config is a **public app identifier**, not a private service-account key.
8. Upload the updated `firebase-config.js` to the same GitHub repository and commit.
9. Open the website in **Safari** on your iPhone (not only the installed Home Screen icon). Tap **Cloud sync > Sign in with Google** and sign in. Google sign-in may work more reliably in Safari than inside an installed Home Screen web app.
10. Confirm the status reads **All progress synced to cloud**. Test checking **one** day and wait for that message. Then open the same address in another browser/device, sign into the **same Google account**, and verify that the checkmark appears.

If you're already signed in when you reset your iPhone, **only changes confirmed as synced are guaranteed in the cloud**. If you make changes offline, reconnect and wait for “All progress synced to cloud” before clearing storage. Export backups occasionally as an additional safeguard.

## What happens to your readings / existing progress?

- No schedule changes: `readings.json` is identical to the uploaded v2 file.
- Existing checkmarks on the same browser origin are kept under the same `daily-bread-completed-v1` storage key.
- First Google sign-in with an empty cloud account uploads locally checked days.
- When the cloud already contains progress (such as after a phone reset), the app restores those cloud checkmarks on sign-in.
- New check/uncheck actions save instantly on-device and queue a cloud write. Offline edits upload when you reconnect and the app is running.
- If you use several devices at once, avoid editing the same reading on both while offline. The last successfully synced change to that reading wins.

## Updates and icons

The home icon comes from your uploaded cross photo. iOS may retain an old Home Screen icon; if the appearance doesn't change after a reload, remove the Home Screen shortcut and add it again from Safari. Removing an icon may affect local website data, so confirm a cloud sync or export a backup first.

`sw.js` uses a new cache name for this version. If GitHub Pages still serves an old release, refresh in Safari and verify the repository has **no duplicate nested folder**.
