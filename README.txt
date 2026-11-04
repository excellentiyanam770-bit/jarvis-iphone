JARVIS iPhone starter — prototype 1

WHAT THIS IS
A small installable-web-app starter for iPhone. It has a JARVIS-style screen,
a chat log, simple demo replies (time/date/greeting/help), and spoken replies.
It does NOT yet connect to a real AI service or control the iPhone.

IMPORTANT
Do not put an OpenAI API key in index.html, app.js, or any file uploaded to
a public website. The next stage needs a secure backend to protect the key.

HOW TO PUT IT ONLINE FOR FREE
1. On your iPhone, open Safari and go to https://github.com.
2. Sign in or create a GitHub account.
3. Create a new PUBLIC repository named jarvis-iphone. Do not add a README
   (the starter already has one).
4. Open the new repository, choose Add file > Upload files.
5. Upload the five app files and README.txt from this ZIP:
   index.html, style.css, app.js, manifest.webmanifest, sw.js, README.txt
6. Commit the upload.
7. In the repository, open Settings > Pages.
8. Under Build and deployment, choose Deploy from a branch.
9. Select branch main and folder /(root), then Save.
10. Wait for GitHub Pages to publish. Open the URL shown on the Pages screen.
11. In Safari, tap Share > Add to Home Screen > Add.

HOW TO TEST
- Type: "Hello JARVIS"
- Type: "What time is it?"
- Type: "What is today's date?"
- Type: "Help"
- Allow audio if Safari asks. Speech output depends on iPhone settings.

IPHONE DICTATION
Tap the message box, then use the microphone on the iPhone keyboard to dictate.
This is the simplest reliable first voice-input method on iPhone Safari.

NEXT DEVELOPMENT STAGE
Connect a real AI through a server-side endpoint, then add safer, permission-
based Shortcuts/App Intents integrations. Never expose API secrets in the app.
