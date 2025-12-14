# Testing Guide - Upwork Helper Extension

## 🧪 How to Test Each Feature

### Feature 1: Job Highlighting

**Test Location**: Job list page (Most Recent)

**Steps:**

1. Open: `https://www.upwork.com/nx/find-work/most-recent`
2. Wait 2-3 seconds for extension to load
3. Open browser console (F12)
4. Look for logs: "Found X jobs using selector..."

**Expected Result:**

- Jobs posted within 1 hour have **red border** with "🔥 SUPER NEW" badge
- Jobs posted within 2 hours have **green border** with "✨ NEW" badge
- Jobs posted within 4 hours have **blue border** with "⏰ RECENT" badge

**Console Logs:**

```
Upwork Helper: Jobs list script loaded
Upwork Helper: Found 2 jobs using selector: section[data-ev-opening_uid]
Upwork Helper: Found posting time: "5 minutes ago"
Upwork Helper: Highlighted job posted 5 minutes ago with class upwork-helper-1h
```

**Troubleshooting:**

- No highlights? → Check posting times (must be within 4 hours)
- Check console for errors
- Verify extension is enabled (icon colored, not grayed)
- Refresh the page

---

### Feature 2: Job Data Extraction

**Test Location**: Job page

**Steps:**

1. Click on any job from the list
2. Job page opens: `https://www.upwork.com/jobs/~0{jobId}`
3. Wait 2-3 seconds
4. Open console (F12)
5. Look for extraction logs

**Expected Result:**

- Console shows: "Job data extraction summary"
- Data includes title, description, skills, etc.
- Console shows: "Job data stored for job {jobId}"

**Console Logs:**

```
Upwork Helper: Detected job page
Upwork Helper: Found job title using selector: span.text-base.flex-1
Upwork Helper: Found job description using selector: [data-test="Description"]
Upwork Helper: Job data extraction summary: {
  foundTitle: true,
  foundDescription: true,
  foundBudget: true,
  ...
}
Upwork Helper: Job data stored for job 1999060037801980319
```

**Troubleshooting:**

- "Could not extract job data" → Check if page fully loaded
- Missing fields → Some job pages may not have all data
- Open console earlier to see logs

---

### Feature 3: Robot Check Detection

**Test Location**: Apply page (if robot check present)

**Steps:**

1. Navigate to apply page
2. If Cloudflare check appears
3. Extension should detect it

**Expected Result:**

- Notification appears: "Please complete the verification check"
- Extension waits
- After you complete: "Verification passed! Generating content..."

**Console Logs:**

```
Upwork Helper: Detected apply page
Upwork Helper: Checking for robot verification...
Upwork Helper: Cloudflare challenge detected by text content
[Extension waits for you to complete]
Upwork Helper: Robot check passed!
```

**Troubleshooting:**

- Not detected? → Extension may start generating (just wait)
- Detected but not starting? → Click manual generate button after passing

---

### Feature 4: Cover Letter Generation

**Test Location**: Apply page

**Steps:**

1. Click "Apply Now" on job page
2. Apply page opens in new tab
3. Wait for robot check (if any)
4. Wait 3-5 seconds for generation

**Expected Result:**

- Notification: "Generating content..."
- Cover letter textarea fills automatically
- Text has green highlight animation
- Notification: "Cover letter generated successfully!"

**Console Logs:**

```
Upwork Helper: Detected apply page
Upwork Helper: Apply page for job ID: 1999060037801980319
Upwork Helper: Starting cover letter generation
Upwork Helper: Job data ready for generation
Upwork Helper: Cover letter generated successfully
Upwork Helper: Cover letter injected into textarea
```

**What to Check:**

- [ ] Cover letter mentions correct job title
- [ ] Content is relevant to job description
- [ ] Professional tone
- [ ] No placeholder text like {{variableName}}
- [ ] Character count updated

**Troubleshooting:**

- Not generating? → Check API key in settings
- Placeholder text? → API call may have failed
- Wrong content? → Check stored job data matches current job
- Manual trigger: Look for "✨ Generate Cover Letter" button

---

### Feature 5: Screening Questions

**Test Location**: Apply page (jobs with questions)

**Steps:**

1. Apply to a job that has screening questions
2. Extension generates cover letter first
3. Then generates answers for questions
4. Each question textarea fills automatically

**Expected Result:**

- All question textareas filled
- Notification: "Generating answers for additional questions..."
- Final notification: "All content generated successfully!"

**Console Logs:**

```
Upwork Helper: Found 1 additional question(s)
Upwork Helper: Generating answer for: "Describe your recent experience..."
Upwork Helper: Answer generated for question 1
Upwork Helper: All content generated successfully!
```

**What to Check:**

- [ ] Answers match the questions
- [ ] Relevant to job requirements
- [ ] Not too generic
- [ ] Complete sentences

---

## 🔄 Full End-to-End Test

### Complete Workflow Test

**Time needed**: ~5 minutes

1. **Setup** (1 min)

   - Configure API key
   - Set template
   - Enable auto-generate
   - Save settings

2. **Find Job** (30 sec)

   - Go to Most Recent jobs
   - Look for highlighted job
   - Note the color (check posting time matches)

3. **View Job** (1 min)

   - Click job title
   - Job page loads
   - Check console for extraction logs
   - Verify data stored

4. **Apply** (2 min)

   - Click "Apply Now"
   - Apply page opens in new tab
   - Complete robot check if present
   - Wait for auto-fill
   - Verify both cover letter and questions filled

5. **Review** (1 min)

   - Read generated cover letter
   - Check screening answers
   - Edit as needed
   - Verify character count is within limit

6. **Submit**
   - Click "Submit Proposal"
   - Success! ✅

---

## 🎯 Test Cases

### Test Case 1: Recent Job (< 1 hour)

- **Expected**: Red border, "🔥 SUPER NEW" badge
- **Test with**: Job posted "5 minutes ago"

### Test Case 2: Fixed-Price Job

- **Expected**: Budget extracted as "$300.00"
- **Job Type**: "Fixed-price"

### Test Case 3: Hourly Job

- **Expected**: Budget extracted as "$20-$40"
- **Job Type**: "Hourly"

### Test Case 4: Job with Screening Questions

- **Expected**: Both cover letter AND question answers generated
- **Test with**: Job asking "Describe your recent experience..."

### Test Case 5: Job with Robot Check

- **Expected**: Extension waits, then generates after pass
- **Manual step**: Complete Cloudflare check

### Test Case 6: Manual Generation

- **Setup**: Disable auto-generate in settings
- **Expected**: Button appears "✨ Generate Cover Letter"
- **Test**: Click button, content generates

---

## 📊 Testing Checklist

### Before Release

- [ ] Job highlighting works on jobs list
- [ ] Data extraction works on job pages
- [ ] Apply page navigation works
- [ ] Cover letter generation works
- [ ] Screening questions filled
- [ ] Robot check detection works
- [ ] Manual button appears when auto-generate off
- [ ] Notifications display correctly
- [ ] Settings save and load correctly
- [ ] API key test function works
- [ ] Template variables work
- [ ] All console logs are helpful
- [ ] No JavaScript errors in console
- [ ] Styles load correctly
- [ ] Works on different Upwork page variants

### Performance Tests

- [ ] Extension doesn't slow down page load
- [ ] Mutation observer doesn't cause lag
- [ ] API calls complete in reasonable time (< 10 seconds)
- [ ] No memory leaks after multiple uses

### Edge Cases

- [ ] Job with no description
- [ ] Job with no skills listed
- [ ] Job with no client information
- [ ] Very long job description (> 5000 chars)
- [ ] Multiple browser tabs open
- [ ] Extension disabled then re-enabled
- [ ] Settings changed mid-workflow

---

## 🔍 Debug Mode

### Enable Verbose Logging

Add this to console before testing:

```javascript
// Set verbose mode
localStorage.setItem("upwork-helper-debug", "true");
```

### Check Stored Data

View all stored job data:

```javascript
chrome.storage.local.get(null, (data) => {
  console.log("All stored data:", data);
});
```

### View Specific Job Data

Replace {jobId} with actual job ID:

```javascript
chrome.storage.local.get("jobData_1999060037801980319", (data) => {
  console.log("Job data:", data);
});
```

### Clear Stored Data

If you need to reset:

```javascript
chrome.storage.local.clear(() => {
  console.log("Storage cleared");
});
```

---

## ✨ Success Criteria

A successful test means:

- ✅ Jobs are highlighted with correct colors
- ✅ Job data is extracted completely
- ✅ Cover letter generates within 10 seconds
- ✅ Content is relevant and personalized
- ✅ No JavaScript errors in console
- ✅ User can review and edit before submit
- ✅ Robot checks are handled gracefully

---

## 📞 Reporting Issues

When reporting bugs, include:

1. Full console log (F12 → Console)
2. Screenshots of the issue
3. Upwork page URL (remove sensitive info)
4. Extension version
5. Browser version
6. Steps to reproduce

---

**Happy Testing!** 🚀
