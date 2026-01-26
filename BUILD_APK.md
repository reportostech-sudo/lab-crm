# How to Build the Android App (APK)

Since your application uses Next.js Server Actions, the mobile app works as a native wrapper around your running website.

## Prerequisites
1.  **Android Studio**: You must have [Android Studio](https://developer.android.com/studio) installed on your computer.
2.  **Running Server**: Your Next.js app must be running (either on your local network or a deployed URL).

## Step 1: Configure the Server URL

Open `capacitor.config.ts` in your project root. You will see a `server` section:

```typescript
server: {
  androidScheme: 'https',
  url: 'http://YOUR_LOCAL_IP_ADDRESS:3000', 
  cleartext: true
}
```

### Option A: Testing Locally (Same WiFi)
1.  Find your computer's local IP address.
    *   **Windows**: Open Command Prompt and type `ipconfig`. Look for "IPv4 Address" (e.g., `192.168.1.10`).
2.  Replace `YOUR_LOCAL_IP_ADDRESS:3000` with that IP, e.g., `http://192.168.1.10:3000`.
3.  Ensure your phone and computer are on the **same WiFi**.
4.  Run your Next.js app: `npm run dev -- -H 0.0.0.0` (this makes it accessible on the network).

### Option B: Production (Deployed App)
If you have deployed your app (e.g., to Vercel, AWS, or a VPS), simply put that URL there:
`url: 'https://lab-collection.your-site.com'`

## Step 2: Open in Android Studio

Run this command in your terminal:
```bash
npx cap open android
```
This will launch Android Studio with your project.

## Step 3: Build the APK

1.  Wait for Android Studio to sync the project (you'll see a loading bar at the bottom).
2.  In the top menu, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3.  Wait for the build to finish. A popup will appear at the bottom right saying "APK(s) generated successfully".
4.  Click **locate** in that popup.
    *   Or navigate manually to: `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 4: Install on Phone

1.  Send this `app-debug.apk` file to your collectors (via WhatsApp, Telegram, USB, etc.).
2.  They can open it on their Android phone to install.
    *   *Note: They might need to "Allow installation from unknown sources".*

## Troubleshooting

*   **White Screen / Connection Error**: This means the phone cannot reach the server.
    *   Check if you updated the `url` in `capacitor.config.ts`.
    *   If using local IP, make sure firewall is not blocking port 3000 and phones are on the same WiFi.
*   **Update App Code**: If you change your Next.js code, you **DO NOT** need to rebuild the APK! Since the APK just loads your website, updates to the website appear instantly in the app.
