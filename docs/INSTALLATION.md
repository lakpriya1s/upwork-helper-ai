# Installation Guide - Upwork Helper Chrome Extension

## Quick Start (5 minutes)

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. **Important:** Save it somewhere safe - you won't see it again!

### Step 2: Create Extension Icons
The extension needs three icon files. Here's the easiest way to create them:

#### Option A: Use Online Tool (Recommended)
1. Go to [favicon.io](https://favicon.io/favicon-generator/)
2. Create a simple icon with text "UH" or an upwork-related design
3. Download the generated icons
4. Rename them to:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)
5. Place them in the `icons/` folder

#### Option B: Use Image Editor
1. Create three PNG images with dimensions 16x16, 48x48, and 128x128
2. Use a simple colored square with "UH" text
3. Save as `icon16.png`, `icon48.png`, and `icon128.png`
4. Place in the `icons/` folder

#### Option C: Quick Terminal Command (Mac/Linux)
If you have ImageMagick installed:

```bash
cd icons/
convert -size 128x128 xc:#667eea -gravity center -pointsize 72 -fill white -annotate +0+0 "UH" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

### Step 3: Load Extension in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle switch in top-right corner)
4. Click "Load unpacked" button
5. Navigate to and select the `upwork-helper` folder
6. Click "Select Folder"
7. The extension should now appear in your list!

### Step 4: Pin the Extension (Optional but Recommended)
1. Click the puzzle piece icon in Chrome toolbar
2. Find "Upwork Helper"
3. Click the pin icon to keep it visible

### Step 5: Configure Your Settings
1. Click the Upwork Helper icon in Chrome toolbar
2. Click "⚙️ Open Settings"
3. Paste your OpenAI API key in the "API Key" field
4. Click "Test API Key" to verify it works
5. (Optional) Customize the cover letter template
6. Click "💾 Save Settings"

### Step 6: Test It Out!
1. Go to [Upwork Job Search](https://www.upwork.com/nx/search/jobs)
2. Look for jobs with a green border and "🔥 NEW" badge (posted within 1 hour)
3. Click on any job to view details
4. If you're on an application page, the extension will auto-generate a cover letter!

## Verification Checklist

✅ OpenAI API key configured  
✅ Icons created and placed in `icons/` folder  
✅ Extension loaded in Chrome without errors  
✅ Extension icon visible (or pinned) in toolbar  
✅ Settings page opens and saves correctly  
✅ Recent jobs highlighted on search page  
✅ Cover letters generate on job detail pages  

## Common Issues

### Issue: "Failed to load extension"
**Solution:** Make sure you selected the folder containing `manifest.json`, not a parent folder.

### Issue: "API key not working"
**Solutions:**
- Verify the key starts with `sk-`
- Check you have API credits at [OpenAI Billing](https://platform.openai.com/account/billing)
- Test the key using the "Test API Key" button in settings

### Issue: "No jobs are highlighted"
**Possible reasons:**
- No jobs were posted within the last hour (try during peak hours)
- You're not on the correct Upwork page
- Clear cache and refresh the page

### Issue: "Cover letter not generating"
**Solutions:**
1. Check browser console (F12) for error messages
2. Verify API key is configured
3. Make sure you're on a job detail/application page
4. Try manually triggering from the extension popup

### Issue: "Extension icons missing"
**Solution:** 
- Follow Step 2 above to create icon files
- After adding icons, go to `chrome://extensions/` and click the refresh icon on the extension

## Getting Help

If you're still having issues:

1. **Check Console Logs:**
   - Press F12 to open DevTools
   - Check the "Console" tab for error messages
   - Look for messages starting with "Upwork Helper:"

2. **Check Extension Errors:**
   - Go to `chrome://extensions/`
   - Click "Errors" button on the Upwork Helper extension (if visible)

3. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click the refresh/reload icon on Upwork Helper
   - Try again

4. **Clear Storage:**
   - Right-click the extension icon
   - Go to "Manage extension"
   - Scroll to "Site permissions"
   - Clear site data if needed

## Next Steps

Now that your extension is installed:

1. **Customize Your Template:** Make the cover letter template your own
2. **Test Different Models:** Try GPT-4o for better quality (costs more)
3. **Monitor Usage:** Check your OpenAI usage at their dashboard
4. **Adjust Settings:** Toggle auto-generate on/off based on preference

## Security Notes

🔒 Your API key is stored locally in Chrome's secure storage  
🔒 No data is sent anywhere except to OpenAI  
🔒 The extension only accesses Upwork pages you visit  
🔒 Always review generated cover letters before submitting  

---

**You're all set! Happy job hunting! 🚀**

