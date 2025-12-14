# Upwork Selector Reference Guide

This document contains the actual DOM selectors used by Upwork for key elements. Use this reference if Upwork updates their UI and the extension needs updating.

## Proposal Submission Page

### URL Patterns
```
https://www.upwork.com/nx/proposals/job/~[JOB_ID]/apply/
https://www.upwork.com/jobs/[JOB_TITLE]~[JOB_ID]/
https://www.upwork.com/ab/proposals/job/[JOB_ID]/
```

### Cover Letter Textarea

**Primary Selector:**
```css
textarea[aria-labelledby="cover_letter_label"]
```

**Full Structure:**
```html
<div data-v-cf0298f4="" class="air3-textarea textarea-wrapper p-0">
  <textarea 
    data-v-cf0298f4="" 
    rows="10" 
    placeholder="" 
    aria-labelledby="cover_letter_label" 
    class="air3-textarea inner-textarea">
  </textarea>
</div>
```

**Working Selectors (in priority order):**
1. `textarea[aria-labelledby="cover_letter_label"]` ✅ Most reliable
2. `textarea.air3-textarea.inner-textarea[aria-labelledby="cover_letter_label"]`
3. `.air3-textarea.textarea-wrapper textarea.inner-textarea`
4. `textarea[rows="10"]` (less specific)

### Additional Question Textareas

**Container:**
```css
.fe-proposal-job-questions.questions-area
```

**Full Structure:**
```html
<div class="fe-proposal-job-questions questions-area">
  <div class="form-group mb-8x has-error">
    <label id="" class="label">
      Describe your recent experience with similar projects
    </label>
    <div class="air3-textarea textarea-wrapper p-0">
      <textarea 
        rows="10" 
        placeholder="" 
        aria-labelledby="" 
        class="air3-textarea inner-textarea">
      </textarea>
    </div>
  </div>
</div>
```

**Working Selectors:**
```javascript
// Get all question textareas
document.querySelectorAll('.fe-proposal-job-questions textarea.air3-textarea.inner-textarea')

// Get question container
document.querySelector('.fe-proposal-job-questions')
```

## Job Search/Listing Page

### URL Patterns
```
https://www.upwork.com/nx/search/jobs?*
https://www.upwork.com/ab/find-work*
```

### Job Cards

**Selectors to try (may vary):**
```css
[data-test="job-tile"]
[data-test="JobTile"]
article[class*="job"]
section[class*="job-tile"]
[data-ev-label="search_result_impression"]
```

### Job Posting Time

**Selectors:**
```css
[data-test="posted-on"]
[data-test="PostedOn"]
small[class*="posted"]
span[class*="posted"]
```

**Text format examples:**
- "Posted 30 minutes ago"
- "Posted 2 hours ago"
- "Posted just now"

## Job Detail Page (Viewing Job)

### Job Title
```css
h2[class*="job-title"]
h1[class*="job-title"]
[data-test="job-title"]
```

### Job Description
```css
[data-test="Description"] [class*="text-pre-line"]
.break [class*="text-pre-line"]
[data-test="job-description"]
```

### Budget/Rate
```css
[data-test="budget"]
[data-test="is-fixed-price-amount"]
[data-test="hourly-rate"]
```

### Skills
```css
[data-test="token"]
[class*="skill-badge"]
[data-test="skills"] span
.up-skill-badge
```

### Client Information
```css
[data-test="client-name"]
[data-test="client-location"]
[data-test="client-rating"]
[data-test="client-jobs-posted"]
[data-test="hire-rate"]
[data-test="total-spent"]
```

## Vue.js Event Handling

Upwork uses Vue.js (indicated by `data-v-*` attributes). When programmatically filling textareas, trigger these events:

```javascript
// Standard events
textarea.dispatchEvent(new Event('input', { bubbles: true }));
textarea.dispatchEvent(new Event('change', { bubbles: true }));

// Vue-specific events
textarea.dispatchEvent(new Event('blur', { bubbles: true }));
textarea.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
```

## Framework & Technology Stack

**Upwork's Tech Stack (observed):**
- **Framework:** Vue.js 2.x or 3.x (data-v-* attributes)
- **CSS Framework:** Custom "air3-*" classes (Upwork's design system)
- **State Management:** Likely Vuex or Pinia
- **Build Tool:** Webpack or Vite

## Data Attributes

**Common data attributes used by Upwork:**
- `data-test="*"` - Testing/QA selectors (most stable)
- `data-v-*` - Vue component scoping
- `data-ev-*` - Event tracking/analytics

**Priority for selectors:**
1. `data-test` attributes (most stable, unlikely to change)
2. Specific class combinations (e.g., `air3-textarea.inner-textarea`)
3. ARIA attributes (e.g., `aria-labelledby`)
4. Generic attributes (e.g., `rows`, `placeholder`)

## Maintenance Tips

### If Extension Breaks After Upwork Update:

1. **Inspect the page:**
   - Right-click → Inspect Element (F12)
   - Find the cover letter textarea
   - Note new classes/attributes

2. **Update selectors in:**
   - `content-scripts/jobDetail.js` - findCoverLetterTextarea()
   - `utils/jobExtractor.js` - extractJobData()
   - `content-scripts/jobsList.js` - findJobCards()

3. **Test multiple pages:**
   - Different job types (hourly vs fixed-price)
   - Different proposal forms
   - Different job categories

4. **Update this document** with new selectors

## Debugging Tools

### Console Commands

```javascript
// Find cover letter textarea
document.querySelector('textarea[aria-labelledby="cover_letter_label"]')

// Find all textareas
document.querySelectorAll('textarea')

// Find job cards
document.querySelectorAll('[data-test="job-tile"]')

// Check if on proposal page
window.location.href.includes('/proposals/job/')

// Test textarea injection
const textarea = document.querySelector('textarea[aria-labelledby="cover_letter_label"]');
textarea.value = 'Test';
textarea.dispatchEvent(new Event('input', { bubbles: true }));
```

### Extension Debugging

```javascript
// In content script console
console.log('Upwork Helper: Debug info');

// Check if utilities loaded
console.log('JobExtractor:', window.JobExtractorUtils);
console.log('TemplateEngine:', window.TemplateEngineUtils);

// Extract job data
const jobData = window.JobExtractorUtils.extractJobData();
console.log(jobData);
```

## Known Variations

Upwork sometimes A/B tests different UI versions. Known variations:

### Job Search Pages:
- `/nx/search/jobs` (newer)
- `/ab/find-work` (older)

### Proposal Pages:
- `/nx/proposals/job/~/apply/` (newer)
- `/ab/proposals/job/` (older)

### Design Systems:
- `air3-*` classes (current)
- `up-*` classes (older, still used in some places)

## Future-Proofing

To make the extension more resilient to Upwork updates:

1. **Use multiple fallback selectors** (already implemented)
2. **Prefer `data-test` attributes** (most stable)
3. **Avoid overly-specific selectors** (fragile)
4. **Test on multiple page types** regularly
5. **Monitor Upwork's changelog** for UI updates

## Update History

| Date | Change | Reason |
|------|--------|--------|
| 2024-12-11 | Initial selectors documented | Based on current Upwork UI |
| 2024-12-11 | Added `/nx/proposals/job/*` pattern | User reported new URL format |

---

**Last Updated:** December 11, 2024  
**Upwork UI Version:** Current as of date above

*This is a living document. Update as Upwork changes their UI.*

