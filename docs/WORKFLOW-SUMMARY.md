# Upwork Helper - Workflow Summary

## 🎯 Complete Workflow

### Step 1: Job List Highlighting

**Page**: `https://www.upwork.com/nx/find-work/most-recent`

**What happens:**

- Extension highlights jobs based on posting time:
  - 🔥 **Red border** - Posted within 1 hour (SUPER NEW)
  - ✨ **Green border** - Posted within 2 hours (NEW)
  - ⏰ **Blue border** - Posted within 4 hours (RECENT)

### Step 2: Navigate to Job Page

**You manually**: Click on a job title or navigate to job page
**Page**: `https://www.upwork.com/jobs/~0{jobId}`

**What extension does:**

- Waits for page to load
- Extracts all job information:
  - Job title
  - Job description
  - Budget/rate
  - Required skills
  - Experience level
  - Duration
  - Client information (location, rating, spend, etc.)
  - Posting date
  - Proposals count
- Stores this data in browser storage
- **Logs to console**: "Job data stored for job {jobId}"

### Step 3: Click Apply Now

**You manually**: Click the "Apply Now" button on job page

**What extension does:**

- Detects navigation to apply page
- Opens in new tab automatically

### Step 4: Apply Page - Auto-Fill

**Page**: `https://www.upwork.com/nx/proposals/job/~0{jobId}/apply/`

**What extension does:**

1. **Checks for Robot Verification** (Cloudflare/CAPTCHA)

   - If detected: Shows notification "Please complete the verification check"
   - Waits for you to complete it manually
   - Monitors page every second
   - When passed: Shows "Verification passed! Generating content..."

2. **Retrieves Job Data**

   - Gets stored data from Step 2
   - If not found, extracts from current page

3. **Generates Cover Letter**

   - Sends job data to OpenAI API
   - Uses your custom template
   - Generates personalized cover letter
   - Auto-fills into the cover letter textarea
   - Shows notification: "Cover letter generated!"

4. **Handles Additional Questions**

   - Finds any screening questions (e.g., "Describe your recent experience...")
   - Generates answer for each question
   - Auto-fills the answers
   - Shows notification: "All content generated successfully!"

5. **Visual Feedback**
   - Filled textareas get a green highlight animation
   - Character count updates automatically
   - Ready for your review

### Step 5: Review & Submit

**You manually**:

- Review all generated content
- Edit as needed
- Click "Submit Proposal" button

---

## 📋 Key Information Extracted

From job page, the extension extracts:

| Field              | Description           | Example                                 |
| ------------------ | --------------------- | --------------------------------------- |
| `jobTitle`         | Job title             | "Senior React Native Developer"         |
| `description`      | Full job description  | "We are seeking..."                     |
| `budget`           | Budget or hourly rate | "$300.00" or "$20-$40"                  |
| `jobType`          | Fixed or Hourly       | "Fixed-price" or "Hourly"               |
| `experienceLevel`  | Required level        | "Expert", "Intermediate", "Entry Level" |
| `duration`         | Project duration      | "1-3 months", "30+ hrs/week"            |
| `skills`           | Required skills       | "React Native, JavaScript, iOS"         |
| `postingDate`      | When posted           | "18 minutes ago"                        |
| `proposalsCount`   | Number of proposals   | "Less than 5", "15 to 20"               |
| `clientLocation`   | Client country        | "Italy", "Ukraine"                      |
| `clientRating`     | Client rating         | "4.3"                                   |
| `clientJobsPosted` | Jobs posted           | "28"                                    |
| `clientHireRate`   | Hire rate             | "68%"                                   |
| `clientTotalSpent` | Total spent           | "$11K"                                  |
| `paymentVerified`  | Payment status        | "Yes" or "No"                           |

---

## 🔧 Technical Details

### Content Scripts Loaded

**On Jobs List Page:**

- `utils/dateParser.js` - Parses posting times
- `utils/jobExtractor.js` - Extracts job data
- `content-scripts/jobsList.js` - Highlights jobs
- `content-scripts/jobDetailWorkflow.js` - Manages workflow
- `styles/inject.css` - Visual styles

**On Job & Apply Pages:**

- `utils/jobExtractor.js` - Extracts job data
- `utils/templateEngine.js` - Template processing
- `content-scripts/jobDetail.js` - Generates content
- `content-scripts/jobDetailWorkflow.js` - Manages workflow
- `styles/inject.css` - Visual styles

### Data Storage

**Chrome Local Storage:**

- `jobData_{jobId}` - Extracted job information
- `lastExtractedJobId` - Last job that was processed
- `currentJobId` - Current active job
- `autoApplyInProgress` - Workflow state flag

**Chrome Sync Storage (Settings):**

- `apiKey` - Your OpenAI API key
- `template` - Cover letter template
- `autoGenerate` - Auto-generation enabled/disabled
- `openaiModel` - AI model selection
- `autoApply` - Auto-apply workflow enabled/disabled
- `highlight1h`, `highlight2h`, `highlight4h` - Highlight preferences

### Selectors Used

**Job Title:**

```javascript
"span.text-base.flex-1";
"h4 .text-base.flex-1";
```

**Job Description:**

```javascript
'[data-test="Description"] p.text-body-sm.multiline-text';
'[data-test="Description"] p.text-body-sm';
```

**Cover Letter Textarea:**

```javascript
'textarea[aria-labelledby="cover_letter_label"]';
"textarea.air3-textarea.inner-textarea";
```

**Screening Questions:**

```javascript
".fe-proposal-job-questions .form-group textarea";
```

---

## 🎨 Visual Indicators

### Highlight Colors

**1 Hour (Super New)**

```css
Border: #ff4444 (Red)
Background: rgba(255, 68, 68, 0.05)
Badge: "🔥 SUPER NEW"
```

**2 Hours (New)**

```css
Border: #4caf50 (Green)
Background: rgba(76, 175, 80, 0.05)
Badge: "✨ NEW"
```

**4 Hours (Recent)**

```css
Border: #2196f3 (Blue)
Background: rgba(33, 150, 243, 0.05)
Badge: "⏰ RECENT"
```

### Notifications

- **Info** (Blue): "Generating content...", "Please complete verification..."
- **Success** (Green): "Cover letter generated!", "Verification passed!"
- **Error** (Red): "Error: Could not extract job data"

---

## 🚀 Usage Guide

### Quick Start

1. **Configure Extension**

   - Click extension icon
   - Go to Settings
   - Add your OpenAI API key
   - Customize template (optional)
   - Enable auto-generate
   - Save settings

2. **Browse Jobs**

   - Go to: https://www.upwork.com/nx/find-work/most-recent
   - Look for highlighted jobs (colored borders)
   - Recent jobs = better chance of winning

3. **Apply to Job**

   - Click highlighted job title
   - Review job details on job page
   - Click "Apply Now" button
   - Apply page opens in new tab

4. **Wait for Auto-Fill**

   - If robot check appears: Complete it manually
   - Extension waits for you
   - After passing: Content auto-generates
   - Cover letter + screening questions filled

5. **Review & Submit**
   - Review generated content
   - Make any edits
   - Click "Submit Proposal"
   - Done! ✅

---

## ⚙️ Settings Explained

### Auto-Generate

**Default**: Enabled
**What it does**: Automatically generates cover letters when you visit apply pages
**When to disable**: If you want manual control via button

### Auto-Apply Workflow (Experimental)

**Default**: Disabled
**What it does**: Automates clicking "Apply Now" buttons
**Warning**: Experimental feature, use with caution

### Highlighting Time Windows

**Default**: All enabled

- 1 hour window: For the freshest jobs
- 2 hour window: Still very recent
- 4 hour window: Recent enough to apply

### AI Model

**Default**: GPT-4o Mini
**Options**:

- GPT-4o Mini: Fast & affordable (recommended)
- GPT-4o: More advanced, more expensive
- GPT-4 Turbo: Premium option
- GPT-3.5 Turbo: Fastest & cheapest

---

## 🐛 Troubleshooting

### "Job data extraction failed"

**Solutions:**

1. Refresh the job page
2. Wait for page to fully load
3. Check browser console (F12) for specific errors
4. Verify you're on a valid Upwork job page

### "Cover letter not generated"

**Check:**

1. API key is valid (test in settings)
2. Internet connection is working
3. No OpenAI API errors (check console)
4. Auto-generate is enabled

### "Textareas not filled"

**Possible causes:**

1. Page structure changed (Upwork update)
2. Textarea not found (check console logs)
3. Vue.js events not triggered properly
4. Refresh page and try manual button

### Robot Check Not Detected

If extension starts generating while robot check is present:

1. Complete the check manually
2. Click the manual "✨ Generate Cover Letter" button after

### Highlights Not Showing

**Check:**

1. You're on the "Most Recent" tab
2. Jobs are actually recent (within 4 hours)
3. Highlight settings are enabled
4. Extension is active (icon not grayed out)

---

## 📝 Console Logs Guide

### Successful Workflow Logs

```
Upwork Helper: Jobs list script loaded
Upwork Helper: Found 2 jobs using selector: section[data-ev-opening_uid]
Upwork Helper: Found posting time: "5 minutes ago"
Upwork Helper: Highlighted job posted 5 minutes ago with class upwork-helper-1h
Upwork Helper: Detected job page
Upwork Helper: Found job title using selector: span.text-base.flex-1
Upwork Helper: Found job description using selector: [data-test="Description"] p.text-body-sm
Upwork Helper: Job data stored for job 1999060037801980319
Upwork Helper: Detected apply page
Upwork Helper: No robot check detected
Upwork Helper: Starting cover letter generation
Upwork Helper: Cover letter generated successfully
Upwork Helper: All content generated successfully!
```

### Error Logs to Watch For

```
❌ "DateParserUtils not loaded" - Extension not properly initialized
❌ "Could not extract job data" - Selectors not matching
❌ "API key is invalid" - Check your OpenAI API key
❌ "Failed to generate cover letter" - OpenAI API error
❌ "Textarea not found" - Page structure changed
```

---

## 🔐 Privacy & Security

- **API Key**: Stored locally in browser, never sent to any server except OpenAI
- **Job Data**: Stored temporarily in local storage, cleared after use
- **No External Tracking**: Extension doesn't send data anywhere except OpenAI for generation
- **Open Source**: All code is visible and auditable

---

## 💡 Pro Tips

1. **Focus on Fresh Jobs**: Jobs highlighted in red (1 hour) have the fewest proposals
2. **Customize Your Template**: Generic templates work, but personalized ones perform better
3. **Review Before Submitting**: Always read and edit generated content
4. **Monitor Your Connects**: Each proposal costs connects, manage them wisely
5. **Check Console**: F12 opens console - useful for debugging
6. **Test Your Setup**: Use the "Test API Key" button in settings first
7. **Keep Template Updated**: Update your template based on what works

---

## 📊 Cost Estimation

### OpenAI API Costs (GPT-4o Mini)

- **Per Cover Letter**: ~$0.001 - $0.003
- **Per Screening Answer**: ~$0.0005 - $0.001
- **100 Applications**: ~$0.15 - $0.50

**Note**: Actual costs depend on template length and job description length.

---

## 🆘 Support & Updates

- Check console (F12) for detailed logs
- Review generated content before submitting
- Update extension regularly for bug fixes
- Report issues on GitHub (if open source)

---

## ✅ Checklist for First Use

- [ ] Extension installed and enabled
- [ ] OpenAI API key added in settings
- [ ] API key tested successfully
- [ ] Template customized (or using default)
- [ ] Auto-generate enabled
- [ ] Highlighting preferences set
- [ ] Tested on one job successfully
- [ ] Understand manual review is required

---

**Version**: 1.1.0  
**Last Updated**: December 2025

**Remember**: This extension is a helper tool. Always review and customize generated content for best results!
