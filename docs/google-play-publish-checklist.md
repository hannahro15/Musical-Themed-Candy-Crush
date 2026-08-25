# Google Play publish checklist

This checklist is tailored to the current Musical Match Saga repository and Android setup.

## 1. Prepare the Android release configuration

- Confirm the Android package ID is still `com.musicalmatchsaga.game`.
- The Android app version is currently:
  - `versionCode 2`
  - `versionName "1.0.1"`
- Increase both values before each Play Store release.
- Create a release keystore and keep it out of source control.

Create `android/keystore.properties` with:

```properties
storeFile=/absolute/path/to/your-upload-keystore.jks
storePassword=your-store-password
keyAlias=your-key-alias
keyPassword=your-key-password
```

You can also provide the same values through these environment variables:

- `ANDROID_KEYSTORE_PATH`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

## 2. Build the Play Store bundle

From the repository root run:

```bash
npm install
npm run test
npm run android:bundle
```

This does all of the following:

- rebuilds the web assets into `www/`
- syncs the Capacitor Android project
- builds `bundleRelease`

The release bundle output is expected at:

`android/app/build/outputs/bundle/release/app-release.aab`

## 3. Verify Android assets before upload

Review and replace these Android assets if you want updated release branding:

- launcher icons in `android/app/src/main/res/mipmap-*/`
- round launcher icons in `android/app/src/main/res/mipmap-*/`
- splash assets in `android/app/src/main/res/drawable*/splash.png`

Also verify the web app icons used by the packaged app:

- `images/icon-192.svg`
- `images/icon-512.svg`

## 4. Confirm privacy and Play policy answers

Current app behavior in this repository:

- no sign-in
- no analytics or tracking SDK
- no ads
- local-only save data using `localStorage`

Use those facts when completing:

- Google Play Data safety
- app access declarations
- privacy policy review
- ads declaration
- target audience / families questionnaire

Privacy policy source in the repo:

- `privacy.html`

## 5. Prepare the Play Store listing

Store listing items still needed outside the repo:

- final app icon
- feature graphic
- phone screenshots
- optional 7-inch and 10-inch tablet screenshots
- support email / contact details
- category selection
- content rating questionnaire

Suggested listing copy draft:

- **App title:** Musical Match Saga
- **Short description:** Match musical symbols, beat level goals, and chase your best score.
- **Full description:** Musical Match Saga is a musical-themed match-3 puzzle game where players swap symbols, complete level objectives, manage moves and time, and build a high score across multiple levels.

## 6. Run release QA on Android devices

Before publishing, test the release build on real Android hardware for:

- touch and swipe responsiveness
- save / restore of progress
- game over, restart, next-level, and congratulations modals
- startup, splash screen, and resume behavior
- small-screen layout issues
- performance during long play sessions

## 7. Use Play Console testing before production

- Upload the `.aab` to an internal or closed test track first.
- Install from Play and repeat gameplay QA there.
- Fix any tester-reported issues before production rollout.
- If the Play developer account requires closed testing before production access, complete that requirement first.

## 8. Publish

Once testing is complete:

- create the production release
- upload the signed `.aab`
- complete the listing and policy forms
- submit the rollout
