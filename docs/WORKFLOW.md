# Upwork Helper - Simplified Workflow

## Overview
The extension now works in **manual mode** - you control the workflow and the extension automatically generates content on the apply page after you complete any robot checks.

## How It Works

### 1. Browse Jobs Manually
- Browse Upwork job listings as you normally would
- Review job details
- Decide which jobs to apply for

### 2. Click Apply Button
- When you're ready to apply, click the "Apply now" button on any job
- Upwork will automatically open the application page in a new tab
- **The extension does NOT automate this step**

### 3. Complete Robot Check (if present)
- If Cloudflare or CAPTCHA appears, complete it manually
- The extension will detect when you've passed the check
- You'll see a notification: "Verification passed! Generating content..."

### 4. Content Auto-Generation
- Once the apply page loads (and robot check is passed), the extension will:
  - ✅ Extract job requirements from the page
  - ✅ Generate a personalized cover letter using AI
  - ✅ Fill the cover letter textarea automatically
  - ✅ Answer additional questions if present

## What the Extension Does

### On Job Detail Card Pages
- Just logs that it detected the page
- **No automation** - you click Apply manually

### On Job Posting Pages
- Logs the page detection
- **No automation** - Upwork handles navigation

### On Apply Pages
- ✅ **Waits for you to complete any robot/CAPTCHA checks**
- ✅ **Automatically generates and fills content** once checks pass
- ✅ Shows notifications to guide you through the process

## Settings

Make sure these settings are configured in the extension options:

- **Auto Generate**: ✅ Enabled (to generate content automatically)
- **API Key**: Set to your Gemini API key

## Console Logs to Expect

When you manually navigate to an apply page, you'll see:

```
Upwork Helper: Job detail script loaded
Upwork Helper: Initializing job detail script
Upwork Helper: Checking for robot verification...
[If robot check present:]
  Upwork Helper: Robot check detected - waiting for user to complete
  [After you complete it:]
  Upwork Helper: Robot check passed!
  Upwork Helper: Auto-generate enabled, starting generation
  [Content generation logs...]
[If no robot check:]
  Upwork Helper: No robot check detected
  Upwork Helper: Auto-generate enabled, starting generation
  [Content generation logs...]
```

## Benefits of Manual Mode

1. ✅ **You stay in control** - you decide which jobs to apply for
2. ✅ **No popup blockers** - Upwork handles tab opening
3. ✅ **Simple and reliable** - less complexity, fewer edge cases
4. ✅ **Still saves time** - automatic content generation after you commit to applying

## Troubleshooting

### Content not generating?
1. Make sure you're on the apply page URL (`/nx/proposals/job/~/apply/`)
2. Check that "Auto Generate" is enabled in extension settings
3. Open console (F12) and look for error messages
4. If robot check appears, wait for it to complete

### Robot check not detected?
- The extension checks every second for the check to pass
- Complete the verification normally
- Content should generate within 2 seconds after passing

### Want to regenerate content?
- Refresh the page or
- Use the manual trigger button (if auto-generate is disabled)
